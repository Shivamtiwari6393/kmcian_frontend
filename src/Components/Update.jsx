/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import pdf from "../assets/pdf.png";
import CustomSelect from "./CustomSelect";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import data from "./data.js";

export default function Upload() {
  const [
    yearOptions,
    semesterOptions,
    socialSciencesOptins,
    artHumnanitiesOptions,
    pharmacyBranchOptions,
    scienceBranchOptions,
    legalStudiesBranchOptions,
    commerceBranchOptions,
    engineeringBranchOptions,
    courseOptions,
  ] = data;

  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const location = useLocation();
  const {
    _id,
    branch,
    course,
    paper,
    semester,
    year,
    name,
    email,
    downloadable,
    createdAt,
    updatedAt,
  } = location.state;

  const [updateData, setUpdateData] = useState({
    course: course,
    branch: branch,
    semester: semester,
    paper: paper,
    name: name,
    year: year,
    downloadable: downloadable,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });

  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [openSelect, setOpenSelect] = useState(null);

  const handleSelectClick = (selectName) => {
    setOpenSelect((prev) => (prev === selectName ? null : selectName));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
    }
  };

  const handleInputChange = (e) => {
    setError("");
    setUpdateData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDataChange = (name, value) => {
    setError("");
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------announcement submit----------------------------

  const handleAnnouncementSubmit = async (
    e,
    announcementText = `Paper - ${updateData.paper} | Branch - ${updateData.branch} | Semester - ${updateData.semester} | Year - ${updateData.year} | has been uploaded by ${updateData.name}`,
  ) => {
    // setLoading(true);
    const loadId = toast.loading("Announcement upload in progress...");

    try {
      console.log("annougfvujdycgskducgsdkldcih", announcementText);

      const response = await fetch(`${url}/api/announcement`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        },
        body: announcementText,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      // setAnnouncements((prev) => [data.data, ...prev]);
      toast.success(data.message, { id: loadId });
    } catch (error) {
      toast.error(error.message, { id: loadId });
    } finally {
      // setLoading(false);
    }
  };

  //---------------------- Update Paper-----------------------------

  const update = () => {
    setError("");

    //wrapping the data into form data

    const updatedData = new FormData();
    updatedData.append("course", updateData.course);
    updatedData.append("branch", updateData.branch);
    updatedData.append("paper", updateData.paper);
    updatedData.append("semester", updateData.semester);
    updatedData.append("year", updateData.year);
    updatedData.append("name", updateData.name);
    (updatedData.append("downloadable", updateData.downloadable),
      file && updatedData.append("pdf", file));
    updatedData.append("email", email);

    //  if user changed the faculty

    if (
      updateData.course != location.state.course ||
      updateData.branch != location.state.branch
    ) {
      const update = confirm(
        "You have changed the faculty or branch. Paper can be created only.",
      );

      if (!update) return;

      const map = {
        Engineering: engineeringBranchOptions,
        Commerce: commerceBranchOptions,
        "Legal Studies": legalStudiesBranchOptions,
        Science: scienceBranchOptions,
        Pharmacy: pharmacyBranchOptions,
        "Art and Humanities": artHumnanitiesOptions,
      };

      // verify branch in selected faculty branch options

      const exists = map[updateData.course].some(
        (option) => option.value === updateData.branch,
      );
      // if branch not matches
      if (!exists) {
        toast.custom(
          <div
            style={{
              padding: "10px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Please reselect the branch
          </div>,
        );
        setError("Please reselect the branch");
        return;
      }

      // if file not selected

      if (!file) {
        setError("Please select a file");
        return;
      }

      //================ upload paper if user changed the faculty=====================

      setIsLoading(true);

      const loadId = toast.loading("Paper upload in progress...");

      fetch(`${url}/api/paper/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        },
        body: updatedData,
      })
        .then(async (response) => {
          setIsLoading(false);

          const data = response.json();
          if (!response.ok)
            throw new Error(data.message || "An error occurred");
          toast.success(data.message, { id: loadId });
        })
        .catch((e) => {
          setIsLoading(false);
          setError(e.message);
          toast.error(e.message, { id: loadId });
        });
      return;
    }

    //==================================== update ===================================

    setIsLoading(true);

    const loadId = toast.loading("Paper update in progress...");
    fetch(`${url}/api/paper/update/${_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
      },
      body: updatedData,
    })
      .then(async (response) => {
        setIsLoading(false);
        const data = await response.json();
        // if there is an error
        if (!response.ok) throw new Error(data.message || "An error occurred");
        //  if response is ok
        toast.success(data.message, { id: loadId });
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
        toast.error(e.message, { id: loadId });
      });
  };

  //=========================== Delete Paper=====================================

  const handleDelete = (e) => {
    const del = confirm("Delete?");
    if (!del) return;
    setIsLoading(true);
    const loadId = toast.loading("Deletion in progress...");
    fetch(`${url}/api/paper/delete/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
      },
    })
      .then(async (res) => {
        setIsLoading(false);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "An error occurred");
        toast.success(data.message, { id: loadId });
        return;
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.message, { id: loadId });
        setError(e.message);
      });
  };

  let branchOptions = [];

  updateData.course === "Engineering"
    ? (branchOptions = engineeringBranchOptions)
    : "";
  updateData.course === "Commerce"
    ? (branchOptions = commerceBranchOptions)
    : "";
  updateData.course === "Legal Studies"
    ? (branchOptions = legalStudiesBranchOptions)
    : "";
  updateData.course === "Science" ? (branchOptions = scienceBranchOptions) : "";
  updateData.course === "Pharmacy"
    ? (branchOptions = pharmacyBranchOptions)
    : "";

  updateData.course === "Social Science"
    ? (branchOptions = socialSciencesOptins)
    : "";

  updateData.course === "Art and Humanities"
    ? (branchOptions = artHumnanitiesOptions)
    : "";

  return (
    <>
      {isLoading && <Loading></Loading>}

      <div className={uploadcss["upload-container"]}>
        {error && (
          <div className="error-container">
            <p>{error}</p>{" "}
          </div>
        )}
        <div className={uploadcss["select-downloadable"]}>
          <select
            name="downloadable"
            value={updateData.downloadable}
            onChange={handleInputChange}
            style={{
              padding: "4px",
              border: "none",
              borderRadius: "5px",
              width: "60vw",
              maxWidth: "250px",
              textAlign: "center",
            }}
          >
            <option value="0" disabled>
              Downloadable
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        {/* {console.log(updateData.course)} */}
        <CustomSelect
          options={courseOptions}
          isOpen={openSelect === "course"}
          onClick={() => handleSelectClick("course")}
          onChange={(value) => handleDataChange("course", value)}
          placeholder={updateData.course}
        />

        <CustomSelect
          options={branchOptions}
          isOpen={openSelect === "branch"}
          onClick={() => handleSelectClick("branch")}
          onChange={(value) => handleDataChange("branch", value)}
          placeholder={updateData.branch}
          inculudeAll={true}
        />
        <CustomSelect
          options={semesterOptions}
          isOpen={openSelect === "semester"}
          onClick={() => handleSelectClick("semester")}
          onChange={(value) => handleDataChange("semester", value)}
          placeholder={updateData.semester}
          inculudeAll={true}
        />
        <CustomSelect
          options={yearOptions}
          isOpen={openSelect === "year"}
          onClick={() => handleSelectClick("year")}
          onChange={(value) => handleDataChange("year", value)}
          placeholder={updateData.year}
          inculudeAll={true}
        />

        <div className={uploadcss["name"]}>
          <input
            type="text"
            name="paper"
            placeholder="Enter Paper Name"
            value={updateData.paper}
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
            placeholder="Enter Your Name"
            value={updateData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={uploadcss["time-stamp"]}>
          <p> C: {new Date(updateData.createdAt).toLocaleString()}</p>
        </div>

        <div className={uploadcss["time-stamp"]}>
          <p>U: {new Date(updateData.updatedAt).toLocaleString()}</p>
        </div>

        <button id={uploadcss["update-button"]} onClick={update}>
          Update
        </button>

        <div className={uploadcss["delete-button-container"]}>
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "red" }}
            onClick={handleDelete}
          ></FontAwesomeIcon>
        </div>

        <div className={uploadcss["announcement-container"]}>
          <input
            type="text"
            value={`Paper - ${updateData.paper} | Branch - ${updateData.branch} | Semester - ${updateData.semester} | Year - ${updateData.year} | has been uploaded by ${updateData.name}`}
          />

          <div className={uploadcss["announcement-button-container"]}>
            <button onClick={handleAnnouncementSubmit}>Do Announcement</button>
          </div>
        </div>
      </div>
    </>
  );
}
