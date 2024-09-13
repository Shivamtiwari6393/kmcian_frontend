import { Suspense, useEffect, useState } from "react";
import "./App.css";
import "./Components/Header";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Loading from "./Components/Loading";
import Footer from "./Components/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  const [counter, setCounter] = useState("");
  useEffect(() => {
    const url = "https://kmcianbackend.vercel.app/api/request";
    fetch(`${url}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setCounter(data.count));
  }, []);
  return (
    <div className="app">
      <Toaster />
      <Header />
      <Suspense fallback={<Loading></Loading>}>
        <Outlet></Outlet>
      </Suspense>
      <Footer counter = {counter}></Footer>
    </div>
  );
}

export default App;
