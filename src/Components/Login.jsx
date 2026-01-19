/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import "../Styles/Login.css";
import { toast } from "react-hot-toast";
import adminContext from "./adminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

function Login() {
  // const url = "http://127.0.0.1:8000/api/user/login";
  // const url =  "http://172.21.185.27:8000/api/user/login"
  const url = "https://kmcianbackend.vercel.app/api/user/login";

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useContext(adminContext);

  const doLogout = () => {
    sessionStorage.removeItem("kmcianToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("role");
    setUser((prev) => ({
      ...prev,
      userId: null,
      role: null,
      username: null,
    }));
    toast.success("Logged out successfully!");
  };

  // handle input change

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // on login button click

  const handleLoginButtonClick = async () => {
    if (!credentials.email) return toast.error("Please enter your email.");
    if (!credentials.password) return toast.error("Please enter the password.");

    //============ login request==============
    const id = toast.loading("Request in process...");
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "An error occurred");
      sessionStorage.setItem("kmcianToken", data.token);
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("username", data.username);

      toast.success(data.message || "Login successful!", { id: id });
      setUser((prev) => ({
        ...prev,
        userId: data.userId,
        role: data.role,
        username: data.username,
      }));
    } catch (e) {
      toast.error(e.message, { id: id });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* {isLoading && <Loading></Loading>} */}
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
         
            <div
              className={
                user.userId
                  ? "logout-button-container"
                  : "login-button-container"
              }
            >
              <button
                onClick={user.userId ? doLogout : handleLoginButtonClick}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : user.userId ? "Logout" : "Login"}
              </button>
            </div>
        </div>
        <span>
          <NavLink to={"/registration"}>Registration</NavLink>
        </span>
      </div>
    </>
  );
}

export default Login;
