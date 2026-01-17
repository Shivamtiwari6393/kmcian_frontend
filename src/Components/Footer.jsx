/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "../Styles/Footer.css";
function Footer() {
  const [counter, setCounter] = useState("");

  useEffect(() => {
    const url = "https://kmcianbackend.vercel.app/api/request/v1";
    try {
      fetch(`${url}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => setCounter(data.count))
        .catch((err) => {
          console.log(err.message, "view count");
        });
    } catch (error) {console.log(error);
    }
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
