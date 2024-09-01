const ErrorHandler = require("../helpers/errorHandler")
const jwt = require("jsonwebtoken")
const usersModel = require("../models/users");

module.exports.authorization = (async(req, res, next) =>{
    try{

        // const accessToken = req.headers["authorization"]?.split(" ")[1]
        const accessToken = req.cookies.jwt
        console.log(accessToken)
        let obj = {}

        if(!accessToken){
            obj = {name: "unAuthorized", message: "Token is required to access this resource"}
            throw obj
        }

        jwt.verify(accessToken, process.env.JWT_REFRESH_TOKEN, function(err, decode){
            if(err){
                obj = {name: "unAuthorized", message: "Invalid token"}
                throw obj
            }
            req.user = decode?.id
        })
        
        req.user = await usersModel.findById(req.user)
        console.log(req.user)
        next()

    }catch(error){
        next(new ErrorHandler(error))
    }
})