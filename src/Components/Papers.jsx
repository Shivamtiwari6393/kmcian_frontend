/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useContext, useState } from "react";
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

  const [isAdmin] = useContext(adminContext);

  const [searchInput, setSearchInput] = useState("");

  const [FilterdData, setFilterdData] = useState(reqPapers);

  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [id, setId] = useState(null);
  const [clicked, setClicked] = useState(null);

  // checking token

  // -------------search function----------------------

  const onSearchInputChange = (e) => {
    console.log(isAdmin);

    setSearchInput(e.target.value);
    setFilterdData(filter());
  };

  const filter = () => {
    const filterdData = reqPapers.filter((element) => {
      return element.paper.toLowerCase().includes(searchInput.toLowerCase());
    });

    return filterdData;
  };

  // ---------------Handle file download----------------------------

  const handleDownload = async (element) => {
    const selectedPaper = element;

    const encodedCourse = encodeURIComponent(selectedPaper.course);
    const encodedYear = encodeURIComponent(selectedPaper.year);
    const encodedBranch = encodeURIComponent(selectedPaper.branch);
    const encodedPaper = encodeURIComponent(selectedPaper.paper);

    const loadId = toast.loading("Downloading...");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${url}/paper/download?course=${encodedCourse}&year=${encodedYear}&paper=${encodedPaper}&branch=${encodedBranch}&semester=${selectedPaper.semester}&t=${selectedPaper.t}`
      );

      if (!response.ok) {
        setIsLoading(false);
        const data = await response.json();
        throw new Error(data.message);
      }

      const blob = await response.blob();

      // ---------  Accessing filename--------------

      const filename = selectedPaper.paper || "Kmcian_Paper.pdf";

      //------------------ Saving pdf-----------------------------

      saveAs(blob, filename);
      setIsLoading(false);
      toast.success("Paper downloaded succesfully", { id: loadId });
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message, { id: loadId });
    }
  };

  // on update button click

  const handleUpdate = (selectedOption) => {
    navigate("/update", { state: selectedOption });
  };

  // handle flag button click

  const handleFlagButtonClick = async (e,element) => {
    e.stopPropagation()
    setId(element._id);
    setShowDescription(!showDescription);
  };

  // description

  const descriptionOptions = [
    "It's not a PYQ.",
    "Wrong paper name.",
    "Wrong semester or year.",
    "Wrong faculty.",
  ];

  const handleSubmitFlagReason = async (element) => {
    const resposeId = toast.loading("Submitting response...");

    try {
      const response = await fetch(`${url}/flag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...element,
          description: descriptionOptions[clicked],
        }),
      });

      if (response.ok) return toast.success("Done", { id: resposeId });

      const data = await response.json();

      throw new Error(data.message);
    } catch (error) {
      return toast.error(error.message, { id: resposeId });
    }finally{
      setId(null)
      setClicked(null)
      setDescription(null)
    }
  };

  // ==================================================================================

  return (
    <div className="papers-container" onClick={()=> setId(null)}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          onChange={onSearchInputChange}
          value={searchInput}
        />
      </div>

      {isLoading && <Loading></Loading>}

      {FilterdData.map((element) => (
        <div className="paper-details" key={element["_id"]}>
          <div className="report">
            <FontAwesomeIcon
              icon={faFlag}
              alt="flag button"
              onClick={(e) => handleFlagButtonClick(e,element)}
            />
            {element._id === id && showDescription && (
              <>
                <div className="description-container">
                  <h3>Reason</h3>
                  <hr />
                  {showDescription &&
                    descriptionOptions.map((data, index) => (
                      <div className="description-options" key={index}>
                        <p
                          style={{
                            backgroundColor:
                              clicked === index
                                ? "rgb(95, 164, 193)"
                                : "rgb(255, 255, 255)",
                          }}
                          onClick={() => setClicked(index)}
                        >
                          {data}
                        </p>
                      </div>
                    ))}
                  <div className="submit-button-container">
                    <button onClick={() => handleSubmitFlagReason(element)}>
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="paperName">
            <p>{element.paper}</p>
          </div>

          <div className="branch">
            <p>{element.branch}</p>
          </div>
          <div className="semester">
            <p>{element.semester}</p>
          </div>
          <div className="year">
            <p>{element.year}</p>
          </div>
          <div className="name">
            <p>
              <div>Uploaded by</div>
              {element.name}
            </p>
          </div>

          <div className="button-container">
            <div
              className="download-button-container"
              onClick={() => handleDownload(element)}
            >
              <FontAwesomeIcon
                icon={faDownload}
                style={{ fontSize: "1.2rem" }}
                alt="download button"
              />
            </div>

            <div
              className="update-button-container"
              onClick={(e) => handleUpdate(element)}
            >
              {isAdmin && (
                <>
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ fontSize: "1.2rem" }}
                    alt="download button"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
