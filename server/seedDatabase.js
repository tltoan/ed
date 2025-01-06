const mongoose = require("mongoose");
const Item = require("./models/Item.js"); // Adjust the path to your Item model
const items = require("./data/items.js"); // Adjust the path to your items.js file

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedDatabase = async () => {
  for (const item of items) {
    await Item.updateOne(
      { id: item.id }, // Match by unique identifier
      { $set: item }, // Update with new data
      { upsert: true } // Insert if not found
    );
  }
  console.log("Database updated!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => console.error(err));
