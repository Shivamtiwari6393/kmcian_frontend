import { Suspense, useEffect, useState } from "react";
import "./App.css";
import "./Components/Header";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import { Toaster } from "react-hot-toast";

import adminContext from "./Components/adminContext";
import RoundMotion from "./Components/RoundMotion";

function App() {
  const [user, setUser] = useState({
    userId: null,
    role: null,
    username: null,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("kmcianToken");
    const userId = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("role");
    const username = sessionStorage.getItem("username");

    if (token && userId) {
      setUser({ userId, role, username });
    }
  }, []);

  // ============================================================

  return (
    <adminContext.Provider value={[user, setUser]}>
      <div className="app">
        <Toaster />
        <Header />
        <Suspense fallback={<RoundMotion></RoundMotion>}>
          <Outlet></Outlet>
        </Suspense>
        <Footer></Footer>
      </div>
    </adminContext.Provider>
  );
}

export default App;
