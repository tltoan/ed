const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  images: [String],
  popupImages: [String],
  brand: String,
  size: String,
  cost: String,
  price: Number,
  quantity: Number,
  stock: Number,
  description: String,
  checkout: [String],
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
