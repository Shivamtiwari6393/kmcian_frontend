/* eslint-disable no-unused-vars */
import "../Styles/Header.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faUpload,
  faQuestion,
  faBullhorn,
  faInfo,
  faCirclePlay,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import adminContext from "./adminContext";

export default function Header() {
  const [isAdmin, setIsAdmin] = useContext(adminContext);

  return (
    <div className="header-container">
      <div className="nav-links">
        <span>
          <NavLink to={"/"}>
            <FontAwesomeIcon icon={faHouse} />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/upload"}>
            <FontAwesomeIcon icon={faUpload} />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/shorts"}>
            <FontAwesomeIcon icon={faCirclePlay} />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/queries"}>
            <FontAwesomeIcon icon={faQuestion} />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/login"}>
            <FontAwesomeIcon icon={faUser} />
          </NavLink>
        </span>

        <span>
          <NavLink to={"/announcements"}>
            <FontAwesomeIcon icon={faBullhorn} />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/about"}>
            <FontAwesomeIcon icon={faInfo} />
          </NavLink>
        </span>
      </div>
    </div>
  );
}
