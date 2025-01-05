import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Showcase from "./components/Showcase.jsx";
import Cart from "./components/Cart.jsx";
import Footer from "./components/Footer.jsx";
import Success from "./components/Success.jsx";
import Cancel from "./components/Cancel.jsx";
import AdminShipping from "./components/Adminshipping.jsx";
import "./styles/font.css";
import { CartProvider } from "./components/CartContext.jsx";

const App = () => {
  return (
    <Router>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Showcase />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/admin/shipping" element={<AdminShipping />} />
        </Routes>
        <Cart />
        <Footer />
      </CartProvider>
    </Router>
  );
};

export default App;
