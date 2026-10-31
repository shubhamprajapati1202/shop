const ErrorHandler = require("../helpers/errorHandler")
const ResponseHandler = require("../helpers/responseHandler")
const orderModel = require("../models/orders")
const productService = require("../services/product")

const createOrder = (async(req, res, next) => {
    try{
        let obj = {}

        const bodyObj = {
            shippingAddress,
            orderItmes,
            paymentInfo,
            // paidAt,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body

        bodyObj.user = req.user._id

        const dbResponse = await new orderModel(bodyObj).save()

        if(!dbResponse){
            obj = {message: "Order creation failed"}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Order successfully created", bodyObj)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const getOrdersList = (async(req, res, next) => {
    try{

        const dbResponse = await orderModel.find({}).sort({createdAt: 1}).populate("user", ["name", "email", "-_id"])

        const responseHandler = new ResponseHandler(200, "Orders successfully fetched", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const getMyAllOrders = (async(req, res, next) => {
    try{
        const userId = req.user._id

        const dbResponse = await orderModel.find({user: userId}).sort({"createdAt": -1})

        const responseHandler = new ResponseHandler(200, "Orders successfully fetched", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const getOrderDetail = (async(req, res, next) => {
    try{
        const id = req.params.id
        let obj = {}
        const dbResponse = await orderModel.findById(id)

        if(!dbResponse){
            obj = {name: "notFound", message: `Order not found for id: ${id} `}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Order successfully fetched", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})
const deleteOrder = (async(req, res, next) => {
    try{
        const id = req.params.id
        let obj = {}

        const dbResponse = await orderModel.findByIdAndDelete(id);

        if(!dbResponse){
            obj = { name: "notFound", message: `Order not for the id: ${id}`}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Order successfully deleted", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const updateOrderStatus = (async(req, res, next) => {
    try{
        const id = req.params.id
        const { status } = req.body
        let obj = {}

        const dbResponse = await orderModel.findById(id)

        if(!status){
            obj = {name: 'ValidationError', message: `Order status is required`}
            throw obj

        }

        if(!dbResponse){
            obj = {name: 'notFound', message: `Order not found for the id: ${id}`}
            throw obj
        }

        if(dbResponse.orderStatus?.toLowerCase() === 'delivered'){
            obj = { name: 'ValidationError', message: 'This order is already delivered'}
            throw obj
        }

        dbResponse.orderStatus = status

        dbResponse?.orderItmes.forEach(async(data) => {
            await productService.updateProductStock(data.product_id, data.quantity)
        })

        if(status === 'Delivered'){
            dbResponse.deliveredAt = Date.now()
        }

        const updateResponse = await dbResponse.save({new: true})

        if(!updateResponse){
            obj = {name: 'badRequest', message: 'Something went wrong update order status'}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Order status successfully updated", updateResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

module.exports = {
    createOrder,
    getOrdersList,
    getMyAllOrders,
    getOrderDetail,
    deleteOrder,
    updateOrderStatus
}