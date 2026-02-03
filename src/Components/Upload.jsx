/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import CustomSelect from "./CustomSelect";
import pdf from "../assets/pdf.png";
import toast from "react-hot-toast";
import axios from "axios";
import data from "./data.js";
import adminContext from "./adminContext.jsx";

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

  // const url = "http://127.0.0.1:8000/api/paper/v2";
  const url = "https://kmcianbackend.vercel.app/api/paper/v2";

  //--------------- state for data to be uploaded---------------------

  //------------- state for pdf file to be uploaded------------
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [openSelect, setOpenSelect] = useState(null);
  const [user] = useContext(adminContext);

  const [progress, setProgress] = useState(1);

  const [uploadData, setUploadData] = useState({
    course: 0,
    branch: 0,
    semester: 0,
    paper: "",
    name: user ? user.username : "",
    year: 0,
  });

  const branchMap = {
    Engineering: engineeringBranchOptions,
    Commerce: commerceBranchOptions,
    "Legal Studies": legalStudiesBranchOptions,
    Science: scienceBranchOptions,
    Pharmacy: pharmacyBranchOptions,
    "Art and Humanities": artHumnanitiesOptions,
    "Social Science": socialSciencesOptions,
  };

  const handleSelectClick = (event, selectName) => {
    event.stopPropagation();
    setOpenSelect((prev) => (prev === selectName ? null : selectName));
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
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const branchOptions = branchMap[uploadData.course] || [];

  const validateFields = () => {
    if (!uploadData.course) return "Please select a Faculty";
    if (!uploadData.branch) return "Please select a Branch";
    if (!uploadData.semester) return "Please select a Semester";
    if (!uploadData.year) return "Please select a Year";
    if (!uploadData.paper) return "Please enter a paper name";
    if (uploadData.paper.length > 50 || uploadData.name.length > 25)
      return "Name length limit exceeded";
    if (!file) return "Please select a file";
    if (file && file.type !== "application/pdf")
      return "Please upload a PDF only";
    if (file && file.size > 4 * 1024 * 1024)
      return "File size must be under 4MB";
    return null;
  };

  const upload = async () => {
    const err = validateFields();
    if (err) return toast.error(err);

    // verify branch in selected faculty branch options

    const exists = branchMap[uploadData.course].some(
      (option) => option.value === uploadData.branch,
    );

    // if branch not matches
    if (!exists) {
      toast.error("Please reselect the branch");
      return;
    }

    //------------------- form data-------------    
    const formData = new FormData();
    formData.append("course", uploadData.course);
    formData.append("branch", uploadData.branch);
    formData.append("paper", uploadData.paper);
    formData.append("semester", uploadData.semester);
    formData.append("year", uploadData.year);
    formData.append("name", uploadData.name);
    formData.append("pdf", file);
    if (user.userId) formData.append("userId", user.userId);
    if (user.email) formData.append("email", user.email);

    //------------- POST DATA---------------

    const loadId = toast.loading("Uploading... 1%");
    try {
      setIsUploading(true);
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            toast.loading(`Uploading... ${percentage}%`, { id: loadId });
            setProgress(percentage);
          }
        },
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
      setIsUploading(false);
    }
  };

  // ------------------------------------------------------------

  return (
    <>
      <div
        className={uploadcss["upload-container"]}
        onClick={() => setOpenSelect(null)}
      >
        <div className={uploadcss["upload-container-fields"]}>
          <div className={uploadcss["upload-container-header"]}>
            <h3>Upload PYQs</h3>
          </div>
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
            inculudeAll={true}
          />
          <CustomSelect
            options={semesterOptions}
            isOpen={openSelect === "semester"}
            onClick={(event) => handleSelectClick(event, "semester")}
            onChange={(value) => handleDataChange("semester", value)}
            placeholder="Semester"
            inculudeAll={true}
          />
          <CustomSelect
            options={yearOptions}
            isOpen={openSelect === "year"}
            onClick={(event) => handleSelectClick(event, "year")}
            onChange={(value) => handleDataChange("year", value)}
            placeholder="Year"
            inculudeAll={true}
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
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              multiple={false}
              accept="application/pdf"
            />
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

          <div
            className={uploadcss["upload-button-container"]}
            onClick={upload}
          >
            <button disabled={isUploading}>
              {isUploading ? `${progress}%` : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
