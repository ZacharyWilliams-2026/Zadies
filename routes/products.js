const express = require("express");
const sql = require("mssql");

const router = express.Router();

//Get all products

router.get("/", async (req, res) => {
    try {

        const result = await sql.query `
        SELECT * FROM Products `

        res.json(result.recordset);

    } catch (error) {

        console.log("Failed to retries products", error);

        res.status(500).json({
            error: "Failed to retrieve errors"
        })

    }
})

//Get by ProductID
router.get("/:ProductID", async (req, res) => {
    try {

        const ProductID = req.params.ProductID;

        const result = await sql.query `
        SELECT * FROM PRODUCTS
        WHERE ProductID = ${ProductID};
        `

        if (result.recordset.length === 0) {
            console.log("Failed to retrieve product.");

            return res.status(404).json({
                error: "Failed to retrieve product"
            })
        }
        res.json(result.recordset[0])
    } catch (error) {
        console.log("failed to retrieve product", error);

        res.status(500).json({
            error: "Failed to retrieve product"
        })
    }
})

module.exports = router;