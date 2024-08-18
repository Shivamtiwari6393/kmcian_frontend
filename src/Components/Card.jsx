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
  });

  const [reqPapers, setReqPapers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  //------------ Handle data change-------------------------

  const handleChange = (e) => {
    setError("")
    setPaperData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------paper data fetch request----------------------

  const request = () => {
    // Validating the fields

    if (paperData.course == 0) {
      setError("Please select a Course")
      return;
    }

    if (paperData.branch == 0) {
      setError("Please select a Branch")
      return;
    }

    if (paperData.year == 0) {
     setError("Please select a Year")
      return;
    }

    if (paperData.semester == 0) {
      setError("Please select a Semester")
      return;
    }

    setError("")

    const url = new URL("http://127.0.0.1:8000/api/paper");

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
        setError(error.message)
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loading></Loading>}
      <div id="card">
        <div id="content">
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
      </div>
    </>
  );
}
