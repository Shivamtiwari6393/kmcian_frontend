import { useEffect, useState } from "react";
import "../Styles/Login.css";
import userIcon from "../assets/user.png";
import passwordIcon from "../assets/password.png";
import Loading from "./Loading";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [logout, setLogout] = useState(true);



  const doLogout = ()=>{

    localStorage.removeItem('kmciantoken')
    setLogout(false)

  }



  useEffect(() => {
    const value = localStorage?.getItem("kmciantoken");
    if (value) {
      setLogout(true)
    }
    else setLogout(false)
  },[]);

  // handle input change

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // on login button click

  const handleButtonClick = () => {
    // const url = "http://127.0.0.1:8000/api/login";
    const url = "https://kmcianbackend.vercel.app/api/login";

    setIsLoading(true);

    // fetch request

    fetch(url, {
      method: "POST",
      body: JSON.stringify(credentials),
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "An error occurred");
          });
        }
        return res.json();
      })
      .then((data) => {
        // if login successfull save the token
        localStorage.setItem("kmciantoken", data.token);
        setError("Login Successfull");
        setLogout(true);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  };

  return (
    <>
      {isLoading && <Loading></Loading>}
      <div className="login-container">
        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}
        <div className="login-header">
          <h4>Login</h4>
        </div>
        <div className="login-fields">
          <div className="username-container">
            <label htmlFor="username">
              <img src={userIcon} alt="username" />
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
              <img src={passwordIcon} alt="password" />
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
            <button onClick={handleButtonClick}>Login</button>
          </div>
          {logout && (
            <div className="logout-button-container">
              <button onClick={doLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
