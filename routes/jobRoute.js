const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const { 
    scheduleJob, 
    unscheduleJob, 
    getAllJobs, 
    getJob 
} = require("../services/cronService");

router.post("/assign", async (req, res, next) => {
    const { cron_expr, task_type, task_payload } = req.body;

    if (!cron_expr) {
        return res.status(400).json({ message: "Cron expression is required" });
    }
    
    if (!cron.validate(cron_expr)) {
        return res.status(400).json({ message: "Invalid cron expression" });
    }

    if (!task_type || !["logging", "api"].includes(task_type)) {
        return res.status(400).json({ message: "Valid task_type is required (logging or api)" });
    }

    try {
        const newJob = await scheduleJob(cron_expr, task_type, task_payload, next);
        res.status(201).json({ 
            message: "Job scheduled successfully",
            job: newJob
        });
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const jobs = await getAllJobs();
        res.status(200).json({
            count: jobs.length,
            jobs
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:jobId", async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const job = await getJob(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        res.status(200).json(job);
    } catch (error) {
        next(error);
    }
});

router.delete("/:jobId", async (req, res, next) => {
    try {
        const { jobId } = req.params;
        
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        
        const result = await unscheduleJob(jobId, next);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
