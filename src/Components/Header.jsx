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
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
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
