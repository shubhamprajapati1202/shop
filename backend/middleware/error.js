const errorHandler = require("../helpers/errorHandler")

module.exports.requestNotFound = (async(req, res, next)=>{
    const api_version = process.env.API_VERSION
    const object = {
        status:"error",
        http_code:404,
        message: "Not Found",
        timestamp: new Date,
        method: req.method,
        path: req.url,
    }
    // req.url?.includes(api_version) ? object.version = api_version : ""

    object.details = {
        error_code: "RESOURCE_NOT_FOUND",
        error_message: "The requested api not found",
    }

    // const error = {
    //     name: "UrlError",
    //     path: req.url,
    //     message: "The requested resource could not be found",
    // }

    return res.status(404).send(object)
    next(new errorHandler(error))

})


module.exports.internalServerError = (async(err, req, res, next) => {
    const api_version = process.env.API_VERSION
    const statusCode = err.code || 500
    const message = err?.msg || err.message

    const object = {
        status:"error",
        http_code: statusCode,
        message: message,
        timestamp: new Date(),
        method: req.method,
        path: req.url,
    }
    
    // req.url.includes(api_version) ? object.version = api_version : ""

    err?.details ? object.data = err.details : ""

    console.log(`Error Stack ==>`, err.stack)

    return res.status(statusCode).send(object)

})