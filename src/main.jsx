/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import User from "./Components/User.jsx";
const Announcement = lazy(() => import("./Components/Announcement.jsx"));
const Upload = lazy(() => import("./Components/Upload.jsx"));
const Query = lazy(() => import("./Components/Query.jsx"));
const Papers = lazy(() => import("./Components/Papers.jsx"));
const Update = lazy(() => import("./Components/Update.jsx"));
const Login = lazy(() => import("./Components/Login.jsx"));
const Chat = lazy(() => import("./Components/Chat.jsx"));
const About = lazy(() => import("./Components/About.jsx"));
const Registration = lazy(() => import("./Components/Registration.jsx"));
const Shorts = lazy(() => import("./Components/Shorts.jsx"));
const Card = lazy(() => import("./Components/Card.jsx"));
const ErrorComponent = lazy(() => import("./Components/ErrorComponent.jsx"));

const route = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorComponent />,
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
        path: "/queries",
        element: <Query></Query>,
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
        path: "/announcements",
        element: <Announcement></Announcement>,
      },

      {
        path: "/shorts/:c?",
        element: <Shorts />,
      },
      {
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/user",
        element: <User />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={route}></RouterProvider>
);
