const express = require("express");
const { verifyTokon, verifyTokonAndAdmin, verifyTokonAndAuthriztion } = require("../middleware/verifyTokon");
const route = express.Router();
const orderDB = require("../models/Order")

// Create
route.post("/", verifyTokon, async (req, res) => {
    const newOrder = new orderDB(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
route.put("/:id", verifyTokonAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await orderDB.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
route.delete("/:id", verifyTokonAndAdmin, async (req, res) => {
    try {
        await orderDB.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER ORDERS
route.get("/find/:userId", verifyTokonAndAuthriztion, async (req, res) => {
    try {
        const orders = await orderDB.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //GET ALL

route.get("/", verifyTokonAndAdmin, async (req, res) => {
    try {
        const orders = await orderDB.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Monthly income
route.get("/income", verifyTokonAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await orderDB.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = route