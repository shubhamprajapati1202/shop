const express = require("express");
const router = express.Router()
const productsController = require("../controllers/products")

router.route("/").get(productsController.productList).post(productsController.createProduct)
router.route("/:id").get(productsController.getProductById).delete(productsController.deleteProductById).put(productsController.updateProductById)


module.exports = router