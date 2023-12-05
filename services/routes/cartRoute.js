const express = require("express");
const { verifyTokon, verifyTokonAndAuthriztion, verifyTokonAndAdmin } = require("../middleware/verifyTokon");
const cartDB = require("../models/Cart")
const route = express.Router();


// Create 
route.post("/", verifyTokon, async (req, res) => {
    const newCart = new cartDB(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update
route.put("/:id", verifyTokonAndAuthriztion, async (req, res) => {
    try {
        const updatedCart = await cartDB.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete
route.delete("/:id", verifyTokonAndAuthriztion, async (req, res) => {
    try {
        await cartDB.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Cart
route.get("/find/:userId", verifyTokonAndAuthriztion, async (req, res) => {
    try {
        const cart = await cartDB.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All 
route.get("/", verifyTokonAndAdmin, async (req, res) => {
    try {
      const carts = await cartDB.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = route