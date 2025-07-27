require("dotenv").config()

const {Pool} = require("pg")

const connectionString = process.env.POSTGRES_URI

if(!connectionString){
    console.error("Postgres URL not set")
    process.exit(1)
}

const pool = new Pool({
    connectionString
})

module.exports = pool