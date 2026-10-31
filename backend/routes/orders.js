const express = require("express")
const router = express.Router()
const ordersController = require("../controllers/orders")
const { authorization, authorizeRoles } = require("../middleware/auth")

router.post("/", authorization, ordersController.createOrder)
router.get("/my-orders-list", authorization, ordersController.getMyAllOrders)
router.get("/:id", authorization, ordersController.getOrderDetail)
router.delete("/:id", authorization, ordersController.deleteOrder)

router.get("/", authorization, authorizeRoles('admin'), ordersController.getOrdersList)
router.put("/:id", authorization, authorizeRoles('admin'), ordersController.updateOrderStatus)
module.exports = router