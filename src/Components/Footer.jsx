/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "../Styles/Footer.css";
function Footer() {
  const [counter, setCounter] = useState("");

  useEffect(() => {
    const url = "https://kmcianbackend.vercel.app/api/request";
    fetch(`${url}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setCounter(data.count));
  }, []);

  return (
    <div className="footer-container">
      <p>
        <span>with</span>
        <span>❤️</span> <span>from</span> <span>½ bit</span>
      </p>
      <div className="counter">
        <p>{counter}</p>
      </div>
    </div>
  );
}

export default Footer;
