const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("json2csv");
const Order = require("./models/order"); // Ensure correct path to your Order model

mongoose.connect("mongodb://localhost:27017/clothingShowcase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function exportOrders() {
  try {
    const orders = await Order.find();

    if (orders.length === 0) {
      console.log("No orders found to export.");
      return;
    }

    const fields = [
      "orderNumber",
      "customerEmail",
      "total",
      "createdAt",
      "shippingAddress.name",
      "shippingAddress.line1",
      "shippingAddress.city",
      "shippingAddress.state",
      "shippingAddress.postal_code",
      "shippingAddress.country",
      "items",
    ];

    const csv = parse(orders, { fields });

    fs.writeFileSync("orders.csv", csv);
    console.log("Orders exported successfully to orders.csv");
  } catch (error) {
    console.error("Error exporting orders:", error);
  } finally {
    mongoose.disconnect();
  }
}

exportOrders();
