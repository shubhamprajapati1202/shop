const productModel = require("../models/products")
const ErrorHandler = require("../helpers/errorHandler")
const ResponseHandler = require("../helpers/responseHandler");
const ObjectId = require("mongoose").Schema.ObjectId

const createProduct = (async(req, res, next) => {
    try{

        const bodyObj = req.body
        bodyObj.added_by = req.user._id

        const dbResponse = await productModel(bodyObj).save()

        if(!dbResponse){
            throw {message: "Product creation faild."}            
        }

        const responseHandler = new ResponseHandler(201, "Product successfully added", dbResponse)

        return res.send(responseHandler.generateResponse());

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const productList = (async(req, res, next)=>{
    try{

        const dbResponse = await productModel.find({})

        if(!dbResponse){
            throw {name:"notFound", statusCode: 404, message: "Products not found"}
        }

        const responseHandler = new ResponseHandler(200, "Products list successfully fetched", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
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

        const responseHandler = new ResponseHandler(200, "Product successfully updated.", dbResponse)

        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const getProductById = (async(req, res, next)=>{
    try{
        const id = req.params.id

        const dbResponse = await productModel.findById(id)

        if(!dbResponse){
            throw {name: "notFound", statusCode: 404, message: "Product not found"}
        }

        const responseHandler = new ResponseHandler(200, "Product successfully fetch", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const deleteProductById = (async(req, res, next)=>{
    try{
        const id = req.params.id
        const dbResponse = await productModel.findByIdAndDelete(id)

        if(!dbResponse){
            throw {name: "notFound", statusCode: 404, message: "Product not found for delete"}
        }

        const responseHandler = new ResponseHandler(200, "Product successfully deleted.", dbResponse)

        return res.send(responseHandler.generateResponse())


    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const getParticularPrdocutRatingReviews = (async(req, res, next) => {
    try{

        const dbResponse = await productModel.findById(req.params.productId).select(['reviews', 'numberOfRatings', 'numberOfReviews'])

        const responseHandler = new ResponseHandler(200, "Product reviews successfully fetched", dbResponse)

        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const addUpdateReview = (async(req, res, next) => {
    try{
        const {rating=null, comment=undefined} = req.body
        const id = req.params.productId
        let obj = {}
        let totalRating = 0

        if(rating===null){
            obj = {name: "ValidationError", message: "Rating is rquired."}
            throw obj
        }

        let dbResponse = await productModel.findById(id)
        if(!dbResponse){
            obj = {name: "notFound", message: "Product not found for add review"}
            throw obj
        }

        obj = {
            user: req.user._id,
            name:  req.user.name,
            rating: +rating,
            comment
        }
        
        const isReviewExist = dbResponse.reviews.find(data => data.user.toString() === obj.user.toString())
        const existOnIndex = dbResponse.reviews.findIndex(data => data.user.toString() === obj.user.toString())

        if(isReviewExist){
            dbResponse.reviews[existOnIndex] = obj
        }else{
            dbResponse.reviews.push(obj)
        }

        dbResponse.reviews.map(data => {
            totalRating += data.rating
        })

        dbResponse.numberOfReviews = dbResponse.reviews.length
        dbResponse.numberOfRatings = totalRating/dbResponse.numberOfReviews

        const updatedResponse = await dbResponse.save({new: true, runValidators: true, useFindAndModify: false})

        if(!updatedResponse){
            obj = {message: "Something went wrong. Please try again later to add and update ratings"}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Product review successfully added or updated.", updatedResponse)

        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})

const deleteReview = (async(req, res, next) => {
    try{
        const productId = req.params.productId
        const reviewId = req.params.reviewId
        let totalRating = 0
        let obj = {}

        const dbResponse = await productModel.findById(productId)

        const getReviewIndex = dbResponse.reviews.findIndex(data => data._id.toString() === reviewId.toString())

        if(getReviewIndex < 0){
            console.log('ddd')
            obj = {name:"notFound", message:"Review not found for deletion"}
            throw obj
        }

        dbResponse.reviews.splice(getReviewIndex, 1)
        dbResponse.numberOfReviews = dbResponse.reviews.length

        dbResponse.reviews.map(obj => {
            totalRating += obj.rating
        })

        dbResponse.numberOfRatings = totalRating/dbResponse.numberOfReviews

        const updaateResponse = await dbResponse.save({
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        if(!updaateResponse){
            obj = {message: "Something went wrong. Please try again later."}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Review successfully deleted.", updaateResponse)

        return res.send(responseHandler.generateResponse())
    }catch(error){
        return next(new ErrorHandler(error))
    }
})

module.exports = {
    createProduct,
    productList,
    getProductById,
    deleteProductById,
    updateProductById,
    getParticularPrdocutRatingReviews,
    addUpdateReview,
    deleteReview
}