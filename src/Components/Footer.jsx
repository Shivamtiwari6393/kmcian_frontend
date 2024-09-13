/* eslint-disable react/prop-types */
import "../Styles/Footer.css";
function Footer({counter}) {

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
