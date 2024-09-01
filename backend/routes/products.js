const express = require("express");
const router = express.Router()
const { authorization, authorizeRoles } = require("../middleware/auth")
const productsController = require("../controllers/products")

/***Admin */
router.post("/", authorization, authorizeRoles("admin"), productsController.createProduct)
router.put("/:id", authorization, authorizeRoles("admin"), productsController.updateProductById)
router.delete("/:id", authorization, authorizeRoles("admin"), productsController.deleteProductById)

router.get("/", productsController.productList)
router.get("/:id", productsController.getProductById)


module.exports = router