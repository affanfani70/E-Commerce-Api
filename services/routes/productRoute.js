const express = require("express");
const route = express.Router();
const productDB = require("../models/Product");
const { verifyTokonAndAdmin } = require("../middleware/verifyTokon");

// Create product
route.post("/", verifyTokonAndAdmin, async (req, res) => {
    const product = req.body;
    try {
        const saveProduct = await productDB.save();
        res.status(200).json({ message: "Product is created" });
    } catch (err) {
        res.status(500).json(err)
    }
})

//UPDATE
route.put("/:id", verifyTokonAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await productDB.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
route.delete("/:id", verifyTokonAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product has been deleted..." });
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
route.get("/find/:id", async (req, res) => {
    try {
        const product = await productDB.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Product
route.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await productDB.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await productDB.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await productDB.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = route