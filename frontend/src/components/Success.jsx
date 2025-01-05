import React, { useEffect, useState } from "react";
import styles from "../styles/Success.module.css";
import sold from "../assets/sold.png"; // Ensure you have the sold image in the correct path
import { Link, useSearchParams } from "react-router-dom";

const Success = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:52525/api/get-order-details?session_id=${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderDetails(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchOrderDetails();
    }
  }, [sessionId]);

  if (loading) {
    return <div className={styles.loading}>Loading order details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.receipt}>
        <h1 className={`${styles.thankYou} special-font`}>
          Thank You for Your Purchase!
        </h1>
        <p className={styles.orderInfo}>
          Order No: <span>{orderDetails.id.slice(-8)}</span>
        </p>
        <p className={`${styles.orderInfo} special-font`}>
          Date: <span>{new Date(orderDetails.date).toLocaleDateString()}</span>
        </p>
        <div className={styles.items}>
          {orderDetails.items.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.imageContainer}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <img src={sold} alt="Sold" className={styles.soldOverlay} />
              </div>
              <div className={`${styles.itemDetails} special-font`}>
                <h2>{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price / 100}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.summary} special-font`}>
          <p>
            Subtotal: <span>${orderDetails.subtotal}</span>
          </p>
          <p>
            Shipping: <span>${orderDetails.shipping}</span>
          </p>
          <p>
            Tax: <span>${orderDetails.tax}</span>
          </p>
          <p className={`${styles.total} special-font`}>
            Total: <span>${orderDetails.total}</span>
          </p>
        </div>
        <Link to="/" className={`${styles.homeLink} special-font`}>
          Go back to homepage
        </Link>
      </div>
    </div>
  );
};

export default Success;
