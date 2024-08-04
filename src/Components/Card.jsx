/* eslint-disable no-unused-vars */
import { useState } from "react";
import "../Styles/Card.css";

import { saveAs } from "file-saver";

export default function Card() {
  const [paperData, setPaperData] = useState({
    course: 0,
    branch: 0,
    semester: 0,
  });

  const [reqPapers, setReqPapers] = useState(null);

  //------------ Handle data change-------------------------

  const handleChange = (e) => {
    setPaperData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------paper data fetch request----------------------

  const request = () => {
    // Validating the fields

    if (paperData.course == 0) {
      alert("Please select a Course");
      return;
    }

    if (paperData.branch == 0) {
      alert("Please select a Branch");
      return;
    }

    if (paperData.year == 0) {
      alert("Please select a Year");
      return;
    }

    if (paperData.semester == 0) {
      alert("Please select a Semester");
      return;
    }

    const url = new URL("http://127.0.0.1:8000/api/paper");

    // Fetch request

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paperData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "An error occurred");
          });
        }
        return response.json();
      })
      .then((data) => {
        setReqPapers(data);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // ---------------Handle file download----------------------------

  const handleDownload = async (e) => {
    const encodedBranch = encodeURIComponent(paperData.branch);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/paper/download?course=${paperData.course}&branch=${encodedBranch}&semester=${paperData.semester}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "An error occurred");
      }

      const blob = await response.blob();

      const filename = response.headers.get("X-Paper") || "Kmcian_Paper.pdf";

      saveAs(blob, filename);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div id={reqPapers ? "cards" : "card"}>
      {reqPapers ? (
        reqPapers.length === 0 ? (
          <div>
            <p>Sorry no papers found.</p>
          </div>
        ) : (
          <div className="papers">
            {reqPapers.map((element, index) => (
              <div className="names" key={index}>
                <div className="paperName">
                  <p>{element.paper}</p>
                </div>
                {/* <div className="name" key={index}>
                  <p>{element.course}</p>
                </div> */}
                <div className="branch">
                  <p>{element.branch}</p>
                </div>

                <div className="download">
                  <button onClick={handleDownload}>Download</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div id="content">
          <select
            name="course"
            id="course"
            value={paperData.course}
            onChange={handleChange}
            required
          >
            <option value="0" disabled>
              Course
            </option>
            <option value="Engineering">Engineering</option>
            <option value="Managment">Managment</option>
          </select>
          <select
            name="branch"
            id="branch"
            value={paperData.branch}
            onChange={handleChange}
            required
          >
            <option value="0" disabled>
              Branch
            </option>
            {paperData.course == "Engineering" ? (
              <>
                <option value="CSE(AI&ML)">CSE(AI&ML)</option>
                <option value="cse">CSE</option>
                <option value="Bio Technology">Bio Technology</option>
                <option value="Civil">Civil</option>
              </>
            ) : (
              <option value="MBA">MBA</option>
            )}
          </select>

          <select
            name="semester"
            id="semester"
            value={paperData.semester}
            onChange={handleChange}
            required
          >
            <option value="0" disabled>
              Semester
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
          <div id="button">
            <button onClick={request}>Go</button>
          </div>
        </div>
      )}
    </div>
  );
}
