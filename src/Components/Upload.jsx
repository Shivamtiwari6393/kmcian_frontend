/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
import pdf from "../assets/pdf.png";
import toast from "react-hot-toast";
import Notice from "./Notice";
import axios from "axios";
import data from "./data.js";

export default function Upload() {
  const [
    yearOptions,
    semesterOptions,
    socialSciencesOptions,
    artHumnanitiesOptions,
    pharmacyBranchOptions,
    scienceBranchOptions,
    legalStudiesBranchOptions,
    commerceBranchOptions,
    engineeringBranchOptions,
    courseOptions,
  ] = data;

  // const url = "http://127.0.0.1:8000/api/paper";
  const url = "https://kmcianbackend.vercel.app/api/paper";

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

  const [fileName, setFileName] = useState("No file chosen");
  const [openSelect, setOpenSelect] = useState(null);

  const [progress, setProgress] = useState(0);

  const handleSelectClick = (event, selectName) => {
    event.stopPropagation();
    setOpenSelect((prev) => (prev === selectName ? null : selectName)); // Toggle open state
  };
  // -----------handle file change-------------

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
    }
  };

  //------------- handle data change-----------

  const handleDataChange = (name, value) => {
    setError("");
    // if (name === "course") setUploadData((prev)=> ({...prev, ["branch"] : ""}))
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    setError("");
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async () => {
    setError("");

    // validating input fields

    if (uploadData.course == 0) {
      setError("Please select a Faculty");
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

    if (uploadData.year == 0) {
      setError("Please select a Year");
      return;
    }

    if (uploadData.paper == "") {
      setError("Please enter a paper name");
      return;
    }

    if (uploadData.paper.length > 50 || uploadData.name > 25) {
      setError("Name length limit exceeded");
      return;
    }

    if (!file) {
      setError("Please select a file");
      return;
    }

    const map = {
      Engineering: engineeringBranchOptions,
      Commerce: commerceBranchOptions,
      "Legal Studies": legalStudiesBranchOptions,
      Science: scienceBranchOptions,
      Pharmacy: pharmacyBranchOptions,
      "Art and Humanities": artHumnanitiesOptions,
      "Social Science": socialSciencesOptions,
    };

    // verify branch in selected faculty branch options

    const exists = map[uploadData.course].some(
      (option) => option.value === uploadData.branch
    );

    // if branch not matches
    if (!exists) {
      setError("Please reselect the branch");
      return;
    }
    //----------- API---------------

    console.log("inside upload");

    //------------------- form data-------------

    const formData = new FormData();
    formData.append("course", uploadData.course);
    formData.append("branch", uploadData.branch);
    formData.append("paper", uploadData.paper);
    formData.append("semester", uploadData.semester);
    formData.append("year", uploadData.year);
    formData.append("name", uploadData.name);
    formData.append("pdf", file);

    //------------- POST DATA---------------

    const loadId = toast.loading("Paper upload in progress...");
    try {
      const response = await axios.post(`${url}/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percentage);
            console.log(`Progress: ${percentage}%`);
          }
        },
        timeout: 10000, // Optional: 10 sec timeout
      });

      if (response.status === 201) {
        toast.success(response.data.message, { id: loadId });
        setProgress(0);
      } else {
        toast.error(response.data.message || "Upload failed", { id: loadId });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.error("Request timed out.", { id: loadId });
      } else if (error.response) {
        toast.error(error.response.data?.message || "Server error", {
          id: loadId,
        });
      } else {
        toast.error("Network error occurred.", { id: loadId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  let branchOptions = [];

  uploadData.course === "Engineering"
    ? (branchOptions = engineeringBranchOptions)
    : "";
  uploadData.course === "Commerce"
    ? (branchOptions = commerceBranchOptions)
    : "";
  uploadData.course === "Legal Studies"
    ? (branchOptions = legalStudiesBranchOptions)
    : "";
  uploadData.course === "Science" ? (branchOptions = scienceBranchOptions) : "";
  uploadData.course === "Pharmacy"
    ? (branchOptions = pharmacyBranchOptions)
    : "";

  uploadData.course === "Social Science"
    ? (branchOptions = socialSciencesOptions)
    : "";

  uploadData.course === "Art and Humanities"
    ? (branchOptions = artHumnanitiesOptions)
    : "";

  // for auto hide the notice
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // ------------------------------------------------------------

  return (
    <>
      {error && <Notice m={error} />}
      {isLoading && <Loading progress={progress}></Loading>}

      <div
        className={uploadcss["upload-container"]}
        onClick={() => setOpenSelect(null)}
      >
        <div className={uploadcss["upload-container-fields"]}>
          <div className={uploadcss["upload-container-header"]}>
            <h3>Upload PYQs</h3>
          </div>
          {/* {error && (
            <div className="error-container">
              <p>{error}</p>{" "}
            </div>
          )} */}

          <CustomSelect
            options={courseOptions}
            isOpen={openSelect === "course"}
            onClick={(event) => handleSelectClick(event, "course")}
            onChange={(value) => handleDataChange("course", value)}
            placeholder="Faculty"
          />
          <CustomSelect
            options={branchOptions}
            isOpen={openSelect === "branch"}
            onClick={(event) => handleSelectClick(event, "branch")}
            onChange={(value) => handleDataChange("branch", value)}
            placeholder="Branch"
            inculudeAll = {true}
          />
          <CustomSelect
            options={semesterOptions}
            isOpen={openSelect === "semester"}
            onClick={(event) => handleSelectClick(event, "semester")}
            onChange={(value) => handleDataChange("semester", value)}
            placeholder="Semester"
            inculudeAll = {true}

          />
          <CustomSelect
            options={yearOptions}
            isOpen={openSelect === "year"}
            onClick={(event) => handleSelectClick(event, "year")}
            onChange={(value) => handleDataChange("year", value)}
            placeholder="Year"
            inculudeAll = {true}
          />

          <div className={uploadcss["name"]}>
            <input
              type="text"
              name="paper"
              placeholder="Paper Name"
              value={uploadData.paper}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={uploadcss["file-container"]}>
            <label htmlFor="file-upload" className={uploadcss["file-label"]}>
              <img src={pdf} alt="pdf" />
              <span id={uploadcss["upload-name"]}>{fileName}</span>
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} />
          </div>
          <div className={uploadcss["name"]}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={uploadData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={uploadcss["upload-button-container"]}>
            <button onClick={upload}>Upload</button>
          </div>
        </div>
      </div>
    </>
  );
}
