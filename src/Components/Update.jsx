/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
export default function Upload() {
  const location = useLocation();
  const { id, branch, course, paper, semester, year, name, downloadable,createdAt, updatedAt } =
    location.state;

  const [uploadData, setUploadData] = useState({
    course: course,
    branch: branch,
    semester: semester,
    paper: paper,
    name: name,
    year: year,
    downloadable: downloadable,
    createdAt: createdAt,
    updatedAt: updatedAt
  });


  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDataChange = (e) => {
    setError("");
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const update = () => {
    setError("");

    const updateData = new FormData();
    updateData.append("course", uploadData.course);
    updateData.append("branch", uploadData.branch);
    updateData.append("paper", uploadData.paper);
    updateData.append("semester", uploadData.semester);
    updateData.append("year", uploadData.year);
    updateData.append("name", uploadData.name);
    updateData.append("downloadable", uploadData.downloadable),
      file && updateData.append("updatedpdf", file);

    setIsLoading(true);

    fetch(`${url}/api/paper/update/${id}`, {
      method: "PUT",
      body: updateData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "An error occurred");
          });
        }

        if (response.status == 200) {
          setError("Congrats! Paper updated Successfully");
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (e) => {
    setIsLoading(true)
    fetch(`${url}/api/paper/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        throw new Error(data.message);
      })
      .catch((e) => {
        setError(e.message);
      }).finally(()=> setIsLoading(false))
  };

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

          <select
            name="downloadable"
            value={uploadData.downloadable}
            onChange={handleDataChange}
          >
            <option value="0" disabled>
              Downloadable
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
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



        <fieldset>
          <legend>CreatedAt</legend>
          <div className="name">
              <p>{uploadData.createdAt}</p>
          </div>
        </fieldset>

        
        <fieldset>
          <legend>UpdatedAt</legend>
          <div className="name">
              <p>{uploadData.updatedAt}</p>
          </div>
        </fieldset>






        <button onClick={update}>Update</button>
        <button
          id="delete-button"
          onClick={handleDelete}
          style={{
            marginTop: "10px",
            backgroundColor: "red",
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}
