// Showcase.jsx - Updated to pass metadata
import React, { useState, useEffect } from "react";
import axios from "axios";
import CheckoutButton from "./Checkout";
import Offer from "./Offer";
import "../styles/Showcase.css";
import { useCart } from "../components/CartContext";
import sold from "../assets/sold.png";

const Showcase = () => {
  const { addToCart, cartItems } = useCart();
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "https://ainzpop-backend.herokuapp.com/api/items"
      );
      setItems(response.data);
      console.log("Updated items fetched:", response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddToCart = (item) => {
    if (cartItems.find((cartItem) => cartItem.id === item.id)) {
      alert(`${item.name} is already in your cart.`);
      return;
    }

    if (item.stock > 0) {
      addToCart({ ...item, quantity: 1 });
    } else {
      alert(`${item.name} is out of stock.`);
    }
  };

  const handleItemClick = (item) => {
    setExpandedItem(item);
    setCurrentPopupIndex(0);
  };

  const handleNextImage = () => {
    if (expandedItem) {
      setCurrentPopupIndex(
        (prevIndex) => (prevIndex + 1) % expandedItem.popupImages.length
      );
    }
  };

  const handlePreviousImage = () => {
    if (expandedItem) {
      setCurrentPopupIndex((prevIndex) =>
        prevIndex === 0 ? expandedItem.popupImages.length - 1 : prevIndex - 1
      );
    }
  };

  const handleMouseEnter = (e, images) => {
    const imgElement = e.currentTarget.querySelector("img");
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      imgElement.src = images[currentIndex];
    }, 1000);

    e.currentTarget.setAttribute("data-interval-id", intervalId);
  };

  const handleMouseLeave = (e) => {
    const intervalId = e.currentTarget.getAttribute("data-interval-id");
    if (intervalId) {
      clearInterval(intervalId);
      e.currentTarget.removeAttribute("data-interval-id");

      const imgElement = e.currentTarget.querySelector("img");
      const item = items.find((item) => item.images.includes(imgElement.src));

      if (item && item.images && item.images.length > 0) {
        imgElement.src = item.images[0];
      } else {
        console.error("Item or images not found for reset.");
      }
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:52525/api/items");
        console.log("Fetched items:", response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleClose = () => {
    setExpandedItem(null);
  };

  return (
    <div>
      <div className="showcase">
        {items.map((item) => (
          <div
            key={item.id}
            className={`para showcase-item ${item.stock === 0 ? "sold" : ""}`}
            onClick={() => handleItemClick(item)}
            onMouseEnter={(e) => handleMouseEnter(e, item.images)}
            onMouseLeave={handleMouseLeave}>
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0]
                  : "fallback-image-url"
              }
              alt={item.name}
              className="item-image"
            />
            {item.stock === 0 && (
              <div className="sold-overlay">
                <img src={sold} alt="Sold" className="sold-sign" />
              </div>
            )}
            <h3 className="special-font">{item.name}</h3>
            <p>{item.brand}</p>
            <p>{item.size}</p>
            <p>{item.cost}</p>
            {item.stock === 0 ? (
              <button className="disabled-button" disabled>
                Out of Stock
              </button>
            ) : (
              <button
                className="special-font"
                onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
      {expandedItem && (
        <div className="expanded-item">
          <div className="expanded-content">
            <button onClick={handleClose} className="close-icon">
              &times;
            </button>
            <div className="image-container">
              {expandedItem.popupImages &&
              expandedItem.popupImages.length > 0 ? (
                <>
                  <img
                    src={expandedItem.popupImages[currentPopupIndex]}
                    alt={`${expandedItem.name} popup`}
                    className="expanded-image"
                  />
                  <button
                    onClick={handlePreviousImage}
                    className="nav-button previous-button">
                    &#8249;
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="nav-button next-button">
                    &#8250;
                  </button>
                </>
              ) : (
                <p>No popup images available</p>
              )}
            </div>
            <h3>{expandedItem.name}</h3>
            <p>{expandedItem.description}</p>
            <div className="button-group">
              <button
                onClick={() => setSelectedItem(expandedItem)}
                className="special-font make-offer-button">
                Make Offer
              </button>
              <CheckoutButton cartItems={[expandedItem]} />
            </div>
          </div>

          {selectedItem && (
            <Offer item={selectedItem} onClose={() => setSelectedItem(null)} />
          )}
        </div>
      )}
    </div>
  );
};

export default Showcase;
