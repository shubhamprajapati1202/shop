const express = require("express");
const router = express.Router()
const { authorization, authorizeRoles } = require("../middleware/auth")
const productsController = require("../controllers/products")


router.get("/", productsController.productList)
router.get("/:id", productsController.getProductById)
router.get("/reviews/:productId", productsController.getParticularPrdocutRatingReviews)
router.put("/reviews/:productId", authorization, productsController.addUpdateReview)
router.delete("/reviews/:productId/:reviewId", authorization, productsController.deleteReview)


/***Admin */
router.post("/", authorization, authorizeRoles("admin"), productsController.createProduct)
router.put("/:id", authorization, authorizeRoles("admin"), productsController.updateProductById)
router.delete("/:id", authorization, authorizeRoles("admin"), productsController.deleteProductById)




module.exports = router