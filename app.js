const express = require("express");
const app = express();
const dotenv = require("dotenv")
const connect = require("./services/connection/connectDB")
const auth = require("./services/routes/auth")
const userRoute = require("./services/routes/userRoute")
const productRoute = require("./services/routes/productRoute")
const cartRoute = require("./services/routes/cartRoute")
const orderRoute = require("./services/routes/orderRoute")

dotenv.config()
connect(process.env.URL)
app.use(express.json())

app.use("/api/auth", auth)
app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/order", orderRoute)
app.use("/api/cart", cartRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("App listened at 5000....");
})