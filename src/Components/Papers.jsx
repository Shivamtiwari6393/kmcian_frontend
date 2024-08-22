/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import { useState } from "react";

export default function Papers() {
  const location = useLocation();
  const reqPapers = location.state;

  const [isLoading, setIsLoading] = useState(false);

  // ---------------Handle file download----------------------------

  const handleDownload = async (e) => {
    const selectedPaper = JSON.parse(e.currentTarget.dataset.value);

    const encodedBranch = encodeURIComponent(selectedPaper.branch);
    const encodedPaper = encodeURIComponent(selectedPaper.paper);

    setIsLoading(true);

    try {
      // const url = "http://127.0.0.1:8000"
      const url = "https://kmcianbackend.vercel.app";

      const response = await fetch(
        `${url}/api/paper/download?paper=${encodedPaper}&branch=${encodedBranch}&semester=${selectedPaper.semester}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "An error occurred");
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

  const ond = (e) => {};

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

          <div className="download">
            <button
              data-value={`{"branch": "${element.branch}", "paper": "${element.paper}", "semester": "${element.semester}"}`}
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
