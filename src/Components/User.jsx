import { useContext, useState } from "react";
import adminContext from "./adminContext.jsx";
import "../Styles/user.css";
import toast from "react-hot-toast";
function User() {
//   const url = "http://127.0.0.1:8000/api/user";
  const url = "https://kmcianbackend.vercel.app/api/user";

  const [user] = useContext(adminContext);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`${url}/?userId=${user.userId}`);
    const data = await res.json();
    if (res.ok) setData(data);
    else toast.error(data.message);
  };

  return (
    <div className="user-container">
      <h3 onClick={fetchData}>Welcome, {user.username}</h3>
      <br />
      <hr />

      {data?.papers.map((d) => (
        <p key={d._id}>
          Paper: {d.paper} , faculty: {d.course}, Branch: {d.branch}, semester:{" "}
          {d.semester}, year: {d.year}, Paper: {d.paper}
          <br />
          <hr />
          <br />
        </p>
      ))}
    </div>
  );
}

export default User;
