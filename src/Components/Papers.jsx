/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import downloadIcon from "../assets/download.png";

export default function Papers() {
  useEffect(() => {
    setTimeout(() => {
      const value = localStorage?.getItem("kmciantoken");
      console.log(value, "token card");
      if (value) {
        const elements = document.getElementsByClassName("updatebutton");
        if (elements) {
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.style.display = "block";
          }
        }
      }
    }, 0);
  });
  const navigate = useNavigate();

  const location = useLocation();
  const reqPapers = location.state;

  const [isLoading, setIsLoading] = useState(false);

  // ---------------Handle file download----------------------------

  const handleDownload = async (e) => {
    const selectedPaper = JSON.parse(e.currentTarget.dataset.value);

    const encodedCourse = encodeURIComponent(selectedPaper.course);
    const encodedYear = encodeURIComponent(selectedPaper.year);
    const encodedBranch = encodeURIComponent(selectedPaper.branch);
    const encodedPaper = encodeURIComponent(selectedPaper.paper);

    setIsLoading(true);

    try {
      const url = "http://127.0.0.1:8000"
      // const url = "https://kmcianbackend.vercel.app";

      const response = await fetch(
        `${url}/api/paper/download?course=${encodedCourse}&year=${encodedYear}&paper=${encodedPaper}&branch=${encodedBranch}&semester=${selectedPaper.semester}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "An error occurred");
      }

      const blob = await response.blob();

      // ---------  Accessing filename--------------

      const filename = selectedPaper.paper || "Kmcian_Paper.pdf";

      //------------------ Saving pdf-----------------------------

      saveAs(blob, filename);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (event) => {
    const choosed = JSON.parse(event.currentTarget.dataset.value);
    navigate("/Update", { state: choosed });
  };

  return (
    <div className="papers" id="cards">
      {isLoading && <Loading></Loading>}

      {reqPapers.map((element, index) => (
        <div className="names" key={index}>
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

          <div className="download-button-container">
            <button
              data-value={`{"course":"${element.course}","branch": "${element.branch}", "paper": "${element.paper}", "semester": "${element.semester}", "year": "${element.year}"}`}
              onClick={handleDownload}
            >
              <img src={downloadIcon} alt="download button" />
            </button>

            <button
              id="update-button"
              className="updatebutton"
              onClick={handleUpdate}
              data-value={`{"id":"${element._id}","branch": "${element.branch}", "paper": "${element.paper}", "semester": "${element.semester}","year": "${element.year}","course": "${element.course}", "name": "${element.name}", "downloadable": "${element.downloadable}", "createdAt": "${element.createdAt}", "updatedAt": "${element.updatedAt}"}`}
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
