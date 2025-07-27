const cron = require("node-cron")
const express = require("express")

const jobRoute = require("./routes/jobRoute")
const errorHandler = require("./middleware/errorHandler")

const app = express()
app.use(express.json())

app.use("/job", jobRoute)

app.use(errorHandler)

const PORT = 4001

app.listen(PORT, () => {
    console.log("Everything's Fine")
    console.log(`Server running on port ${PORT}`)
})




