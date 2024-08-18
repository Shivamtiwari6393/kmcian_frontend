/* eslint-disable no-unused-vars */
import "../Styles/Papers.css";
import { saveAs } from "file-saver";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import { useState } from "react";

export default function Papers() {
  const location = useLocation();
  const reqPapers = location.state;

  const [isLoading,setIsLoading] = useState(false)


  // ---------------Handle file download----------------------------

  const handleDownload = async (e) => {
    const selectedPaper = JSON.parse(e.currentTarget.dataset.value);

    const encodedBranch = encodeURIComponent(selectedPaper.branch);
 

    setIsLoading(true)
  
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
    finally{
      setIsLoading(false)
    }


  };

  const ond = (e) => {};

  return (
    <div className="papers" id="cards">
         {isLoading &&  <Loading></Loading>}

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
