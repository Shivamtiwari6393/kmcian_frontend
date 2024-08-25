/* eslint-disable no-unused-vars */
import { useState } from "react";
import "../Styles/Card.css";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Card() {
  const navigate = useNavigate();

  

  const [paperData, setPaperData] = useState({
    course: 0,
    branch: 0,
    semester: 0,
    year: 0,
    downloadable: true,
  });

  const [reqPapers, setReqPapers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  //------------ Handle data change-------------------------

  const handleChange = (e) => {
    setError("");
    setPaperData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------paper data fetch request----------------------

  const request = () => {

    // Validating the fields

    if (paperData.course == 0) {
      setError("Please select a Course");
      return;
    }
    if (paperData.branch == 0) {
      setError("Please select a Branch");
      return;
    }
    if (paperData.semester == 0) {
      setError("Please select a Semester");
      return;
    }
    if (paperData.year == 0) {
      setError("Please select a Year");
      return;
    }
    setError("");

    // const url = "http://127.0.0.1:8000/api/paper";
    const url = "https://kmcianbackend.vercel.app/api/paper";

    // Fetch request
    setIsLoading(true);
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
        navigate("/papers", { state: data });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const verify = (e) => {
    var value = prompt("Admin Password");

    async function hashMessage(message) {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      return bufferToHex(hashBuffer);
    }

    function bufferToHex(buffer) {
      return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }

    hashMessage(value).then((hash) => {
      if (
        hash ===
        "fb1b3fb33e5cdb92d8a068de9dd4847e82e24641567a857a35bd28f2487e03ee"
      ) {
        const elements = (document.getElementById(
          "downloadable"
        ).style.display = "block");
      }
    });
  };

  return (
    <>
      {isLoading && <Loading></Loading>}
      <div id="card">
        <div id="content" onDoubleClick={verify}>
          {error && (
            <div className="error-container">
              <p>{error}</p>
            </div>
          )}

          <select
            name="course"
            id="course"
            value={paperData.course}
            onChange={handleChange}
            required
          >
            <option value="0" disabled>
              Faculty
            </option>
            <option value="Engineering">Engineering</option>
            <option value="Commerce">Commerce</option>
            <option value="Legal Studies">Legal Studies</option>
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
            <option value="All">All</option>

            {paperData.course === "Managment" && (
              <>
                <option value="MBA">MBA</option>
                <option value="MBA FA">MBA (FA)</option>
                <option value="BBA">BBA</option>
                <option value="B COM">B.COM</option>
                <option value="B COM TT">B.COM (TT)</option>
                <option value="M COM">M.COM</option>
              </>
            )}

            {paperData.course === "Engineering" && (
              <>
                <option value="CSE(AI&ML)">CSE(AI&ML)</option>
                <option value="CSE(AI&DS)">CSE(AI&DS)</option>
                <option value="CSE">CSE</option>
                <option value="Bio Technology">Bio Technology</option>
                <option value="Machanical">Machanical</option>
                <option value="Civil">Civil</option>
                <option value="Mtech CSE(AI&ML)">M.Tech: CSE(AI&ML)</option>
                <option value="Mtech Mechatronics">M.Tech: Mechatronics</option>
              </>
            )}

            {paperData.course === "Legal Studies" && (
              <>
                <option value="LLM">LLM</option>
                <option value="BA LLB">BA LLB</option>
                <option value="LLB">LLB</option>
              </>
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
            <option value="All">All</option>

            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            {paperData.branch == "BA LLB" && (
              <>
                <option value="7">9</option>
                <option value="8">10</option>
              </>
            )}
          </select>
          <select
            name="year"
            id="semester"
            value={paperData.year}
            onChange={handleChange}
            required
          >
            <option value="0" disabled>
              Year
            </option>
            <option value="All">All</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <select
            name="downloadable"
            id="downloadable"
            value={paperData.downloadable}
            onChange={handleChange}
            required
            style={{
              display: "none",
            }}
          >
            <option value="0" disabled>
              Downloadable
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>

          <div id="button">
            <button onClick={request}>Go</button>
          </div>
        </div>
      </div>
    </>
  );
}
