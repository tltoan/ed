const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  total: Number,
  customerEmail: String,
  shippingAddress: {
    name: String,
    line1: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
