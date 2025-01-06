const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Item = require("./models/Item");
const Order = require("./models/order");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const Stripe = require("stripe"); // Import Stripe
require("dotenv-safe").config({
  example: "./.env.example",
});

console.log("Loaded Webhook Secret:", process.env.STRIPE_WEBHOOK_SECRET);

const validateEnv = () => {
  const requiredEnv = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];
  requiredEnv.forEach((env) => {
    if (!process.env[env]) {
      console.error(`Missing required environment variable: ${env}`);
      process.exit(1);
    }
  });
};

mongoose
  .connect("mongodb://localhost:27017/clothingShowcase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

validateEnv();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "your-cloud-name",
  api_key: "your-api-key",
  api_secret: "your-api-secret",
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

const PORT = 52525;

app.use("/webhook", express.raw({ type: "application/json" }));

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Webhook endpoint hit");
    try {
      const sig = req.headers["stripe-signature"];
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log("Event received:", event);

      if (event.type === "checkout.session.completed") {
        console.log("Checkout session completed:", event.data.object);
        const session = event.data.object;
        const customerEmail = session.customer_details.email;
        const items = JSON.parse(session.metadata.items);
        console.log("Parsed items:", items);
        console.log("Customer email:", customerEmail);

        // Check if shipping information is available
        if (session.shipping) {
          console.log("Shipping Address:", session.shipping.address);
        } else {
          console.log("No shipping address provided.");
        }

        for (const item of items) {
          console.log("Updating stock for item:", item.id);
          const updateResult = await Item.updateOne(
            { id: item.id },
            { $inc: { stock: -item.quantity } }
          );
          if (updateResult.modifiedCount > 0) {
            console.log(`Stock updated successfully for item ${item.id}`);
          } else {
            console.log(
              `No stock update occurred for item ${item.id}. Check if the ID exists.`
            );
          }
        }

        setTimeout(
          async () => {
            try {
              const orderNumber = session.id.slice(-8);
              const shippingAddress =
                session.shipping && session.shipping.address
                  ? {
                      line1: session.shipping.address.line1 || "N/A",
                      city: session.shipping.address.city || "N/A",
                      state: session.shipping.address.state || "N/A",
                      postal_code:
                        session.shipping.address.postal_code || "N/A",
                      country: session.shipping.address.country || "N/A",
                    }
                  : {
                      line1: "N/A",
                      city: "N/A",
                      state: "N/A",
                      postal_code: "N/A",
                      country: "N/A",
                    };

              const order = new Order({
                orderNumber: session.id.slice(-8),
                items,
                total: session.amount_total / 100,
                customerEmail,
                shippingAddress,
              });

              await order.save();
              console.log("Order saved successfully:", order);

              // Proceed with sending the email
              await transporter.sendMail({
                from: `"AINZTAV" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: "Your Order is Confirmed",
                html: `
                <h2>Thank you for your order!</h2>
                <p>Please give me 2-3 weeks to ship it out (18 credits this semester).</p>
                <p><strong>Order No:</strong> ${orderNumber}</p>
                ${shippingAddress}
                <p><strong>Items:</strong></p>
                <ul>
                  ${items
                    .map(
                      (item) =>
                        `<li>${item.name} - Quantity: ${item.quantity}</li>`
                    )
                    .join("")}
                </ul>
                <p>If you have any questions, please contact our support at antonyltran@gmail.com.</p>
              `,
              });
              console.log(
                "Shipping confirmation email sent to:",
                customerEmail
              );
            } catch (error) {
              console.error(
                "Error sending shipping confirmation email:",
                error
              );
            }
          },
          10 * 1000 // 10 seconds delay for testing
        );
      }

      res.status(200).send("Webhook processed");
    } catch (err) {
      console.error("Webhook processing error:", err);
      res.status(500).send(`Webhook Error: ${err.message}`);
    }
  }
);

// Middleware
app.use(express.json());

console.log("Middleware applied");

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validate Environment Variables
if (
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.STRIPE_SECRET_KEY
) {
  console.error(
    "Missing EMAIL_USER, EMAIL_PASS, or STRIPE_SECRET_KEY in .env file"
  );
  process.exit(1);
}

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this front-end origin
    methods: ["GET", "POST"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
  })
);

app.post("/api/test-update-stock", async (req, res) => {
  try {
    const { id, quantity } = req.body;

    if (!id || quantity === undefined) {
      return res.status(400).json({ error: "Missing id or quantity" });
    }

    const updateResult = await Item.updateOne(
      { id },
      { $inc: { stock: -quantity } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: `Stock updated for item ${id}` });
    } else {
      res.status(404).json({ error: `Item with id ${id} not found` });
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Root Route
app.get("/", (req, res) => {
  console.log("Root route accessed!");
  res.send("Welcome to the BACKROOM HOES");
});

// GET Route for Items

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Error fetching items");
  }
});

// GET Route for Orders

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }); // Fetch all orders, sorted by date
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST Route for Sending Offers
app.post(
  "/api/send-offer",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("item").notEmpty().withMessage("Item is required"),
    body("offer").isNumeric().withMessage("Offer must be a number"),
    body("message")
      .optional()
      .isString()
      .withMessage("Message must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, item, offer, message } = req.body;

    try {
      await transporter.sendMail({
        from: `"New Offer AntonyPop" <${process.env.EMAIL_USER}>`,
        to: "t.ainz2005@gmail.com",
        subject: `New Offer for ${item.name}`,
        html: `
          <h3>New Offer Received</h3>
          <p><strong>Item:</strong> ${item.name} (ID: ${item.id})</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Offer:</strong> $${offer}</p>
          <p><strong>Message:</strong> ${message || "No message provided"}</p>
        `,
      });
      res
        .status(200)
        .json({ success: true, message: "Offer sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send offer." });
    }
  }
);

// POST Route for Stripe Checkout
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { cartItems: items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }
    console.log("Received items:", items);
    console.log(
      "Checkout images:",
      items.map((item) => item.checkout[0])
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.checkout[0]],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ["US"], // Only allow US shipping
      },
      mode: "payment",
      metadata: {
        items: JSON.stringify(
          items.map(({ id, name, quantity, stock, checkout }) => ({
            id,
            name,
            quantity,
            stock, // Include stock for decrementing in webhook
            image: checkout ? checkout[0] : "",
          }))
        ),
      },
      success_url:
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}", // Redirect to success route
      cancel_url: "http://localhost:3000/cancel", // Redirect to cancel route
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-session-details", async (req, res) => {
  try {
    // Retrieve session ID from the query or request
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["shipping"],
    });

    res.json({ shipping: session.shipping });
  } catch (error) {
    console.error("Error fetching session details:", error);
    res.status(500).send("Failed to retrieve session details");
  }
});

app.get("/api/get-order-details", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: "No session ID provided" });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    // Extract order details
    const items = session.line_items.data.map((lineItem) => ({
      name: lineItem.description,
      quantity: lineItem.quantity,
      price: lineItem.price.unit_amount,
      image: lineItem.price.product.images[0], // Fetch the first image from Stripe product
    }));

    const orderDetails = {
      id: session.id,
      date: session.created * 1000,
      items: items,
      subtotal: session.amount_subtotal / 100,
      shipping: session.shipping_cost
        ? session.shipping_cost.amount_total / 100
        : 0,
      tax: session.total_details.amount_tax / 100,
      total: session.amount_total / 100,
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/confirm-shipping", async (req, res) => {
  try {
    const { orderId, trackingNumber, providerLink, customMessage } = req.body;

    if (!orderId || !trackingNumber) {
      return res
        .status(400)
        .json({ error: "Order ID and tracking number are required." });
    }

    // Fetch the real order from the database
    const order = await Order.findOne({ orderId }); // Ensure 'Order' is your actual model

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Send shipping confirmation email
    const mailOptions = {
      from: `"AINZTAV" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Shipping Confirmation for Order #${orderId}`,
      html: `
        <h2>Your order has been shipped!</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        ${
          providerLink
            ? `<p>Track your shipment <a href="${providerLink}">here</a>.</p>`
            : ""
        }
        ${customMessage ? `<p>Note from the seller: ${customMessage}</p>` : ""}
        <p>Thank you for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Shipping confirmation sent successfully." });
  } catch (error) {
    console.error("Error confirming shipping:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
