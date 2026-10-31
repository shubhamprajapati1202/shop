const ErrorHandler = require("../helpers/errorHandler")
const jwt = require("jsonwebtoken")
const usersModel = require("../models/users");

module.exports.authorization = (async (req, res, next) => {
    try {

        const accessToken = req.headers["authorization"]?.split(" ")[1]
        const refreshToken = req.cookies.jwt
        let obj = {}

        if(!refreshToken){
            obj = { name: "unAuthorized", message: "Login to access this resource" }
            throw obj
        }

        if (!accessToken) {
            obj = { name: "unAuthorized", message: "Token is required to access this resource" }
            throw obj
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, function(err, decode) {
            if(err){
                obj = { name: "unAuthorized", message: "Invalid login token" }
                throw obj
            }
        })

        jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, function (err, decode) {
            if (err) {
                console.log(err)
                obj = { name: "unAuthorized", message: "Invalid token" }
                throw obj
            }
            req.user = decode?.id
        })

        req.user = await usersModel.findById(req.user)
        // console.log(req.user)
        next()

    } catch (error) {
        next(new ErrorHandler(error))
    }
})


module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {

            if (!roles.includes(req.user.role)) {
                const obj = { name: "unAuthorized", message: `Your role '${req.user.role}' is not authorized to access this resource.` }
                throw obj
            }

            next()

        } catch (error) {
            return next(new ErrorHandler(error))
        }
    }
}