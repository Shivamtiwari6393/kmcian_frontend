/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import "../Styles/Card.css";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
import "../Styles/CustomSelect.css";
import toast from "react-hot-toast";
import adminContext from "./adminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import data from "./data.js";

export default function Card() {
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

    // const url = "http://10.125.107.27:8000/api/paper";


  const [isAdmin, setIsAdmin] = useContext(adminContext);

  const [openSelect, setOpenSelect] = useState(null);

  const navigate = useNavigate();

  const [paperData, setPaperData] = useState({
    course: 0,
    branch: 0,
    semester: 0,
    year: 0,
    downloadable: true,
  });

  // const [reqPapers, setReqPapers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const [error, setError] = useState("");

  const handleSelectClick = (selectName, e) => {
    e.stopPropagation();
    setOpenSelect((prev) => (prev === selectName ? null : selectName)); // Toggle open state
  };

  //------------ Handle data change-------------------------

  const handleChange = (name, value) => {
    // setError("");
    setPaperData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // when admin changes downloadable state

  const handleAdminChange = (e) => {
    // setError("");
    setPaperData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------paper data fetch request----------------------

  const validate = () => {
    if (!paperData.course) return "Please select a Faculty";
    if (!paperData.branch) return "Please select a Branch";
    if (!paperData.semester) return "Please select a Semester";
    if (!paperData.year) return "Please select a Year";
  };

  const request = async () => {
    // Validating the fields
    const err = validate();
    if (err) return toast.error(err);
    // setError("");

    // Fetch request
    setIsLoading(true);
    const loadId = toast.loading("Searching... 🔎");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paperData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setIsLoading(false);
      toast.success("Search completed", { id: loadId });
      // setReqPapers(data);
      navigate("/papers", { state: data });
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message, { id: loadId });
    }
  };

  let branchOptions = [{ value: "All", label: "All" }];

  paperData.course === "Engineering"
    ? (branchOptions = engineeringBranchOptions)
    : "";
  paperData.course === "Commerce"
    ? (branchOptions = commerceBranchOptions)
    : "";
  paperData.course === "Legal Studies"
    ? (branchOptions = legalStudiesBranchOptions)
    : "";
  paperData.course === "Science" ? (branchOptions = scienceBranchOptions) : "";
  paperData.course === "Pharmacy"
    ? (branchOptions = pharmacyBranchOptions)
    : "";
  paperData.course === "Social Science"
    ? (branchOptions = socialSciencesOptions)
    : "";

  paperData.course === "Art and Humanities"
    ? (branchOptions = artHumnanitiesOptions)
    : "";
  return (
    <>
      {/* {isLoading && <Loading></Loading>} */}
      <div className="card-container" onClick={(e) => setOpenSelect(null)}>
        <div className="card-fields">
          <div className="card-header">
            <h3>Search PYQs</h3>
          </div>
          {/* {error && (
            <div className="error-container">
              <p>{error}</p>
            </div>
          )} */}

          <CustomSelect
            options={courseOptions}
            isOpen={openSelect === "course"}
            onClick={(e) => handleSelectClick("course", e)}
            onChange={(value) => handleChange("course", value)}
            placeholder="Faculty"
          />
          <CustomSelect
            options={branchOptions}
            isOpen={openSelect === "branch"}
            onClick={(e) => handleSelectClick("branch", e)}
            onChange={(value) => handleChange("branch", value)}
            placeholder="Branch"
          />
          <CustomSelect
            options={semesterOptions}
            isOpen={openSelect === "semester"}
            onClick={(e) => handleSelectClick("semester", e)}
            onChange={(value) => handleChange("semester", value)}
            placeholder="Semester"
          />
          <CustomSelect
            options={yearOptions}
            isOpen={openSelect === "year"}
            onClick={(e) => handleSelectClick("year", e)}
            onChange={(value) => handleChange("year", value)}
            placeholder="Year"
          />

          {isAdmin && (
            <select
              name="downloadable"
              value={paperData.downloadable}
              id="downloadable-select"
              onChange={handleAdminChange}
              required
            >
              <option value="0" disabled>
                Downloadable
              </option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}

          <button disabled={isLoading} className="search-button-container">
            <FontAwesomeIcon
              icon={faSearch}
              style={{ color: "#ffffff", scale: "1.9" }}
              onClick={request}
            />
          </button>
        </div>
      </div>
    </>
  );
}
