const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true
    },
    shippingAddress:{
        address1:{
            type: String,
            required: true
        },
        address2:{
            type: String,
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        pincode:{
            type: Number,
            required: true,
            minlength: 6,
            maxlenght: 6
        },
        phone:{
            type: Number,
            required: true
        }
    },
    orderItmes:[{
        name:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
        images:{
            type: String,
            required: true
        },
        product_id:{
            type: mongoose.Schema.ObjectId,
            ref: "products",
            required: true
        }
    }],
    paymentInfo:{
        id:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        }
    },
    paidAt:{
        type: Date,
    },
    itemsPrice:{
        type: Number,
        required: true,
        default: 0
    },
    taxPrice:{
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice:{
        type: Number,
        required: true,
        default: 0
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    orderStatus:{
        type: String,
        required: true,
        enum:["Processing", "Shipped", "Delivered"],
        default: "Processing"
    },
    deliveredAt:{
        type: Date
    }
},
{
    timestamps: true
})


module.exports = mongoose.model("orders", orderSchema, "orders")