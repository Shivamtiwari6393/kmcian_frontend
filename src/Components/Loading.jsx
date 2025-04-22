/* eslint-disable react/prop-types */
import "../Styles/Loading.css";

function Loading({ progress }) {
  return (
    <div className="loading-container">
      <div className="loader-container">
        <div className="loader"> </div>
        <div className="loading-text">{progress ? progress + "%" : ""}</div>
      </div>
    </div>
  );
}

export default Loading;
