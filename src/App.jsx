import { Suspense } from "react";
import "./App.css";
import "./Components/Header";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Loading from "./Components/Loading";
function App() {
  return (
    <div className="app">
      <Header />
      <Suspense fallback={<Loading></Loading>}>
        <Outlet></Outlet>
      </Suspense>
    </div>
  );
}

export default App;
