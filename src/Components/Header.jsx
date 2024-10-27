import "../Styles/Header.css";
import { NavLink } from "react-router-dom";
import home from "../assets/home.png";
import upload from "../assets/upload.png";
import discussion from "../assets/discussion.png";
import loginIcon from "../assets/login.png";
import ann from "../assets/announcment.png";
import information from "../assets/info.png"

export default function Header() {
  return (
    <div className="header-container">
      <div className="nav-links">
        <span>
          <NavLink to={"/"}>
            <img src={home} alt="home" title="Home" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/upload"}>
            <img src={upload} alt="upload" title="Upload" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/queries"}>
            <img src={discussion} alt="queries" title="queries" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/login"}>
            <img src={loginIcon} alt="login" title="Login" />
          </NavLink>
        </span>

        <span>
          <NavLink to={"/announcements"}>
            <img src={ann} alt="announcements" title="announcements" />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/about"}>
            <img src={information} alt="about" title="about" />
          </NavLink>
        </span>
      </div>
    </div>
  );
}
