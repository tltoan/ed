import React, { createContext, useState, useContext } from "react";

// Create the context
export const CartContext = createContext();

// Provide the context to your app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to the cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item._id);
      if (existingItem) {
        return prevItems; // Do nothing if item is already in the cart
      }
      return [...prevItems, { ...item, quantity: 1 }]; // Add item with quantity of 1
    });
  };

  // Remove item from the cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]); // Clear all items in the cart
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easier context access
export const useCart = () => useContext(CartContext);
