import React from "react";
import "../styles/Footer.css"; // Assuming your CSS is in Footer.css

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <p>Feel free to reach out @</p>
        <p>antonyltran@gmail.com</p>
      </div>

      <div className="footer-section">
        <p>
          <a href="https://www.instagram.com/a.einz/">INSTAGRAM → </a>
        </p>
        <p>
          <a href="www.linkedin.com/in/antonytran05">LINKED IN →</a>
        </p>
        <p>
          <a href="https://ainztav.com/">PORTFOLIO →</a>
        </p>
        <p>
          <a href="https://music.apple.com/profile/ainzsz">Apple Music →</a>
        </p>
      </div>

      <div className="footer-section">
        <p>© Antony Tran 2025 Projects</p>
        <p>Based in Chapel Hill</p>
      </div>
    </footer>
  );
};

export default Footer;
