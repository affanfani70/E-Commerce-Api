const mongoose = require("mongoose");

const connect = async (url) => {
    try {
        await mongoose.connect(url)

        console.log("connected Successfully");
    } catch (error) {
        console.log(error)
    }
}

module.exports = connect;