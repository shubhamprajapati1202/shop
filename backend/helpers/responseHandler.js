class ResponseHandler {
    constructor(statusCode=200, message="success", dbResponse=null){
        this.status = "success"
        this.statusCode = statusCode
        this.message = message
        this.dbResponse = dbResponse
    }

    generateResponse(){
        const obj = {
            status: this.status,
            http_code: this.statusCode,
            message: this.message,
        }
        if(this.dbResponse!=null){
            obj.data = this.dbResponse
        }

        return obj
    }
}

module.exports = ResponseHandler