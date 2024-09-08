import { Suspense } from "react";
import "./App.css";
import "./Components/Header";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Loading from "./Components/Loading";
import Footer from "./Components/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="app">
      <Toaster />
      <Header />
      <Suspense fallback={<Loading></Loading>}>
        <Outlet></Outlet>
      </Suspense>
      <Footer></Footer>
    </div>
  );
}

export default App;
