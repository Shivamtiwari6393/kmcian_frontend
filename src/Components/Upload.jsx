/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
export default function Upload() {
  const [uploadData, setUploadData] = useState({
    course: 0,
    branch: 0,
    semester: 0,
    paper: "",
  });

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDataChange = (e) => {
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };



  const upload = () => {
    if (uploadData.course == 0) {
      alert("Please select a Course");
      return;
    }

    if (uploadData.branch == 0) {
      alert("Please select a Branch");
      return;
    }

    if (uploadData.semester == 0) {
      alert("Please select a Semester");
      return;
    }
    if (!file) {
      alert("Please select a file");
      return;
    }

    const url = new URL("http://127.0.0.1:8000/api/paper/upload");

    const formData = new FormData();
    formData.append("course", uploadData.course);
    formData.append("branch", uploadData.branch);
    formData.append("paper", uploadData.paper);
    formData.append("semester", uploadData.semester);
    formData.append("pdf", file);

    console.log(upload.course, uploadData.branch,uploadData.paper, uploadData.semester, file);
    

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        if (res.status == 201) {
          alert("Congrats! File uploaded Successfully");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUploadData(data);
      })
      .catch((e) => {
        alert(`${e}! Check your internet connection`);
      });
  };

  return (
    <div className={uploadcss["upload"]}>
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
          <option value="Managment">Managment</option>
        </select>
        <select
          name="branch"
          value={uploadData.branch}
          onChange={handleDataChange}
        >
          <option value="0" disabled>
            Branch
          </option>
          {uploadData.course == "Engineering" ? (
            <>
              <option value="CSE(AI&ML)">CSE(AI&ML)</option>
              <option value="CSE">CSE</option>
              <option value="Bio technology">Bio technology</option>
              <option value="Civil">Civil</option>
            </>
          ) : (
            <option value="MBA">MBA</option>
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
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>File</legend>
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
          <input type="text" name="name" placeholder="Enter Your Name" />
        </div>
      </fieldset>

      <button onClick={upload}>Upload</button>
    </div>
  );
}
