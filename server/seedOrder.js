const mongoose = require("mongoose");
const Order = require("../server/models/order"); // Assuming 'Order' is in './models'

mongoose
  .connect("mongodb://localhost:27017/clothingShowcase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedOrders = async () => {
  try {
    const orders = [
      {
        orderNumber: "12345678",
        items: [
          {
            id: "BBJKT",
            name: "Blue Baseball Jacket",
            quantity: 1,
            price: 60,
            image: "https://...",
          },
          {
            id: "GQZIP",
            name: "Grey Quarter Zip",
            quantity: 1,
            price: 25,
            image: "https://...",
          },
        ],
        total: 85,
        customerEmail: "customer@example.com",
        shippingAddress: {
          line1: "123 Main St",
          city: "Los Angeles",
          state: "CA",
          postal_code: "90001",
          country: "US",
        },
      },
    ];

    await Order.insertMany(orders);
    console.log("Orders seeded successfully!");
  } catch (error) {
    console.error("Error seeding orders:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedOrders();
