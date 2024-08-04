import "./App.css";
import "./Components/Header";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <Header />
      <Outlet></Outlet>
    </>
  );
}

export default App;
