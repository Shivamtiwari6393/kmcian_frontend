/* eslint-disable react-refresh/only-export-components */
import React,{lazy} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// eslint-disable-next-line react-refresh/only-export-components
import Card from "./Components/Card.jsx";
const Upload = lazy(()=> import( "./Components/Upload.jsx"));
const Discussion =  lazy(()=> import("./Components/Discussion.jsx"))
const Papers  = lazy(() => import("./Components/Papers.jsx"))
const Update = lazy(()=> import("./Components/Update.jsx"))

const route = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Card></Card>,
      },
      {
        path: "/Papers",
        element: <Papers></Papers>,
      },
      {
        path: "/Upload",
        element: <Upload></Upload>,
      },
      {
        path: "/Discussion",
        element: <Discussion></Discussion>,
      },
      {
        path: "/Update",
        element: <Update></Update>,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </React.StrictMode>
);
