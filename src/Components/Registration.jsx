/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import adminContext from "./adminContext";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

import "../Styles/Login.css";

export default function Registration() {
    // const url = "http://127.0.0.1:8000/api/user/register";
  const url = "https://kmcianbackend.vercel.app/api/user/register";

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(adminContext);
  // handle input change

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // on login button click

  const handleRegistrationButtonClick = async () => {
    if (!credentials.email) return toast.error("Please enter your email.");
    if (!credentials.password) return toast.error("Please enter the password.");

    //============ login fetch request==============
    const id = toast.loading("Registration in progress...");
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "An error occurred");
      toast.success(data.message || "Registration successful!", { id: id });
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
          <h3>Registration</h3>
        </div>
        <div className="login-fields">
          <div className="username-container">
            <label htmlFor="username">
              <FontAwesomeIcon
                icon={faFaceFrown}
                style={{ color: "#ffffff" }}
              />
            </label>
            <input
              type="text"
              placeholder="Name"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
            />
          </div>
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
              type="text"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>

          {user.userId && (
            <div className="logout-button-container">
              <button onClick={handleRegistrationButtonClick}>Register</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
