const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");

const router = express.Router();


//Get all users
router.get("/", async (req, res) => {
    try {

        const result = await sql.query `
        SELECT * FROM Users
        `
        res.json(result.recordset);

    } catch (error) {
        console.log("Failed to retrieve users", error);

        res.status(500).json({
            error: "Failed to retrieve users"
        })
    }
})

//Get by UserID
router.get("/:UserID", async (req, res) => {
    try {
        const UserID = req.params.UserID;

        const result = await sql.query `
        SELECT * FROM USERS
        WHERE UserID = ${UserID}`

        if (result.recordset.length === 0) {
            console.log("Failed to retrieve user, User does not exist.")

            return res.status(404).json({
                error: "user not found."
            })
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.log("Failed to retrieve, user does not exist.", error);

        res.status(404).json({
            error: "Failed to retrieve user"
        })
    }
})

//Register user
router.post("/", async (req, res) => {
    try {

        const { FirstName, LastName, Email, PasswordHash, Phone} = req.body;

        if (!FirstName || !LastName|| !Email || !PasswordHash || !Phone
        ) {
            console.log("Failed to create user")
            return res.status(400).json({
                error: "Failed to create user."
            })
        }

        const emailExists = await sql.query `
        SELECT * FROM USERS
        WHERE Email = ${Email}
        `

        if (emailExists.recordset.length > 0) {
            return res.status(409).json({
                error: "An account with this email already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(PasswordHash, 10);

        const result = await sql.query `
        
        INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Phone)
        OUTPUT INSERTED.*
        VALUES (${FirstName}, ${LastName}, ${Email}, ${hashedPassword}, ${Phone})
        
        `
        return res.status(201).json(result.recordset[0])

    }   catch (error) {
        console.log("Failed to create user", error);

        res.status(500).json({
            error: "Failed to create user account"
        })
    }
})

//Login user
router.post("/login", async (req, res) => {
    try {

        const { Email, Password} = req.body;

        const result = await sql.query `
        SELECT * FROM USERS
        WHERE Email = ${Email}  
        `

        if (result.recordset.length > 0) {
            console.log("Valid Email address")
        } else {
            return res.status(401).json({
                error: "Failed to find email."
            })
        }

        const passwordMatch = await bcrypt.compare(Password, result.recordset[0].PasswordHash)

        if (passwordMatch) {
            console.log("Password matches")
        } else {
            return res.status(401).json({
                error: "Password does not match."
            })
        }

        res.json(result.recordset[0]);
    }   catch (error) {
        console.error("Invalid credentials entered", error);

        res.status(500).json({
            error: "Invalid credentials entered"
        })
    }
})

module.exports = router