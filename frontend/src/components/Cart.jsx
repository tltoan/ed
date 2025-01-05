import React, { useContext, useState } from "react";
import { CartContext } from "../components/CartContext";
import "../styles/Cart.css"; // CSS for the cart
import trash from "../assets/trash.png";
import cart from "../assets/cart.png";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    console.log("Cart items being sent:", cartItems);
    if (!cartItems || cartItems.length === 0) {
      console.error("Cart is empty. Cannot proceed to checkout.");

      return;
    }
    try {
      const response = await fetch(
        "http://localhost:52525/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems }), // Now sending 'items'
        }
      );

      const data = await response.json();
      if (data.url) {
        // Decrement stock for each item
        cartItems.forEach((item) => {
          if (item.stock !== undefined) {
            item.stock -= 1; // Reduce stock count
          }
        });
        clearCart(); // Clear cart after successful checkout
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Failed to create checkout session:", data);
        alert("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred while trying to process your checkout.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="special-font cart-toggle" onClick={toggleCart}>
        <img src={cart} alt="Cart Icon" className="icon" />
        CART ({cartItems.length})
      </button>

      {/* Sliding Cart */}
      <div className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <button className="close-cart" onClick={toggleCart}>
          &times;
        </button>
        <h2 className="special-font">THIS YO CART?</h2>
        {cartItems.length === 0 ? (
          <p className="special-font">it's empty..................</p>
        ) : (
          <>
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.checkout}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <div>
                      <h3 className="para">{item.name}</h3>
                      <p className="para">ID: {item.id}</p>
                      <p className="para">
                        Price: ${(item.price / 100).toFixed(2)}
                      </p>
                      <p className="para">Quantity: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-item">
                      <img src={trash} alt="Remove Item" className="icon" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <p className="special-font">
                {" "}
                SUBTOTAL: ${(calculateSubtotal() / 100).toFixed(2)}
              </p>
              <p className="para">
                Taxes and Discounts will be calculated at checkout. I will not
                ship internationally, unless you really want something, you will
                have to pay for shipping.
              </p>
              <button
                className=" para checkout-button"
                onClick={handleCheckout}
                disabled={cartItems.some((item) => item.stock === 0)}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
