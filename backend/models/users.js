const mongoose  = require("mongoose")
const bcryptjs = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const usersSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        minlength: [3,"Name should be minimum 3 character"],
        maxlength:[25, "Name can't be accept above 25 character"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v){
                return validator.isEmail(v)
            },
            message: "Enter valid email address"
        }
    },
    phone:{
        type: String,
        required: [true, "Phone is required"],
        maxlength: [15,"Invalid Phone"],
        trim: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password should be 8 character or more"],
        trim: true,
        select: false
    },
    role:{
        type: String,
        required: [true, "Role is required"],
        trim: true,
        enum: ["admin", "user"],
        default: "user"
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpire:{
        type: Date
    }
},
{
    timestamps: true
})


usersSchema.pre("save", async function(next){
    if(!this.password){
        next()
    }
    this.password = bcryptjs.hashSync(this.password, +process.env.PASSWORD_SALT)
})

usersSchema.methods.comparePassword = function(plainPassword, cb){
    return bcryptjs.compareSync(plainPassword, this.password)   
}

usersSchema.methods.generateToken = function(){
    const accessToken = jwt.sign({id: this._id}, process.env.JWT_ACCESS_TOKEN, {algorithm: process.env.JWT_ALGORITHM}, {expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE})
    const refreshToken = jwt.sign({id: this._id}, process.env.JWT_REFRESH_TOKEN, {algorithm: process.env.JWT_ALGORITHM}, {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE})
    return {accessToken, refreshToken}
}


usersSchema.methods.generateResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(+process.env.CRYPTO_RANDOM_BYTES).toString("hex");
    const hashResetToken = crypto.createHash(process.env.CRYPTO_HASH_ALGO).update(resetToken).digest("hex")

    this.resetPasswordToken = hashResetToken
    this.resetPasswordTokenExpire = Date.now() + 15*60*1000

    return resetToken
}
module.exports = mongoose.model("users", usersSchema, "users");

