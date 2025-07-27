const cron = require("node-cron")
const pool = require("../config/dbconfig")
const axios = require('axios');

const jobs = new Map();

const scheduleJob = async (cron_expr, task_type, task_payload, next) => {
    try {
        const dbentry = await pool.query(
            `INSERT INTO JOB (cron_expr, task_type, task_payload, status) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, cron_expr, task_type, task_payload, status`,
            [cron_expr, task_type, task_payload, 'scheduled']
        );
        
        const jobId = dbentry.rows[0].id;
        const task = cron.schedule(cron_expr, async () => {
            try {
                await pool.query(
                    `UPDATE job SET status = 'running', last_run = CURRENT_TIMESTAMP WHERE id = $1`,
                    [jobId]
                );

                if (task_type === "logging") {
                    console.log(`[Job ${jobId}]: ${task_payload.message}`);
                } else if (task_type === "api") {
                    console.log(`[Job ${jobId}]: Executing API call to ${task_payload.url}`);
                    const response = await axios({
                        method: task_payload.method || 'GET',
                        url: task_payload.url,
                        data: task_payload.body,
                        headers: task_payload.headers || {},
                        params: task_payload.params || {}
                    });
                    console.log(`[Job ${jobId}]: API call successful`, response.data);
                    
                    await pool.query(
                        `UPDATE job SET last_response = $1 WHERE id = $2`,
                        [JSON.stringify(response.data), jobId]
                    );
                } else {
                    console.error(`[Job ${jobId}]: Invalid Task Type!`);
                }
                
                await pool.query(
                    `UPDATE job SET status = 'scheduled' WHERE id = $1`,
                    [jobId]
                );
            } catch (err) {
                console.error(`[Job ${jobId}]: Error executing job:`, err);
                await pool.query(
                    `UPDATE job SET status = 'failed', error = $1 WHERE id = $2`,
                    [err.message, jobId]
                );
            }
        });

        jobs.set(jobId, task);
        task.start();

        return { ...dbentry.rows[0], jobId };
    } catch (error) {
        next(error);
    }
};

const unscheduleJob = async (jobId, next) => {
    try {        
        const result = await pool.query(
            `SELECT * FROM job WHERE id = $1`,
            [jobId]
        );

        if (result.rowCount === 0) {
            throw new Error("Job not found");
        }

        const task = jobs.get(Number(jobId));
        if (task) {
            task.stop();
            jobs.delete(Number(jobId));
            console.log(`[Job ${jobId}]: Stopped`);
        }

        await pool.query(
            `UPDATE job SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [jobId]
        );

        return { message: `Job ${jobId} has been cancelled` };
    } catch (error) {
        next(error);
    }
};

const getAllJobs = () => {
    return Array.from(jobs.entries()).map(([jobId, task]) => ({
        jobId,
        task: task.task
    }));
};

const getJob = (jobId) => {
    const task = jobs.get(Number(jobId));
    if (!task) return null;
    return {
        jobId,
        task: task.task
    };
};

module.exports = { 
    scheduleJob, 
    unscheduleJob,
    getAllJobs,
    getJob
};