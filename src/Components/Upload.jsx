/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
export default function Upload() {
  //--------------- state for data to be uploaded---------------------
  const [uploadData, setUploadData] = useState({
    course: 0,
    branch: 0,
    semester: 0,
    paper: "",
    name: "",
    year: 0,
  });

  //------------- state for pdf file to be uploaded------------
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  // -----------handle file change-------------

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //------------- handle data change-----------

  const handleDataChange = (e) => {
    setError("");
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = () => {
    setError("");

    // validating input fields

    if (uploadData.course == 0) {
      setError("Please select a Course");
      return;
    }

    if (uploadData.branch == 0) {
      setError("Please select a Branch");
      return;
    }

    if (uploadData.semester == 0) {
      setError("Please select a Semester");
      return;
    }
    if (!file) {
      setError("Please select a file");
      return;
    }

    //----------- API---------------

    // const url = "http://127.0.0.1:8000";
    const url = "https://kmcianbackend.vercel.app";

    //------------------- form data-------------

    const formData = new FormData();
    formData.append("course", uploadData.course);
    formData.append("branch", uploadData.branch);
    formData.append("paper", uploadData.paper);
    formData.append("semester", uploadData.semester);
    formData.append("year", uploadData.year);
    formData.append("name", uploadData.name);
    formData.append("pdf", file);

    setIsLoading(true);

    //------------- POST DATA---------------

    fetch(`${url}/api/paper/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "An error occurred");
          });
        }

        if (response.status == 201) {
          setError("Congrats! Paper uploaded Successfully");
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setIsLoading(false));
  };

  // ------------------------------------------------------------

  return (
    <>
      {isLoading && <Loading></Loading>}

      <div className={uploadcss["upload"]}>
        {error && (
          <div className="error-container">
            <p>{error}</p>{" "}
          </div>
        )}
        <div className={uploadcss["content"]}>
          <select
            name="course"
            value={uploadData.course}
            onChange={handleDataChange}
          >
            <option value="0" disabled>
              Course
            </option>
            <option value="Engineering">Engineering</option>
            <option value="Commerce">Commerce</option>
            <option value="Legal Studies">Legal Studies</option>
          </select>
          <select
            name="branch"
            value={uploadData.branch}
            onChange={handleDataChange}
          >
            <option value="0" disabled>
              Branch
            </option>
            {uploadData.course === "Commerce" && (
              <>
                <option value="MBA">MBA</option>
                <option value="MBA FA">MBA (FA)</option>
                <option value="BBA">BBA</option>
                <option value="B COM">B.COM</option>
                <option value="B COM TT">B.COM (TT)</option>
                <option value="M COM">M.COM</option>
              </>
            )}

            {uploadData.course === "Engineering" && (
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

            {uploadData.course === "Legal Studies" && (
              <>
                <option value="LLM">LLM</option>
                <option value="BA LLB">BA LLB</option>
                <option value="LLB">LLB</option>
              </>
            )}
          </select>

          <select
            name="semester"
            value={uploadData.semester}
            onChange={handleDataChange}
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
            {uploadData.branch == "BA LLB" && (
              <>
                <option value="7">9</option>
                <option value="8">10</option>
              </>
            )}
          </select>

          <select
            name="year"
            value={uploadData.year}
            onChange={handleDataChange}
          >
            <option value="0" disabled>
              Paper-Year
            </option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <fieldset>
          <legend>Paper Name</legend>
          <div className="name">
            <input
              type="text"
              name="paper"
              placeholder="Enter Paper Name"
              value={uploadData.paper}
              onChange={handleDataChange}
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>File*</legend>
          <div className="file">
            <input
              type="file"
              name="pdf"
              className={uploadcss["inputfile"]}
              onChange={handleFileChange}
              accept=".pdf"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>Name</legend>
          <div className="name">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={uploadData.name}
              onChange={handleDataChange}
              required
            />
          </div>
        </fieldset>

        <button onClick={upload}>Upload</button>
      </div>
    </>
  );
}
