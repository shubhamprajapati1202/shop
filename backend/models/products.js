const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    category:{
        type: String,
        required: [ true, "Product category is required."],
        trim: true
    },
    name:{
        type: String,
        required: [ true, "Product name is required."],
        unique: true,
        trim: true
    },
    mrp:{
        type: Number,
        required: [ true, "Product MRP is required."],
        validate: {
            validator: function(v){
                return v.toString().length <= 8;
            },
            message: "Product MRP can accept only an 8-digit number"
        }
    },
    salePrice:{
        type: Number,
        required: [ true, "Sale price is required"],
        validate:{
            validator: function(v){
                return v.toString().length <= 8;
            },
            message: "Sale price can accept only an 8-digit number"
        }
    },
    stock:{
        type: Number,
        required: [ true, "Number of stock is required"],
        validate:{
            validator: function(v){
                return v.toString().length <= 3;
            },
            message: "Stock quantity can accept only a 3-digit number"
        }
    },
    stockStatus:{
        type: String,
        enum: {
            values: ["instock", "out of stock"],
            message: ' {VALUE} is not supported.'
        },
        default: "instock"
    },
    description:{
        type: String,
        required: [true, "Product description is required"]
    },
    images:[
        {
            path_id:{
                type: String,
                required: [true, "Image path id is required"]
            },
            url:{
                type: String,
                required: [true, "Image url is required."]
            }
        }
    ],
    numberOfRatings:{
        type: Number,
        default: 0,
    },
    numberOfReviews:{
        type: Number,
        default:0
    },
    review:[
        {
            name:{
                type: String,
                required: [true, "User name is required"]
            },
            rating:{
                type: Number,
                required:[true, "Rating is required"]
            },
            comment:{
                type: String
            }
        }
    ]
},
{
    timestamps: true
}
);

module.exports = mongoose.model("products", productSchema, "products");