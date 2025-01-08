require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item"); // Ensure this path is correct
const items = require("../server/data/items"); // Ensure your items.js is correct

const MONGO_URI = process.env.MONGO_URI;

// Use async/await to ensure connection is established before proceeding
const seedDatabase = async () => {
  try {
    // Wait for the MongoDB connection to be established
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    // Loop through items and insert/update them
    for (const item of items) {
      console.log("Seeding item:", item);
      await Item.updateOne(
        { _id: item.id }, // Use _id instead of id
        { $set: item },
        { upsert: true }
      );
    }

    console.log("Database updated!");
  } catch (err) {
    console.error("Error during database seeding:", err);
  } finally {
    mongoose.connection.close(); // Close the connection after seeding
  }
};

// Call the seedDatabase function after ensuring connection is established
seedDatabase();
