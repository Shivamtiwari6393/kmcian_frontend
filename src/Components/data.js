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

  const socialSciencesOptions = [
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


  export default [yearOptions,semesterOptions,socialSciencesOptions, artHumnanitiesOptions, pharmacyBranchOptions, scienceBranchOptions, legalStudiesBranchOptions,commerceBranchOptions, engineeringBranchOptions, courseOptions ]