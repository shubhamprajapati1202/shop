const ErrorHandler = require("../helpers/errorHandler")
const ResponseHandler = require("../helpers/responseHandler")
const usersModel = require("../models/users")
const theFunc = require("../helpers/asyncCatch")
module.exports.usersList = (async(req, res, next) => {
    try{
        const dbResponse = await usersModel.find({});

        if(!dbResponse){
            throw {name:"notFound", statusCode:404, message: "Users not found"}
        }

        const responseHandler = new ResponseHandler(200, "Users successfully fetched", dbResponse)
        return res.send(responseHandler.generateResponse());

    }catch(error){
        next(new ErrorHandler(error))
    }
})


module.exports.createUsers = theFunc((async(req, res, next)=>{
    try{
        const body = req.body
        const obj = {
            name: body.name,
            email: body.email,
            phone: body.phone,
            password: body.password
        }
        const dbResponse = await new usersModel(obj).save()

        if(!dbResponse){
            throw {statusCode: 400, message: "User registration faild."}
        }
        
        const responseHandler = new ResponseHandler(201, "User successfully registered.", dbResponse)

        return res.send(responseHandler.generateResponse());
    }catch(error){
        next(new ErrorHandler(error))
    }
}))

module.exports.updateUsersById = (async(req, res, next) => {
    try{
        const body = req.body
        const id = req.params.id

        const dbResponse = await usersModel.findByIdAndUpdate(id, {$set: body}, {new: true, runValidators: true})

        if(!dbResponse){
            throw { name: "notFound", statusCode:404, message: "User not found for udate"}
        }
        
        const responseHandler = new ResponseHandler(200, "User successfully updated", dbResponse)

        return res.send(responseHandler.generateResponse());
    }catch(error){
        next(new ErrorHandler(error))
    }
})


module.exports.getUserById = (async(req, res, next) => {
    try{
        const id = req.params.id

        const dbResponse = await usersModel.findById(id)

        if(!dbResponse){
            throw {name: "notFound", statusCode:404, message: "User detail not found"}
        }
        
        const responseHandler = new ResponseHandler(200, "User successfully fetched", dbResponse)

        return res.send(responseHandler.generateResponse())
    }catch(error){
        next(new ErrorHandler(error))
    }
})

module.exports.deleteUserById = (async(req, res, next) => {
    try{
        
        const id = req.params.id

        const dbResponse = await usersModel.findByIdAndDelete(id)

        if(!dbResponse){
            throw {name: "notFound", statusCode:404, message: "User not found for delete"}
        }
        
        const responseHandler = new ResponseHandler(200, "User successfully deleted", dbResponse)

        return res.send(responseHandler.generateResponse())

    }catch(error){
        next(new ErrorHandler(error))
    }
})


module.exports.loginUser = (async(req, res, next)=>{
    try{

        const { email, password } = req.body
        let obj = {}
        if(!email || !password){
            obj = {name: "ValidationError", message: "Email and password is required."}
            throw obj
        }

        const dbResponse = await usersModel.findOne({email}).select(["+password"])
        if(!dbResponse){
            obj = {name: "unAuthorized", message: "Enter valid login detail"}
            throw obj
        }

        const isPasswordMatch = await dbResponse.comparePassword(password)
        if(!isPasswordMatch){
            obj = {name: "unAuthorized", message: "Enter valid login detail"}
            throw obj
        }

        const { accessToken, refreshToken } = await dbResponse.generateToken();

        const responseHandler = new ResponseHandler(200, "Login successfully", {token: accessToken});

        return res.cookie("jwt", refreshToken, {maxAge: 24*60*60*1000}).send(responseHandler.generateResponse())

    }catch(error){
        next(new ErrorHandler(error))
    }
})

module.exports.logoutUser = (async(req, res, next) => {
    try{
        const refreshToken = req.cookies.jwt
        
        const responseHandler = new ResponseHandler(200, "Logout successfully")
        return res.clearCookie("jwt").send(responseHandler.generateResponse())
    }catch(error){
        next(new ErrorHandler(error))
    }
})

module.exports.changePassword = (async(req, res, next)=>{
    try{
        const { password, newPassword, confPassword} = req.body
        let obj = {}
        if(!password || !newPassword || !confPassword){
            obj = {name: "ValidationError", message: "All password fields are required"}
            throw obj
        }

        if(newPassword.localeCompare(confPassword) !=0 ){
            obj = {name: "ValidationError", message: "New password or confirm password not match"}
            throw obj
        }

        const dbResponse = await usersModel.findById(req.user._id).select(["+password"])
        if(!dbResponse){
            obj = {name: "notFound", message: "User detail not found"}
            throw obj
        }

        const isPasswordMatch = await dbResponse.comparePassword(password)
        if(!isPasswordMatch){
            obj = { name: "BasRequest", message: "Old password is invalid"}
            throw obj
        }

        dbResponse.password = newPassword

        const prx = await dbResponse.save()

        if(!prx){
            obj = { message: "Someting went wront to update password" }
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Password successfully changed")

        return res.clearCookie().send(responseHandler.generateResponse())

    }catch(error){
        next(new ErrorHandler(error))
    }
})

module.exports.updateSelfProfile = (async(req, res, next)=>{
    try{
        const updateObj = {
            name: req.body.name,
            email: req.body.email
        }

        const dbResponse = await usersModel.findByIdAndUpdate(req.user._id, updateObj, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        if(!dbResponse){
            const obj = { name: "notFound", message: "User not found to udpate profile"}
            throw obj
        }

        const responseHandler = new ResponseHandler(200, "Profile successfully updated", dbResponse)
        return res.send(responseHandler.generateResponse())

    }catch(error){
        next(new ErrorHandler(error))
    }
})