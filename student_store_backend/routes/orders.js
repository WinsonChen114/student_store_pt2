const express = require("express")
const Order = require("../models/order")
const router = express.Router()
const { requireAuthenticatedUser } = require("../middleware/security")

router.get("/", requireAuthenticatedUser, async (req, res, next) => {
    try {
        const user = res.locals.user
        const orders = await Order.listOrdersForUser(user)
        return res.status(200).json({ orders })
    } catch (err) {
        next(err)
    }
})

router.post("/", requireAuthenticatedUser, async (req, res, next) => {
    try {
        const user = res.locals.user
        const order = await Order.createOrder({user, order: req.body})
        return res.status(201).json({ order })
    } catch (err) {
        next(err)
    }
})
module.exports = router