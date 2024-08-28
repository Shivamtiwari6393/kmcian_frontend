/* eslint-disable no-unused-vars */
import { useState } from "react";
import "../Styles/Card.css";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
import "../Styles/CustomSelect.css";

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

  const handleChange = (name, value) => {
    setError("");
    setPaperData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdminChange = (e)=>{
    setError("");
    setPaperData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

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

  // Options for select inputs
  const courseOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Commerce", label: "Commerce" },
    { value: "Legal Studies", label: "Legal Studies" },
    { value: "Science", label: "Science" },
    // { value: "Social Science", label: "Social Science" },
    // { value: "Art and Humanities", label: "Arts & Humanities" },
    { value: "Pharmacy", label: "Pharmacy" },
  ];

  const engineeringBranchOptions = [
    { value: "All", label: "All" },
    { value: "CSE(AI&ML)", label: "CSE(AI&ML)" },
    { value: "CSE(AI&DS)", label: "CSE(AI&DS)" },
    { value: "CSE", label: "CSE" },
    { value: "BIO_TECHNOLOGY", label: "Bio Technology" },
    { value: "CIVIL", label: "Civil" },
    { value: "MACHANICAL", label: "Machanical" },
    { value: "M_TECH_CSE(AI&ML)", label: "M.Tech - CSE(AI&ML)" },
  ];

  const commerceBranchOptions = [
    { value: "All", label: "All" },
    { value: "BBA", label: "BBA" },
    { value: "MBA", label: "MBA" },
    { value: "MBA_FA", label: "MBA(FA)" },
    { value: "B_COM", label: "B.COM" },
    { value: "B_COM_TT", label: "B.COM(TT)" },
    { value: "M_COM", label: "M.COM" },
  ];

  const legalStudiesBranchOptions = [
    { value: "All", label: "All" },
    { value: "LLM", label: "LLM" },
    { value: "BA_LLB", label: "BA LLB" },
    { value: "LLB", label: "LLB" },
  ];

  // science options

  const scienceBranchOptions = [
    { value: "All", label: "All" },
    { value: "MCA", label: "MCA" },
    { value: "BCA", label: "BCA" },
    { value: "BSc_PHYSICS", label: "B.Sc Physics" },
    { value: "BSc_CHEMISTRY", label: "B.Sc Chemistry" },
    { value: "BSc_MATHEMATICS", label: "B.Sc Mathematics" },
    { value: "BSc_CS", label: "B.Sc Computer Science" },
    { value: "BSc_BIOTECHNOLOGY", label: "B.Sc Biotechnology" },
    { value: "BSc_ZOOLOGY", label: "B.Sc Zoology" },
    { value: "BSc_BOTANY", label: "B.Sc Botany" },
    { value: "BSc_MICROBIOLOGY", label: "B.Sc Microbiology" },
    { value: "BSc_STATISTICS", label: "B.Sc Statistics" },
    { value: "BA_HM", label: "BA Home Science" },
    { value: "MA_HM", label: "MA Home Science" },
    { value: "B_LIB", label: "B.lib." },
  ];

  // pharmacy options

  const pharmacyBranchOptions = [
    { value: "All", label: "All" },
    { value: "B_PHARM", label: "B.Pharm" },
    { value: "D_PHARM", label: "D.Pharm" },
  ];

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
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  let branchOptions = [];

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

          <CustomSelect
            options={courseOptions}
            onChange={(value) => handleChange("course", value)}
            placeholder="Faculty"
          />
          <CustomSelect
            options={branchOptions}
            onChange={(value) => handleChange("branch", value)}
            placeholder="Branch"
          />
          <CustomSelect
            options={semesterOptions}
            onChange={(value) => handleChange("semester", value)}
            placeholder="Semester"
          />
          <CustomSelect
            options={yearOptions}
            onChange={(value) => handleChange("year", value)}
            placeholder="Year"
          />
          <select
            name="downloadable"
            value={paperData.downloadable}
            id="downloadable"
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

          <div id="button">
            <button onClick={request}>Go</button>
          </div>
          <div onClick={verify} className="admin"></div>
        </div>
      </div>
    </>
  );
}
