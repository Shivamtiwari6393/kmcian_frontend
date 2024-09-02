import "../Styles/Header.css";
import { NavLink } from "react-router-dom";

import home from "../assets/home.png";
import upload from "../assets/upload.png";
import discussion from "../assets/discussion.png";
import loginIcon from "../assets/login.png";

export default function Header() {
  return (
    <div className="header-container">
      <div className="nav-links">
        <span>
          <NavLink to={"/"}>
            <img src={home} alt="home" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/Upload"}>
            <img src={upload} alt="upload" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/Discussion"}>
            <img src={discussion} alt="discussion" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/Login"}>
            <img src={loginIcon} alt="login" />
          </NavLink>
        </span>
      </div>
    </div>
  );
}
