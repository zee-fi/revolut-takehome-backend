const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const apiKey = process.env.REVOLUT_API_KEY;
const Order = require("../models/Order.model");

router.get("/order-status/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      res.status(404).json({ message: "order not found" });
      return;
    }

    res.status(200).json({ orderStatus: order.orderStatus });
  } catch (err) {
    console.log("error fetching order status", err);
    res.status(500).json({ message: "error fetching order status", err });
  }
});

router.put("/order-status/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  try {
    if (!orderId) {
      res.status(400).json({ message: "order Id not found" });
      return;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatus },
      { new: true, runValidators: true }
    );

    res.status(200).json(orderStatus);
  } catch (err) {
    console.log("error updating order status", err);
    res.status(500).json({ message: "error updating order status", err });
    return;
  }
});

router.post("/create-order", async (req, res, next) => {
  const { amount, currency } = req.body;

  try {
    const data = JSON.stringify({
      amount: amount,
      currency: currency,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://sandbox-merchant.revolut.com/api/orders",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Revolut-Api-Version": "2024-09-01",
        Authorization: `Bearer ${apiKey}`,
      },
      data: data,
    };

    const response = await axios(config);
    console.log("Revolut API response:", response.data);

    const newOrder = new Order({
      amount,
      currency,
      orderId: response.data.id,
      orderStatus: response.data.state,
    });

    await newOrder.save();

    res.status(201).json(response.data);
  } catch (err) {
    console.log("unable to create order", err);
    res.status(500).json({ message: "unable to create oder", err });
  }
});

module.exports = router;
