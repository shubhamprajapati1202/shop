const express = require("express");
const router = express.Router()

const productsRoutes = require("./products");
const usersRoutes = require("./users")
const orderRoutes = require("./orders")

router.use("/products", productsRoutes)
router.use("/users", usersRoutes)
router.use("/orders", orderRoutes)


module.exports = router