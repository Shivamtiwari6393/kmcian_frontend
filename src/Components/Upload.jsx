/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
import pdf from "../assets/pdf.png";
import toast from "react-hot-toast";
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

  const [fileName, setFileName] = useState("No file chosen");

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
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    setError("");
    setUploadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = () => {
    setError("");

    // validating input fields

    if (uploadData.paper == "") {
      setError("Please enter a paper name");
      return;
    }

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

    const map = {
      Engineering: engineeringBranchOptions,
      Commerce: commerceBranchOptions,
      "Legal Studies": legalStudiesBranchOptions,
      Science: scienceBranchOptions,
      Pharmacy: pharmacyBranchOptions,
    };

    // verify branch in selected faculty branch options

    const exists = map[uploadData.course].some(
      (option) => option.value === uploadData.branch
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
        </div>
      );
      setError("Please reselect the branch");
      return;
    }
    //----------- API---------------

    // const url = "http://127.0.0.1:8000/api/paper";
    const url = "https://kmcianbackend.vercel.app/api/paper";

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

    fetch(`${url}/post`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "An error occurred");
          });
        }

        if (response.status == 201) {
          setIsLoading(false);
          toast.success("Thank you!.Paper uploaded.");
        }
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.message);
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

  // arts and humanities options

  const artHumnanitiesOptions = [
    { value: "All", label: "All" },
    { value: "MA_ARABIC", label: "MA ARABIC" },
    { value: "MA_ENGLISH", label: "MA ENGLISH" },
    { value: "MA_HINDI", label: "MA HINDI" },
    { value: "MA_PERSIAN", label: "MA PERSIAN" },
    { value: "MA_URDU", label: "MA URDU" },
    { value: "BA_ARABIC", label: "BA ARABIC" },
    { value: "BA_ENGLISH", label: "BA ENGLISH" },
    { value: "BA_HINDI", label: "BA HINDI" },
    { value: "BA_PERSIAN", label: "BA PERSIAN" },
    { value: "BA_URDU", label: "BA URDU" },
    { value: "BA_FRENCH", label: "BA FRENCH" },
    { value: "BA_CHINESE", label: "BA CHINESE" },
    { value: "BA_GERMAN", label: "BA GERMAN" },
    { value: "BA_JAPANESE", label: "BA JAPANESE" },
    { value: "BA_SANSKRIT", label: "BA SANSKRIT" },
    { value: "BA_PALI", label: "BA PALI" },
  ];

  const socialSciencesOptins = [
    { value: "All", label: "All" },
    { value: "B_ED", label: "B.ED" },
    { value: "MA_EDUCATION", label: "MA EDUCATION" },
    { value: "MA_JOURN_MASS_COMM", label: "MA JOURN MASS COMM" },
    { value: "MA_HISTORY", label: "MA HISTORY" },
    { value: "MA_GEOGRAPHY", label: "MA GEOGRAPHY" },
    { value: "MA_ECONOMICS", label: "MA ECONOMICS" },
    { value: "MA_FINE_ARTS", label: "MA FINE ARTS" },
    { value: "BA_EDUCATION", label: "BA EDUCATION" },
    { value: "BA_HISTORY", label: "BA HISTORY" },
    { value: "BA_GEOGRAPHY", label: "BA GEOGRAPHY" },
    { value: "BA_ECONOMICS", label: "BA ECONOMICS" },
    { value: "BA_FINE_ARTS", label: "BA FINE ARTS" },
    { value: "BA_POL_SCIENCE", label: "BA POL SCIENCE" },
    { value: "BA_PHYSICAL_EDU", label: "BA PHYSICAL EDU" },
    { value: "BA_JOURN_MASS_COMM", label: "BA JOURN MASS COMM" },
    { value: "BA_SOCIOLOGY", label: "BA SOCIOLOGY" },
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

  uploadData.course === "Social Science"
    ? (branchOptions = socialSciencesOptins)
    : "";

  uploadData.course === "Art and Humanities"
    ? (branchOptions = artHumnanitiesOptions)
    : "";

  // ------------------------------------------------------------

  return (
    <>
      {isLoading && <Loading></Loading>}

      <div className={uploadcss["upload-container"]}>
        {error && (
          <div className="error-container">
            <p>{error}</p>{" "}
          </div>
        )}

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
          />
        </div>
        <div className="name">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={uploadData.name}
            onChange={handleInputChange}
          />
        </div>

        <button onClick={upload}>Upload</button>
      </div>
    </>
  );
}
