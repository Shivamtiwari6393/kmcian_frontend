/* eslint-disable no-unused-vars */
import { useState } from "react";
import uploadcss from "../Styles/Upload.module.css";
import Loading from "./Loading";
import CustomSelect from "./CustomSelect";
import pdf from "../assets/pdf.png";
import toast from "react-hot-toast";
export default function Upload() {
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

  const handleSelectClick = (selectName,e) => {
    e.stopPropagation()
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
      "Art and Humanities": artHumnanitiesOptions,
      "Social Science": socialSciencesOptions,
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

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${url}/post`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded / e.total) * 100);
        setProgress(percentage);
        console.log(`Progress: ${percentage}%`);
      }
    };

    xhr.onload = () => {
      setIsLoading(false);
      try {
        const data = JSON.parse(xhr.response); // Ensure the response is parsed as JSON
        if (xhr.status === 201) {
          toast.success(data.message, { id: loadId });
          setProgress(0);
        } else {
          toast.error(data.message, { id: loadId });
        }
      } catch (err) {
        console.error("Failed to parse response:", err);
        toast.error("An unexpected error occurred.", { id: loadId });
      }
    };

    xhr.onerror = () => {
      setIsLoading(false);
      toast.error("Network error occurred.", { id: loadId });
    };

    xhr.ontimeout = () => {
      setIsLoading(false);
      toast.error("Request timed out.", { id: loadId });
    };

    setIsLoading(true);

    const loadId = toast.loading("Paper upload in progress...");

    xhr.send(formData);
    // fetch(`${url}/post`, {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then(async (response) => {
    //     setIsLoading(false);
    //     const data = await response.json();
    //     if (!response.ok) throw new Error(data.message || "An error occurred");
    //     toast.success(data.message, { id: loadId });
    //   })
    //   .catch((e) => {
    //     setIsLoading(false);
    //     toast.error(e.message, { id: loadId });
    //   });
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
    { value: "CSE(AI&ML)", label: "CSE(AI&ML)" },
    { value: "CSE(AI&DS)", label: "CSE(AI&DS)" },
    { value: "CSE", label: "CSE" },
    { value: "BIO TECHNOLOGY", label: "Bio Technology" },
    { value: "CIVIL", label: "Civil" },
    { value: "MACHANICAL", label: "Machanical" },
    { value: "M.Tech - CSE(AI&ML)", label: "M.Tech - CSE(AI&ML)" },
  ];

  const commerceBranchOptions = [
    { value: "BBA", label: "BBA" },
    { value: "MBA", label: "MBA" },
    { value: "MBA FA", label: "MBA(FA)" },
    { value: "B.COM", label: "B.COM" },
    { value: "B.COM(TT)", label: "B.COM(TT)" },
    { value: "M.COM", label: "M.COM" },
  ];

  const legalStudiesBranchOptions = [
    { value: "LLM", label: "LLM" },
    { value: "BA LLB", label: "BA LLB" },
    { value: "LLB", label: "LLB" },
  ];

  // science options

  const scienceBranchOptions = [
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
    { value: "B PHARM", label: "B.Pharm" },
    { value: "D PHARM", label: "D.Pharm" },
  ];

  // arts and humanities options

  const artHumnanitiesOptions = [
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

  const socialSciencesOptions = [
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
    ? (branchOptions = socialSciencesOptions)
    : "";

  uploadData.course === "Art and Humanities"
    ? (branchOptions = artHumnanitiesOptions)
    : "";

  // ------------------------------------------------------------

  return (
    <>
      {isLoading && <Loading progress={progress}></Loading>}

      <div className={uploadcss["upload-container"]} onClick={()=> setOpenSelect(null)}>
        <div className={uploadcss["upload-container-header"]}>
          <h3>Upload PYQs</h3>
        </div>
        {error && (
          <div className="error-container">
            <p>{error}</p>{" "}
          </div>
        )}

        <CustomSelect
          options={courseOptions}
          isOpen={openSelect === "course"}
          onClick={(e) => handleSelectClick("course",e)}
          onChange={(value) => handleDataChange("course", value)}
          placeholder="Faculty"
        />
        <CustomSelect
          options={branchOptions}
          isOpen={openSelect === "branch"}
          onClick={(e) => handleSelectClick("branch",e)}
          onChange={(value) => handleDataChange("branch", value)}
          placeholder="Branch"
        />
        <CustomSelect
          options={semesterOptions}
          isOpen={openSelect === "semester"}
          onClick={(e) => handleSelectClick("semester",e)}
          onChange={(value) => handleDataChange("semester", value)}
          placeholder="Semester"
        />
        <CustomSelect
          options={yearOptions}
          isOpen={openSelect === "year"}
          onClick={(e) => handleSelectClick("year",e)}
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

        <button onClick={upload}>Upload</button>
      </div>
    </>
  );
}
