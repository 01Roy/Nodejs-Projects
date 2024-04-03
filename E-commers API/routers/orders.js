const express = require('express')
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const { populate } = require('dotenv');
const { model, Model } = require('mongoose');
const router = express.Router()

// GET ALL ORDERLIST
router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

    if (!orderList) {
        return res.status(500).json({ success: false, message: 'No Order Found' })
    }
    return res.send(orderList)
})
// GET SPECIFIC ORDER LIST
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name').populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })


    if (!order) {
        return res.status(500).json({ success: false, message: 'No Order Found' })
    }
    return res.send(order)
})

// POST THE ORDER
router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()
        return newOrderItem._id;
    }))
    const orderItemsIdsResovle = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResovle.map(async (orderItem) => {
        let ordersItem = await OrderItem.findById(orderItem).populate('product', 'price');
        let totalPrice = (ordersItem.product.price * ordersItem.quantity);

        return parseFloat(totalPrice)
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);



    let order = new Order({
        orderItems: orderItemsIdsResovle,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        user: req.body.user,
        totalPrice: parseFloat(totalPrice),
    })

    order = await order.save()

    if (!order) {
        return res.send(400).send('the order cannot be created')
    }

    return res.send(order)
})

// UPDATE THE ORDER
router.put('/:id', async (req, res) => {
    let order = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status
        }, { new: true })

    if (!order) {
        return res.status(400).send('the order cannot be updated')
    }

    res.send(order)
})

// DELETE THE ORDER
router.delete('/:id', async (req, res) => {
    let order = await Order.findByIdAndDelete(req.params.id);

    let orderItem = await order.orderItems.map(async (orderItem) => {
        let deleteOrderitem = await OrderItem.findByIdAndDelete(orderItem)
        if (!deleteOrderitem) {
            res.send('The order Items is not Found')
        }

    })


    if (!order) {
        return res.send('The order is not Found')
    }

    res.status(200).json({ message: 'Order is deleted' })
})

// GET AMOUNT OF TOTAL SALE
router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('the order sales is not genrated')
    }

    res.send({ totalSales: totalSales.pop().totalsales })
})

// COUNT NUMBER OF ORDERS
router.get('/get/count', async (req, res) => {
    let count = await Order.countDocuments()

    if (!count) {
        return res.send('there is no order ')
    }

    res.status(200).json({ orderCount: count })
})

// GET HISTORY OF ORDER FOR PARTICULAR USER
router.get('/get/userorders/:userid', async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid })
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } }).sort({ "dateOrdered": -1 })

    if (!userOrderList) {
        return res.status(500).json({ sucess: false })
    }
    res.send(userOrderList)
})

module.exports = router