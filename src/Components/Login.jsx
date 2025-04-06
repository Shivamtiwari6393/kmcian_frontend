/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import "../Styles/Login.css";
import Loading from "./Loading";
import { toast } from "react-hot-toast";
import adminContext from "./adminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

function Login() {
  // const url = "http://127.0.0.1:8000/api/user/login";
  const url = "https://kmcianbackend.vercel.app/api/user/login";

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [logout, setLogout] = useState(false);

  const [isAdmin, setIsAdmin] = useContext(adminContext);

  let timerId = null;

  const doLogout = () => {
    sessionStorage.removeItem("kmcianToken");
    setLogout(false);
    setIsAdmin(false);
    toast.success("Logged out successfully!");
    if (timerId) {
      clearTimeout(timerId);
    }
  };

  const setcounter = () => {
    timerId = setTimeout(() => {
      doLogout();
    }, 3600000);
  };

  // handle input change

  const handleInputChange = (e) => {
    console.log(isAdmin);

    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // on login button click

  const handleButtonClick = () => {
    if (!credentials.email) return toast.error("Please enter your email.");
    if (!credentials.password) return toast.error("Please enter the password.");

    setIsLoading(true);

    //============ login fetch request==============

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "An error occurred");
        setIsLoading(false);
        sessionStorage.setItem("kmcianToken", data.token);
        toast.success(data.message || "Login successful!");
        setcounter();
        setLogout(true);
        setIsAdmin(true);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.message);
      });
  };

  return (
    <>
      {isLoading && <Loading></Loading>}
      <div className="login-container">
        <div className="login-header">
          <h3>Login</h3>
        </div>
        <div className="login-fields">
          <div className="username-container">
            <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
            </label>
            <input
              type="text"
              placeholder="Username/Email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="password-container">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} style={{ color: "#ffffff" }} />
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="login-button-container">
            <button onClick={handleButtonClick} disabled={isAdmin}>
              Login
            </button>
          </div>
          {isAdmin && (
            <div className="logout-button-container">
              <button onClick={doLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
