import React from "react";
import "../styles/Checkout.css";

const CheckoutButton = ({ cartItems }) => {
  const handleCheckout = async () => {
    try {
      console.log("Items being sent to server:", cartItems); // Log the cart items
      const response = await fetch(
        "http://localhost:52525/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems }), // Ensure cartItems is included
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <button onClick={handleCheckout} className=" special-font checkout-button">
      Buy Now
    </button>
  );
};

export default CheckoutButton;
