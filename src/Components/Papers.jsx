/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import downloadIcon from "../assets/download.png";
import toast from "react-hot-toast";

export default function Papers() {
  const navigate = useNavigate();

  const location = useLocation();

  const reqPapers = location.state;

  const [isLoading, setIsLoading] = useState(false);

  // checking token

  useEffect(() => {
    setTimeout(() => {
      const value = localStorage?.getItem("kmciantoken");
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

  // ---------------Handle file download----------------------------

  const handleDownload = async (e) => {
    const selectedPaper = JSON.parse(e.currentTarget.dataset.value);

    const encodedCourse = encodeURIComponent(selectedPaper.course);
    const encodedYear = encodeURIComponent(selectedPaper.year);
    const encodedBranch = encodeURIComponent(selectedPaper.branch);
    const encodedPaper = encodeURIComponent(selectedPaper.paper);

    setIsLoading(true);

    try {
      // const url = "http://127.0.0.1:8000/api/paper";
      const url = "https://kmcianbackend.vercel.app/api/paper";

      const response = await fetch(
        `${url}/download?course=${encodedCourse}&year=${encodedYear}&paper=${encodedPaper}&branch=${encodedBranch}&semester=${selectedPaper.semester}`
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
      toast.success("Paper downloaded succesfully");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  // on update button click

  const handleUpdate = (event) => {
    const choosed = JSON.parse(event.currentTarget.dataset.value);
    navigate("/update", { state: choosed });
  };

  // ==================================================================================

  return (
    <div className="papers-container">
      {isLoading && <Loading></Loading>}

      {reqPapers.map((element) => (
        <div className="names" key={element["_id"]}>
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

          {/* download button */}

          <div className="download-button-container">
            <button
              data-value={`{"course":"${element.course}","branch": "${element.branch}", "paper": "${element.paper}", "semester": "${element.semester}", "year": "${element.year}"}`}
              onClick={handleDownload}
            >
              <img src={downloadIcon} alt="download button" />
            </button>

            {/* update botton */}

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
