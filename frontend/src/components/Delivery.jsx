import React from "react";
import "../styles/Delivery.css";
import delivery from "../assets/delieries.gif";

const LoadingAfterCheckout = () => {
  return (
    <div className="loading-checkout-screen">
      <img
        src={delivery}
        alt="Processing your order"
        className="loading-checkout-gif"
      />
      <div className="loading-checkout-text">WE OTW</div>
      <div className="loading-checkout-bar">
        <div className="loading-checkout-progress"></div>
      </div>
    </div>
  );
};

export default LoadingAfterCheckout;
