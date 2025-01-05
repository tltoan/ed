import React from "react";
import "../styles/Cancel.css"; // Include minimal styles here

const Cancel = () => {
  return (
    <div className="cancel-container">
      <h1>Checkout Canceled</h1>
      <p>
        It looks like you canceled the checkout process. Your cart is still
        available.
      </p>
      <button
        onClick={() => (window.location.href = "/cart")}
        className="retry-button">
        Go to Cart
      </button>
      <button
        onClick={() => (window.location.href = "/")}
        className="continue-button">
        Continue Shopping
      </button>
    </div>
  );
};

export default Cancel;
