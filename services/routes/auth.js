const express = require("express");
const route = express.Router();
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const userDB = require("../models/User")


const KEY = "affanfani70";
route.post('/register', async (req, res) => {
    const newUser = new userDB({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, KEY).toString()
    })

    try {
        const user = await newUser.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

// LOGIN method
route.post('/login', async (req, res) => {
    try {
        const user = await userDB.findOne({ username: req.body.username })
        const hashPass = CryptoJS.AES.decrypt(user.password, KEY);

        const orignalpassword = hashPass.toString(CryptoJS.enc.Utf8);

        const accessTokon = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, "Fani11220", { expiresIn: "3d" })

        if (orignalpassword !== req.body.password) {
            res.status(401).json({ message: "username or password is incorrect" })
        } else {
            const { password, ...other } = user._doc
            res.status(201).json({...other,accessTokon})
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = route