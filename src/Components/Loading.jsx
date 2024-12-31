/* eslint-disable react/prop-types */
import "../Styles/Loading.css";

function Loading({progress}) {
  return (
    <div className="loading-container">
      {progress ? progress+'%': "½ bit"}
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;
