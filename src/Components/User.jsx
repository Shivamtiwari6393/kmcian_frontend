import { useContext, useState } from "react";
import adminContext from "./adminContext.jsx";
import "../Styles/user.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEdit,
  faHourglass,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
function User() {
  // const url = "http://127.0.0.1:8000/api/user";
  const url = "https://kmcianbackend.vercel.app/api/user";

  const [user] = useContext(adminContext);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  //====== fetching data ============

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user.userId) return toast.error("UserId missing");
    const res = await fetch(`${url}/?userId=${user.userId}`);
    const data = await res.json();

    if (res.ok) setData(data);
    else toast.error(data.message);
  };

  const handleUpdate = (selectedOption) => {
    navigate("/update", { state: selectedOption });
  };

  // console.log(data.papers[0].paperId);

  return (
    <div className="user-container">
      <h3 onClick={fetchData}>Welcome, {user.username}</h3>
      <br />
      <hr />

      <div className="data-container">
        {data?.papers.map((d) => (
          <div className="info-container" key={d._id}>
            <p>{d.paperId.paper}</p>
            <p key={d.paperId._id}>{d.paperId.paper}</p>
            <p>
              {d.paperId.downloadable ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faHourglass} />
              )}
            </p>
            <p>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() =>
                  handleUpdate({
                    _id: d.paperId.paperId,
                    branch: d.paperId.branch,
                    course: d.paperId.course,
                    paper: d.paperId.paper,
                    semester: d.paperId.semester,
                    year: d.paperId.year,
                    name: d.paperId.name,
                    downloadable: d.paperId.downloadable,
                    createdAt: d.paperId.createdAt,
                    updatedAt: d.paperId.updatedAt,
                  })
                }
              ></FontAwesomeIcon>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default User;
