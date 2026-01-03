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
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const token = sessionStorage.getItem("kmcianToken");
    const userId = sessionStorage.getItem("userId")
    if (token && userId) {
      setIsAdmin(userId);
    }
  }, []);

  // ============================================================

  return (
    <adminContext.Provider value={[isAdmin, setIsAdmin]}>
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
