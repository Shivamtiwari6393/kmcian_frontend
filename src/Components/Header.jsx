import "../Styles/Header.css";
import { NavLink } from "react-router-dom";

import logo from "../assets/kmclu-logo.png";
import home from "../assets/home.png";
import upload from "../assets/upload.png";
import discussion from "../assets/discussion.png";

export default function Header() {
  return (
    <div className="header-container">
      <div className="logo">
        <img src={logo} alt="KMCLU image" />
      </div>
      <div className="nav">
        <span>
          <NavLink to={"/"}>
            <img src={home} alt="home" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/Upload"}>
            <img src={upload} alt="" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/Discussion"}>
            <img src={discussion} alt="" />
          </NavLink>
        </span>
      </div>
    </div>
  );
}
