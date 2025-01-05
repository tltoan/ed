import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header.jsx";
import Showcase from "./components/Showcase.jsx";
import Cart from "./components/Cart.jsx";
import Footer from "./components/Footer.jsx";
import Success from "./components/Success.jsx";
import Cancel from "./components/Cancel.jsx";
import AdminShipping from "./components/Adminshipping.jsx";
import Loading from "./components/Loading.jsx";
import "./styles/font.css";
import { CartProvider } from "./components/CartContext.jsx";

const AppContent = () => {
  const location = useLocation();

  return (
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
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      // Show loading screen only on the home route
      const timer = setTimeout(() => setIsLoading(false), 3000); // 3-second delay
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false); // Ensure no loading on other pages
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <AppContent />;
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
