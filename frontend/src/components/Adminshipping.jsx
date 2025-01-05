import React, { useState } from "react";
import axios from "axios";
import "../styles/AdminShip.css";

const AdminShipping = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [providerLink, setProviderLink] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:52525/api/confirm-shipping",
        {
          orderId,
          trackingNumber,
          providerLink,
          customMessage,
        }
      );
      setResponse(res.data.message);
      setOrderId("");
      setTrackingNumber("");
      setProviderLink("");
      setCustomMessage("");
    } catch (error) {
      setResponse(
        "Error: " + (error.response?.data?.error || "Something went wrong.")
      );
    }
  };

  return (
    <div className="admin-shipping-container">
      <h1 className="title">Confirm Shipping</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Order ID (Last 8 digits):</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Tracking Number:</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Provider Link (optional):</label>
          <input
            type="url"
            value={providerLink}
            onChange={(e) => setProviderLink(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Custom Message (optional):</label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}></textarea>
        </div>
        <button type="submit" className="submit-button">
          Send Shipping Confirmation
        </button>
      </form>
      {response && <p className="response-message">{response}</p>}
    </div>
  );
};

export default AdminShipping;
