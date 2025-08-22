import { Suspense, useState } from "react";
import "./App.css";
import "./Components/Header";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Loading from "./Components/Loading";
import Footer from "./Components/Footer";
import { Toaster } from "react-hot-toast";

import adminContext from "./Components/adminContext";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // ============================================================

  return (
    <adminContext.Provider value={[isAdmin, setIsAdmin]}>
      <div className="app">
        <Toaster />
        <Header />
        <Suspense fallback={<Loading></Loading>}>
          <Outlet></Outlet>
        </Suspense>
        <Footer></Footer>
      </div>
    </adminContext.Provider>
  );
}

export default App;
