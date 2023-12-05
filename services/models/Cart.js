const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Cart', cartSchema)