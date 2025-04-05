import "../Styles/Header.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser , faUpload, faQuestion, faBullhorn, faInfo} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <div className="header-container">
      <div className="nav-links">
        <span>
          <NavLink to={"/"}>
            {/* <img src={home} alt="home" title="Home" /> */}
            <FontAwesomeIcon icon={faHouse} style={{color: "#ffffff",}} />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/upload"}>
            {/* <img src={upload} alt="upload" title="Upload" /> */}
            <FontAwesomeIcon icon={faUpload} style={{color: "#ffffff",}} />

          </NavLink>
        </span>
        <span>
          <NavLink to={"/queries"}>
            {/* <img src={discussion} alt="queries" title="queries" /> */}
            <FontAwesomeIcon icon={faQuestion} style={{color: "#ffffff",}} />

          </NavLink>
        </span>
        <span>
          <NavLink to={"/login"}>
            {/* <img src={loginIcon} alt="login" title="Login" /> */}

            <FontAwesomeIcon icon={faUser} style={{color: "#ffffff",}} />


          </NavLink>
        </span>

        <span>
          <NavLink to={"/announcements"}>
            {/* <img src={ann} alt="announcements" title="announcements" /> */}
            <FontAwesomeIcon icon={faBullhorn} style={{color: "#ffffff",}}  />
          </NavLink>
        </span>
        <span>
          <NavLink to={"/about"}>
            {/* <img src={information} alt="about" title="about" /> */}
            <FontAwesomeIcon icon={faInfo}  style={{color: "#ffffff",}} />
          </NavLink>
        </span>
      </div>
    </div>
  );
}
