# Cron Job Scheduler Service

A robust and scalable cron job scheduler service built with Node.js, Express, and PostgreSQL. CronCloud allows you to schedule and manage recurring tasks with ease, supporting various task types including logging and API calls.

## Features

- 🕒 Schedule recurring tasks using cron expressions
- 🔄 Support for multiple task types (logging, API calls)
- 📊 Track job execution status and history
- 🔄 Manage jobs (create, view, cancel)
- 💾 Persistent job storage with PostgreSQL
- 🛡️ Error handling and logging
- 🚀 Simple REST API for job management

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Indra55/Cron-Job-Scheduler-Service
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   POSTGRES_URI=postgresql://username:password@localhost:5432/croncloud
   PORT=4001
   ```

4. Set up the database:
   Create a new PostgreSQL database and run the following SQL to create the required table:
   ```sql
   CREATE TABLE job (
       id SERIAL PRIMARY KEY,
       cron_expr TEXT NOT NULL,
       task_type VARCHAR(50) NOT NULL,
       task_payload JSONB,
       status VARCHAR(20) NOT NULL,
       last_run TIMESTAMP,
       cancelled_at TIMESTAMP,
       error TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## API Endpoints

### Schedule a New Job
```
POST /job/assign
```

**Request Body:**
```json
{
    "cron_expr": "*/5 * * * *",
    "task_type": "logging",
    "task_payload": {
        "message": "This is a test log message"
    }
}
```

**Response:**
```json
{
    "message": "Job scheduled successfully",
    "job": {
        "id": 1,
        "cron_expr": "*/5 * * * *",
        "task_type": "logging",
        "status": "scheduled",
        "jobId": 1
    }
}
```

### Get All Scheduled Jobs
```
GET /job
```

**Response:**
```json
{
    "count": 2,
    "jobs": [
        {
            "jobId": 1,
            "task": {
                "cron_expr": "*/5 * * * *",
                "task_type": "logging",
                "status": "scheduled"
            }
        },
        {
            "jobId": 2,
            "task": {
                "cron_expr": "0 * * * *",
                "task_type": "api",
                "status": "scheduled"
            }
        }
    ]
}
```

### Cancel a Job
```
DELETE /job/:jobId
```

**Response:**
```json
{
    "message": "Job 1 has been cancelled"
}
```

## Task Types

### 1. Logging Task
Executes a simple logging operation with the provided message.

**Example Payload:**
```json
{
    "message": "This is a test log message"
}
```

### 2. API Task
Makes an HTTP request to the specified endpoint.

**Example Payload:**
```json
{
    "url": "https://api.example.com/endpoint",
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer your_token"
    },
    "body": {
        "key": "value"
    }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `400 Bad Request`: Invalid input (e.g., missing required fields, invalid cron expression)
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server-side error

## Development

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. The server will be available at `http://localhost:4001`

## Testing

To run the test suite:
```bash
npm test
# or
yarn test
```

## Deployment

1. Set up a production PostgreSQL database
2. Update the `POSTGRES_URI` in your environment variables
3. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```
4. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Environment Variables

- `PORT`: Port on which the server will run (default: 4001)
- `POSTGRES_URI`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [node-cron](https://www.npmjs.com/package/node-cron) - Task scheduler for Node.js
- [Express](https://expressjs.com/) - Web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/) - Powerful, open source object-relational database system
