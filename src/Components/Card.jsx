/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import "../Styles/Card.css";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
import "../Styles/CustomSelect.css";

import searchIcon from "../assets/search.png";
import toast from "react-hot-toast";
import adminContext from "./adminContext";

export default function Card() {
  // const url = "http://127.0.0.1:8000/api/paper";
  const url = "https://kmcianbackend.vercel.app/api/paper";

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

  const [error, setError] = useState("");

  const handleSelectClick = (selectName) => {
    setOpenSelect((prev) => (prev === selectName ? null : selectName)); // Toggle open state
  };

  // if user is admin
  useEffect(() => {
    if (isAdmin)
      document.getElementById("downloadable-select").style.display = "block";
  });

  // =============================================

  //------------ Handle data change-------------------------

  const handleChange = (name, value) => {
    setError("");
    setPaperData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // when admin changes downloadable state

  const handleAdminChange = (e) => {
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
      setError("Please select a Faculty");
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

    // Fetch request
    setIsLoading(true);
    const loadId = toast.loading("fetching papers info...")

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paperData),
    })
      .then(async(response) => {
        const data = await response.json()
        if(!response.ok) throw new Error(data.message);
        setIsLoading(false);
        toast.success("fetching completed", {id: loadId})
        // setReqPapers(data);
        navigate("/papers", { state: data });
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message, {id: loadId});
      });
  };

  // Options for select inputs
  const courseOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Commerce", label: "Commerce" },
    { value: "Legal Studies", label: "Legal Studies" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "Art and Humanities", label: "Arts & Humanities" },
    { value: "Pharmacy", label: "Pharmacy" },
  ];

  // branch options

  const engineeringBranchOptions = [
    { value: "All", label: "All" },
    { value: "CSE(AI&ML)", label: "CSE(AI&ML)" },
    { value: "CSE(AI&DS)", label: "CSE(AI&DS)" },
    { value: "CSE", label: "CSE" },
    { value: "BIO TECHNOLOGY", label: "Bio Technology" },
    { value: "CIVIL", label: "Civil" },
    { value: "MACHANICAL", label: "Machanical" },
    { value: "M.Tech - CSE(AI&ML)", label: "M.Tech - CSE(AI&ML)" },
  ];

  const commerceBranchOptions = [
    { value: "All", label: "All" },
    { value: "BBA", label: "BBA" },
    { value: "MBA", label: "MBA" },
    { value: "MBA FA", label: "MBA(FA)" },
    { value: "B.COM", label: "B.COM" },
    { value: "B.COM(TT)", label: "B.COM(TT)" },
    { value: "M.COM", label: "M.COM" },
  ];

  const legalStudiesBranchOptions = [
    { value: "All", label: "All" },
    { value: "LLM", label: "LLM" },
    { value: "BA LLB", label: "BA LLB" },
    { value: "LLB", label: "LLB" },
  ];

  // science options

  const scienceBranchOptions = [
    { value: "All", label: "All" },
    { value: "MCA", label: "MCA" },
    { value: "BCA", label: "BCA" },
    { value: "BSc PHYSICS", label: "B.Sc Physics" },
    { value: "BSc CHEMISTRY", label: "B.Sc Chemistry" },
    { value: "BSc MATHEMATICS", label: "B.Sc Mathematics" },
    { value: "BSc CS", label: "B.Sc Computer Science" },
    { value: "BSc BIOTECHNOLOGY", label: "B.Sc Biotechnology" },
    { value: "BSc ZOOLOGY", label: "B.Sc Zoology" },
    { value: "BSc BOTANY", label: "B.Sc Botany" },
    { value: "BSc MICROBIOLOGY", label: "B.Sc Microbiology" },
    { value: "BSc STATISTICS", label: "B.Sc Statistics" },
    { value: "BSc HomeScience", label: "B.Sc Home Science" },
    { value: "BSc English", label: "B.Sc English" },
    { value: "BA HM", label: "BA Home Science" },
    { value: "MA HM", label: "MA Home Science" },
    { value: "B LIB", label: "B.lib." },
  ];

  // pharmacy options

  const pharmacyBranchOptions = [
    { value: "All", label: "All" },
    { value: "B PHARM", label: "B.Pharm" },
    { value: "D PHARM", label: "D.Pharm" },
  ];

  // arts and humanities options

  const artHumnanitiesOptions = [
    { value: "All", label: "All" },
    { value: "MA ARABIC", label: "MA ARABIC" },
    { value: "MA ENGLISH", label: "MA ENGLISH" },
    { value: "MA HINDI", label: "MA HINDI" },
    { value: "MA PERSIAN", label: "MA PERSIAN" },
    { value: "MA URDU", label: "MA URDU" },
    { value: "BA ARABIC", label: "BA ARABIC" },
    { value: "BA ENGLISH", label: "BA ENGLISH" },
    { value: "BA HINDI", label: "BA HINDI" },
    { value: "BA PERSIAN", label: "BA PERSIAN" },
    { value: "BA URDU", label: "BA URDU" },
    { value: "BA FRENCH", label: "BA FRENCH" },
    { value: "BA CHINESE", label: "BA CHINESE" },
    { value: "BA GERMAN", label: "BA GERMAN" },
    { value: "BA JAPANESE", label: "BA JAPANESE" },
    { value: "BA SANSKRIT", label: "BA SANSKRIT" },
    { value: "BA PALI", label: "BA PALI" },
  ];

  const socialSciencesOptins = [
    { value: "All", label: "All" },
    { value: "B ED", label: "B.ED" },
    { value: "MA EDUCATION", label: "MA EDUCATION" },
    { value: "MA JOURN_MASS_COMM", label: "MA JOURN MASS COMM" },
    { value: "MA HISTORY", label: "MA HISTORY" },
    { value: "MA GEOGRAPHY", label: "MA GEOGRAPHY" },
    { value: "MA ECONOMICS", label: "MA ECONOMICS" },
    { value: "MA FINE ARTS", label: "MA FINE ARTS" },
    { value: "BA EDUCATION", label: "BA EDUCATION" },
    { value: "BA HISTORY", label: "BA HISTORY" },
    { value: "BA GEOGRAPHY", label: "BA GEOGRAPHY" },
    { value: "BA ECONOMICS", label: "BA ECONOMICS" },
    { value: "BA FINE ARTS", label: "BA FINE ARTS" },
    { value: "BA POL SCIENCE", label: "BA POL SCIENCE" },
    { value: "BA PHYSICAL EDU", label: "BA PHYSICAL EDU" },
    { value: "BA JOURN_MASS_COMM", label: "BA JOURN MASS COMM" },
    { value: "BA SOCIOLOGY", label: "BA SOCIOLOGY" },
  ];

  // semester options

  const semesterOptions = [
    { value: "All", label: "All" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
  ];

  const yearOptions = [
    { value: "All", label: "All" },
    // { value: "2019", label: "2019" },
    // { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

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
    ? (branchOptions = socialSciencesOptins)
    : "";

  paperData.course === "Art and Humanities"
    ? (branchOptions = artHumnanitiesOptions)
    : "";
  return (
    <>
      {isLoading && <Loading></Loading>}
      <div className="card-container">
        <div className="card-fields">
          {error && (
            <div className="error-container">
              <p>{error}</p>
            </div>
          )}

          <CustomSelect
            options={courseOptions}
            isOpen={openSelect === "course"}
            onClick={() => handleSelectClick("course")}
            onChange={(value) => handleChange("course", value)}
            placeholder="Faculty"
          />
          <CustomSelect
            options={branchOptions}
            isOpen={openSelect === "branch"}
            onClick={() => handleSelectClick("branch")}
            onChange={(value) => handleChange("branch", value)}
            placeholder="Branch"
          />
          <CustomSelect
            options={semesterOptions}
            isOpen={openSelect === "semester"}
            onClick={() => handleSelectClick("semester")}
            onChange={(value) => handleChange("semester", value)}
            placeholder="Semester"
          />
          <CustomSelect
            options={yearOptions}
            isOpen={openSelect === "year"}
            onClick={() => handleSelectClick("year")}
            onChange={(value) => handleChange("year", value)}
            placeholder="Year"
          />
          <select
            name="downloadable"
            value={paperData.downloadable}
            id="downloadable-select"
            onChange={handleAdminChange}
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

          <div id="search-button-container">
            <img src={searchIcon} alt="Go" onClick={request} />
          </div>
        </div>
      </div>
    </>
  );
}
