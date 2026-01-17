/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useContext, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import adminContext from "./adminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faFlag } from "@fortawesome/free-solid-svg-icons";

export default function Papers() {
  // const url = "http://127.0.0.1:8000/api";
  const url = "https://kmcianbackend.vercel.app/api";

  const navigate = useNavigate();
  const location = useLocation();
  const reqPapers = location.state;

  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(adminContext);
  const [searchInput, setSearchInput] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [clicked, setClicked] = useState(null);


  const filteredData = useMemo(() => {
    return reqPapers.filter((el) =>
      el.paper.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [reqPapers, searchInput]);

  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };


  const handleDownload = async (paper) => {
    const loadId = toast.loading("Downloading...");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${url}/paper/download?course=${encodeURIComponent(
          paper.course
        )}&year=${encodeURIComponent(paper.year)}&paper=${encodeURIComponent(
          paper.paper
        )}&branch=${encodeURIComponent(paper.branch)}&semester=${
          paper.semester
        }&t=${paper.t}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      saveAs(blob, paper.paper || "paper.pdf");

     return toast.success("Downloaded", { id: loadId });
    } catch (err) {
     return toast.error(err.message, { id: loadId });
    } finally {
      setIsLoading(false);
    }
  };


  const descriptionOptions = [
    "It's not a PYQ.",
    "Wrong paper name.",
    "Wrong faculty.",
    "Wrong semester or year.",
  ];

  const handleFlagClick = (e, id) => {
    e.stopPropagation();
    setActiveId(id);
    setClicked(null);
  };

  const handleOptionClick = (e, index) => {
    e.stopPropagation();
    setClicked(index);
  };

  const handleSubmitFlag = async (e, paper) => {
    e.stopPropagation();
    if (clicked === null) return;

    const toastId = toast.loading("Submitting...");
    try {
      const res = await fetch(`${url}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paper,
          description: descriptionOptions[clicked],
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Submitted", { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setActiveId(null);
      setClicked(null);
    }
  };

  const closePopup = useCallback(() => setActiveId(null), []);

  // ---------------- UPDATE ----------------

  const handleUpdate = (paper) => {
    navigate("/update", { state: paper });
  };

  // ====================================================

  return (
    <div className="papers-container" onClick={closePopup}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={onSearchInputChange}
        />
      </div>

      {isLoading && <Loading />}

      {filteredData.map((paper) => (
        <div className="paper-details" key={paper._id}>
          <div className="report">
            <FontAwesomeIcon
              icon={faFlag}
              onClick={(e) => handleFlagClick(e, paper._id)}
            />

            {activeId === paper._id && (
              <div className="description-container">
                <h3>Select a Reason</h3>
                <hr />
                {descriptionOptions.map((opt, i) => (
                  <p
                    key={i}
                    className={clicked === i ? "desc-active" : "desc"}
                    onClick={(e) => handleOptionClick(e, i)}
                  >
                    {i + 1}. {opt}
                  </p>
                ))}
                <button onClick={(e) => handleSubmitFlag(e, paper)}>
                  Submit
                </button>
              </div>
            )}
          </div>

          <div className="paperName"><p>{paper.paper}</p></div>
          <div className="branch"><p>{paper.branch}</p></div>
          <div className="semester"><p>{paper.semester}</p></div>
          <div className="year"><p>{paper.year}</p></div>

          <div className="name">
            <p>Uploaded by</p>
            <p>{paper.name}</p>
          </div>

          <div className="button-container">
            <div onClick={() => handleDownload(paper)}>
              <FontAwesomeIcon icon={faDownload} />
            </div>

            {user.userId && (
              <div onClick={() => handleUpdate(paper)}>
                <FontAwesomeIcon icon={faEdit} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
