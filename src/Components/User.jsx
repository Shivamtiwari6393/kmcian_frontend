import { useContext, useState } from "react";
import adminContext from "./adminContext.jsx";
import "../Styles/user.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faCheck,
  faEdit,
  faHourglass,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
function User() {
  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const [user] = useContext(adminContext);
  const [data, setData] = useState(null);
  const [flag, setFlag] = useState();
  const [newPapers, setNewPapers] = useState();
  const navigate = useNavigate();

  //====== fetching data ============

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user.userId) return toast.error("UserId missing");
    const res = await fetch(`${url}/api/user/?userId=${user.userId}`);
    const data = await res.json();

    if (res.ok) setData(data);
    else toast.error(data.message);
  };

  const handleUpdate = (selectedOption) => {
    navigate("/update", { state: selectedOption });
  };

  const getFlagData = async () => {
    if (flag) return setFlag(null);
    const loadId = toast.loading("fetching Flag Data");
    try {
      const res = await fetch(`${url}/api/flag`);
      toast.success("fetching completed", { id: loadId });
      if (!res.ok) return toast.error("error in fetching flag data");
      const data = await res.json();
      setFlag(data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getNewPapersData = async () => {
    if (newPapers) return setNewPapers(null);
    const loadId = toast.loading("fetching Flag Data");
    try {
      const res = await fetch(`${url}/api/paper/v1`);
      toast.success("fetching completed", { id: loadId });
      if (!res.ok) return toast.error("error in fetching flag data");
      const data = await res.json();
      setNewPapers(data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
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
                    _id: d.paperId._id,
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
      {user.role === "superadmin" && (
        <>
          <div className="flag-activity-container">
            <h3 onClick={getFlagData}>
              Flag Activity
              <FontAwesomeIcon icon={flag ? faCaretDown : faCaretUp} />
            </h3>
            <hr />
            {flag?.map((data) => (
              <div className="flag" key={data._id}>
                <p>REASON: {data.description}</p>
                <p>BRANCH: {data.branch}</p>
                <p>PAPER: {data.paper}</p>
                <p>UPLOADED BY: {data.name}</p>
                <p>
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() =>
                      handleUpdate({
                        _id: data._id,
                        branch: data.branch,
                        course: data.course,
                        paper: data.paper,
                        semester: data.semester,
                        year: data.year,
                        name: data.name,
                        downloadable: data.downloadable,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                      })
                    }
                  ></FontAwesomeIcon>
                </p>
              </div>
            ))}
          </div>
          <div className="flag-activity-container">
            <h3 onClick={getNewPapersData}>
              New Papers
              <FontAwesomeIcon icon={flag ? faCaretDown : faCaretUp} />
            </h3>
            <hr />
            {newPapers?.map((data) => (
              <div className="flag" key={data._id}>
                <p>BRANCH: {data.branch}</p>
                <p>COURSE: {data.course}</p>
                <p>PAPER: {data.paper}</p>
                <p>SEMESTER: {data.semester}</p>
                <p>YEAR: {data.year}</p>
                <p>UPLOADED BY: {data.name}</p>
                <p>
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() =>
                      handleUpdate({
                        _id: data._id,
                        branch: data.branch,
                        course: data.course,
                        paper: data.paper,
                        semester: data.semester,
                        year: data.year,
                        name: data.name,
                        downloadable: data.downloadable,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                      })
                    }
                  ></FontAwesomeIcon>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default User;
