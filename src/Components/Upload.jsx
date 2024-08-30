/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
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

  const handleDataChange = (name, value) => {
    setError("");
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    setError("");
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = () => {
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
    { value: "CSE(AI&ML)", label: "CSE(AI&ML)" },
    { value: "CSE(AI&DS)", label: "CSE(AI&DS)" },
    { value: "CSE", label: "CSE" },
    { value: "BIO_TECHNOLOGY", label: "Bio Technology" },
    { value: "CIVIL", label: "Civil" },
    { value: "MACHANICAL", label: "Machanical" },
    { value: "M_TECH_CSE(AI&ML)", label: "M.Tech - CSE(AI&ML)" },
  ];

  const commerceBranchOptions = [
    { value: "BBA", label: "BBA" },
    { value: "MBA", label: "MBA" },
    { value: "MBA_FA", label: "MBA(FA)" },
    { value: "B_COM", label: "B.COM" },
    { value: "B_COM_TT", label: "B.COM(TT)" },
    { value: "M_COM", label: "M.COM" },
  ];

  const legalStudiesBranchOptions = [
    { value: "LLM", label: "LLM" },
    { value: "BA_LLB", label: "BA LLB" },
    { value: "LLB", label: "LLB" },
  ];

  // science options

  const scienceBranchOptions = [
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
    { value: "B_PHARM", label: "B.Pharm" },
    { value: "D_PHARM", label: "D.Pharm" },
  ];

  const semesterOptions = [
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
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

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
        {/* <div className={uploadcss["content"]}>
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
        </div> */}

        <CustomSelect
          options={courseOptions}
          onChange={(value) => handleDataChange("course", value)}
          placeholder="Faculty"
        />
        <CustomSelect
          options={branchOptions}
          onChange={(value) => handleDataChange("branch", value)}
          placeholder="Branch"
        />
        <CustomSelect
          options={semesterOptions}
          onChange={(value) => handleDataChange("semester", value)}
          placeholder="Semester"
        />
        <CustomSelect
          options={yearOptions}
          onChange={(value) => handleDataChange("year", value)}
          placeholder="Year"
        />

        <fieldset>
          <legend>Paper Name</legend>
          <div className="name">
            <input
              type="text"
              name="paper"
              placeholder="Enter Paper Name"
              value={uploadData.paper}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
          </div>
        </fieldset>

        <button onClick={upload}>Upload</button>
      </div>
    </>
  );
}
