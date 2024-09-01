const productModel = require("../models/products")
const errorHandler = require("../helpers/errorHandler")
const responseHandler = require("../helpers/responseHandler");


const createProduct = (async(req, res, next) => {
    try{

        const bodyObj = req.body
        const dbResponse = await productModel(bodyObj).save()

        if(!dbResponse){
            throw {message: "Product creation faild."}            
        }

        return res.send(new responseHandler(201, "Product successfully added", dbResponse));

    }catch(error){
        next(new errorHandler(error))
    }
})

const productList = (async(req, res, next)=>{
    try{

        const dbResponse = await productModel.find({})

        if(!dbResponse){
            throw {name:"notFound", statusCode: 404, message: "Products not found"}
        }

        return res.send(new responseHandler(200, "Products list successfully fetched", dbResponse))

    }catch(error){
        next(new errorHandler(error))
    }
})



const updateProductById = (async(req, res, next) => {
    try{

        const body = req.body
        const id = req.params.id

        const dbResponse = await productModel.findByIdAndUpdate(id, {$set: body}, {new: true, runValidators: true})

        if(!dbResponse){
            throw {name:"notFound", statusCode:404, message: "Product not found to update."}
        }

        return res.send(new responseHandler(200, "Product successfully updated.", dbResponse))

    }catch(error){
        next(new errorHandler(error))
    }
})

const getProductById = (async(req, res, next)=>{
    try{
        const id = req.params.id

        const dbResponse = await productModel.findById(id)

        if(!dbResponse){
            throw {name: "notFound", statusCode: 404, message: "Product not found"}
        }

        return res.send(new responseHandler(200, "Product successfully fetch", dbResponse))

    }catch(error){
        next(new errorHandler(error))
    }
})

const deleteProductById = (async(req, res, next)=>{
    try{
        const id = req.params.id
        const dbResponse = await productModel.findByIdAndDelete(id)

        if(!dbResponse){
            throw {name: "notFound", statusCode: 404, message: "Product not found for delete"}
        }

        return res.send(new responseHandler(200, "Product successfully deleted.", dbResponse))

    }catch(error){
        next(new errorHandler(error))
    }
})


module.exports = {
    createProduct,
    productList,
    getProductById,
    deleteProductById,
    updateProductById
}