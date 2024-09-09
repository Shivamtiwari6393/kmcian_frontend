/* eslint-disable react-refresh/only-export-components */
import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// eslint-disable-next-line react-refresh/only-export-components
import Card from "./Components/Card.jsx";
const Announcment = lazy(() => import("./Components/Announcment.jsx"));
const Upload = lazy(() => import("./Components/Upload.jsx"));
const Discussion = lazy(() => import("./Components/Discussion.jsx"));
const Papers = lazy(() => import("./Components/Papers.jsx"));
const Update = lazy(() => import("./Components/Update.jsx"));
const Login = lazy(() => import("./Components/Login.jsx"));
const Chat = lazy(() => import("./Components/Chat.jsx"));

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
        path: "/papers",
        element: <Papers></Papers>,
      },
      {
        path: "/upload",
        element: <Upload></Upload>,
      },
      {
        path: "/discussion",
        element: <Discussion></Discussion>,
      },
      {
        path: "/update",
        element: <Update></Update>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/chat",
        element: <Chat></Chat>,
      },
      {
        path: "/announcment",
        element: <Announcment></Announcment>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </React.StrictMode>
);
