const sql = require("mssql");
require("dotenv").config()

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Failed to connect to Server", error);
        throw error;
    }
}

module.exports = connectDB;