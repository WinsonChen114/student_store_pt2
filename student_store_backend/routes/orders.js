const express = require("express")
const Order = require("../models/order")
const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const orders = Order.listOrdersForUser()
        return res.status(200).json({ orders })
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const order = await Order.createOrder({ ...req.body})
        return res.status(201).json({ order })
    } catch (err) {
        next(err)
    }
})
module.exports = router