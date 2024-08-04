import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Upload from "./Components/Upload.jsx";
import Card from "./Components/Card.jsx";
import Discussion from "./Components/Discussion.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
        element: <Card></Card>,
      },
      {
        path: "/Upload",
        element: <Upload></Upload>,
      },
      {
        path: "/Discussion",
        element: <Discussion></Discussion>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </React.StrictMode>
);
