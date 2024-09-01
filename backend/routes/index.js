const express = require("express");
const router = express.Router()
const productsRoute = require("./products");
const usersRoute = require("./users")

router.use("/products", productsRoute)
router.use("/users", usersRoute)


module.exports = router