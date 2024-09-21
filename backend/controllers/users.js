const ErrorHandler = require("../helpers/errorHandler")
const ResponseHandler = require("../helpers/responseHandler")
const usersModel = require("../models/users")
const theFunc = require("../helpers/asyncCatch")
const { snedEmail } = require("../utils/sendEmail")
const crypto = require("crypto");

const cookieOption = {
    // maxAge: 24*60*60*1000,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000),
    httpOnly: true,
    secure: true,
    sameSite: "strict"
}
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

        return res.cookie("jwt", refreshToken, cookieOption).send(responseHandler.generateResponse())

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

module.exports.forgotPassword = (async(req, res, next)=>{
    try{
        const email = req.body.email
        let obj = {}

        if(!email){
            obj = { name: "ValidationError", message: "Email is required"}
            throw obj
        }

        var dbResponse = await usersModel.findOne({email})

        if(!dbResponse){
            obj = { name: "BasRequest", message: "Enter your register email address."}
            throw obj
        }

        const resetToken = await dbResponse.generateResetPasswordToken()
        await dbResponse.save({validateBeforeSave: false})

        const resetTokenUrl = `${req.protocol}://${req.get("host")}${process.env.API_VERSION}/users/password/reset/${resetToken}`

        const message = `Your password reset token is: \n\n ${resetTokenUrl} \n\n If you have not requested this email then, please ignore it.`;

        // await snedEmail({
        //     email: dbResponse.email,
        //     subject: "Shop Reset Password",
        //     message: message
        // })

        const responseHandler = new ResponseHandler(200, "We have send a link on your email", resetTokenUrl)
        return res.send(responseHandler.generateResponse())
    }catch(error){
        dbResponse.resetPasswordToken = undefined
        dbResponse.resetPasswordTokenExpire = undefined
        await dbResponse.save({validateBeforeSave: false})
        next(new ErrorHandler(error))
    }
})

module.exports.changePasswordByUrl = (async(req, res, next) => {
    try{

        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword

        const urlResetToken = req.params.token
        const hashToken = crypto.createHash(process.env.CRYPTO_HASH_ALGO).update(urlResetToken).digest("hex")
        let obj = {}
        const dbResponse = await usersModel.findOne({resetPasswordToken: hashToken, resetPasswordTokenExpire: {$gt: Date.now()}})

        if(!dbResponse){
            obj = {name: "BasRequest", message: "This token has been expired or invalid."}
            throw obj
        }

        if(!newPassword || !confirmPassword){
            obj = {name: "ValidationError", message: "Password and confirm password is required."}
            throw obj
        }

        if(newPassword.localeCompare(confirmPassword) != 0){
            obj = {name: "ValidationError", message: "Password and confirm password cann't be match."}
            throw obj            
        }

        dbResponse.password = newPassword
        dbResponse.resetPasswordToken = undefined
        dbResponse.resetPasswordTokenExpire = undefined

        const updatedResponse = dbResponse.save()

        if(!updatedResponse){
            obj = { message: "You password could not be change currently. please try again later"}
            throw obj            
        }

        const responseHandler = new ResponseHandler(200, 'Password successfully changed');
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})


module.exports.getSelfProfile = (async(req, res, next) => {
    try{
        const id = req.user._id
        const dbResponse = await usersModel.findById(id);

        const responseHandler = new ResponseHandler(200, "Profile detail successfully fetched", dbResponse);
        return res.send(responseHandler.generateResponse())

    }catch(error){
        return next(new ErrorHandler(error))
    }
})