import React, { useState, useRef, useEffect } from "react";
import "../styles/Header.css";
import logo from "../assets/antony-pop.svg";
import recordPlayer from "../assets/record.svg";
import tune from "../assets/september-mix.mp3";
import tune02 from "../assets/deep-house.mp3";

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(true); // Set initial state to true
  const audioRef = useRef(new Audio(tune02));

  useEffect(() => {
    audioRef.current.play().catch((err) => {
      console.error("Auto-play failed due to browser policy:", err);
      setIsPlaying(false); // Set playing to false if auto-play fails
    });
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <header className="header">
      <a href="http://localhost:3000">
        <img src={logo} alt="antony-pop" className="logo-image" />
      </a>
      <img
        src={recordPlayer}
        alt="record-player"
        className={`record-player ${isPlaying ? "spinning" : ""}`}
        onClick={togglePlay}
      />
    </header>
  );
};

export default Header;
