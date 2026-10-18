const express = require("express");

const app = express();

app.use(express.json());

//Routes
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");

app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use(express.static("public"))

module.exports = app