const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            prductId: { type: String },
            quantity: { type: Number, default: 1 }
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: "pending"
    },
    address: {
        type: Object,
        required: true,
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Cart', cartSchema)
