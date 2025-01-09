import React, { useState } from "react";
import "../styles/Offer.css";

const MakeOffer = ({ item, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState("");
  const [message, setMessage] = useState("");

  if (!item) {
    return null; // Render nothing if item is null
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const offerData = {
      name,
      email,
      offer,
      message,
      item: {
        id: item?._id,
        name: item?.name,
      },
    };
    console.log("Offer Data Being Sent:", offerData);
    // Make the fetch request to send the offer
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/send-offer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(offerData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Offer sent successfully!");
      } else {
        alert("Failed to send offer. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("An error occurred while sending your offer.");
    }

    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="special-font">
          Make an Offer for {item?.name || "Unknown Item"} (ID:{" "}
          {item?._id || "N/A"})
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Your Offer Amount"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            required
          />
          <textarea
            placeholder="Leave a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            cols="50"
          />
          <button type="submit">Send Offer</button>
        </form>
      </div>
    </div>
  );
};

export default MakeOffer;
