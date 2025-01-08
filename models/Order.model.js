const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        orderId: { type: String },
        orderStatus: { type: String },
    },
    {
        timestamps: true
      }
)

const Order = model("Order", orderSchema);

module.exports = Order;