/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation } from "react-router-dom";

export default function Papers() {
  const location = useLocation();
  const reqPapers = location.state;

  // ---------------Handle file download----------------------------

  const handleDownload = async (e) => {
    const selectedPaper = JSON.parse(e.currentTarget.dataset.value);

    const encodedBranch = encodeURIComponent(selectedPaper.branch);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/paper/download?paper=${selectedPaper.paper}&branch=${encodedBranch}&semester=${selectedPaper.semester}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "An error occurred");
      }

      const blob = await response.blob();

      // ---------  Accessing filename--------------
      console.log(response.headers.get("X-Filename"));
      const filename = response.headers.get("X-Filename") || "Kmcian_Paper.pdf";

      //------------------ Saving pdf-----------------------------
      saveAs(blob, filename);
    } catch (error) {
      alert(error.message);
    }
  };

  const ond = (e) => {};

  return (
    <div className="papers" id="cards">
      <div className="nameplate">
        <div className="paperName">
          <p>Paper</p>
        </div>

        <div className="branch">
          <p>Branch</p>
        </div>
        <div className="branch">
          <p>Semester</p>
        </div>

        <div className="download">
          <p>Available</p>
        </div>
      </div>
      {reqPapers.map((element, index) => (
        <div
          className="names"
          key={index}
          onClick={handleDownload}
          data-value={`{"branch": "${element.branch}", "paper": "${element.paper}", "semester": "${element.semester}"}`}
        >
          <div className="paperName">
            <p>{element.paper}</p>
          </div>

          <div className="branch">
            <p>{element.branch}</p>
          </div>
          <div className="branch">
            <p>{element.semester}</p>
          </div>

          <div className="download">
            <button>Download</button>
          </div>
        </div>
      ))}
    </div>
  );
}
