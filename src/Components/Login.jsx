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
  // const url =  "http://172.21.185.27:8000/api/user/login"
  const url = "https://kmcianbackend.vercel.app/api/user/login";

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useContext(adminContext);

  const doLogout = () => {
    sessionStorage.removeItem("kmcianToken");
    setIsAdmin(false);
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

    //============ login fetch request==============
    const id = toast.loading("Logging in");
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
      toast.success(data.message || "Login successful!", { id: id });
      setIsAdmin(true);
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
          {!isAdmin && (
            <div className="login-button-container">
              <button onClick={handleLoginButtonClick}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          )}

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
