const express = require("express");
const userDB = require("../models/User")
const { verifyTokon, verifyTokonAndAuthriztion, verifyTokonAndAdmin } = require("../middleware/verifyTokon");
const route = express.Router();

// update User
route.put("/:id", verifyTokonAndAuthriztion, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, "affanfani70").toString()
    }

    try {
        const updateUser = await userDB.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json({ message: "Record Updated" })
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete User
route.delete("/:id", verifyTokonAndAuthriztion, async (req, res) => {
    try {
        await userDB.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Record deleted Successfully" })
    } catch (err) {
        res.status(500).json(err)
    }

})
// Get User
route.get("/find/:id", verifyTokonAndAdmin, async (req, res) => {
    try {
        const user = await userDB.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All User
route.get("/", verifyTokonAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const user = query ? await userDB.find().sort({ id: -1 }).limit(5) : await userDB.find();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Stats User
route.get("/stats", verifyTokonAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await userDB.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = route