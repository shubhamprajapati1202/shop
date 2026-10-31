
class ErrorHandler extends Error{
    constructor(errorObj){
        let { statusCode = 500, message = null} = errorObj
        let msg = "";
        let error_code = ""
        let error_detail = {}

        console.log("Error name & message is: name ==>", errorObj.name, ". Message ==> ",errorObj.message)


        switch(errorObj.name){
            case "CastError":
                statusCode = 400
                error_code = "INVALID_INPUT"
                msg = "Bad Request"
                message = `Resource not found ${errorObj.path}`
            break;
            case "BasRequest":
                statusCode = 400
                error_code = "INVALID_INPUT"
                msg = "Bad Request"
                message = errorObj?.message
            break;
            case "ValidationError": 
                statusCode = 422;
                error_code = "VALIDATION_ERROR";
                msg = "Validation Errors";
                message = errorObj?._message ?? errorObj?.message;
                if(typeof(errorObj?.errors)=="object"){
                    let obj = {}
                    for(const [key, value] of Object.entries(errorObj.errors)){
                        obj[key] = value.message
                        error_detail = {...error_detail, ...obj}
                    }
                }
            break;
            case "UrlError":
                statusCode = 404;
                error_code = "RESOURCE_NOT_FOUND";
                msg = "Not Found";
                message = errorObj.message
            break;
            case "ReferenceError":
                statusCode = 500;
                error_code = "INTERNAL_ERROR";
                msg = "Not Found";
                message = errorObj.message
            break;
            case "notFound" :
                statusCode = 404;
                error_code = "DATA_NOT_FOUND";
                msg = "Not Found";
                message = errorObj.message;
            break;
            case "unAuthorized" :
                statusCode = 401;
                error_code = "UNAUTHORIZED";
                msg = "Unauthorized ";
                message = errorObj.message;
            break;
            default:
                statusCode = statusCode ?? 500;
                error_code = "INTERNAL_ERROR";
                msg = "Internal Server Error";
                // message = errorObj?.message ?? "An unexpected error occurred on the server";
                message = "An unexpected error occurred on the server";
            break;
        }

        super(message)
        this.code = statusCode
        this.name = "ErrorHandler"
        this.msg = msg
        this.details = {
            error_code: error_code,
            error_message: message,
        }

        if(Object.keys(error_detail).length>0){
            this.details.error_details = error_detail
        }

        // console.log(errorObj)
        // console.log(errorObj.errors)
        // console.log(errorObj.message)
        // console.log(errorObj.name)
        // console.log(errorObj.path)
        // console.log(`Error detail => `, this)

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler