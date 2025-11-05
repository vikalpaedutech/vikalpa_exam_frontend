
// // import React, {useState, useEffect, useContext} from "react";
// // import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
// // import Select from "react-select";
// // import { UserContext } from "../NewContextApis/UserContext.js";
// // import { StudentContext } from "../NewContextApis/StudentContextApi.js";

// // export const ClassOfStduentDropDowns = () =>{
// // const {classContext, setClassContext} = useContext(StudentContext);

    


// //     return(

// //     )
// // }




// import React, { useState, useEffect, useContext } from "react";
// import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { StudentContext } from "../NewContextApis/StudentContextApi.js";


// export const ClassOfStduentDropDowns = () => {
//   // read context (may be undefined if Provider not present)
//   const { classContext, setClassContext } = useContext(StudentContext) || {};

//   // local selection state (keeps select controlled and syncs with context)
//   const [selectedClass, setSelectedClass] = useState(classContext || null);


//   const {studentData, setStudentData} = useContext(StudentContext);

//   // sync local state when context updates externally
//   useEffect(() => {
//     setSelectedClass(classContext || null);
//   }, [classContext]);

//   // fixed class options: 8 and 10 (values are numbers, labels are numbers as requested)
//   const classOptions = [
//     { value: 8, label: 8 },
//     { value: 10, label: 10 },
//   ];

//   // on change -> update local + context (store same object shape in context)
//   const handleChange = (option) => {
//     const newVal = option || null;
//     setSelectedClass(newVal);
//     if (setClassContext) {
//       setClassContext(newVal);
//     }
//     console.log("selected class:", newVal);
//   };

//   return (
//     <div style={{ marginBottom: 16 }}>
//       <label style={{ display: "block", marginBottom: 6 }}>Class</label>
//       <Select
//         options={classOptions}
//         value={selectedClass}

//         onChange={handleChange}
//         placeholder="Select class..."
//         isClearable
//       />
//     </div>
//   );
// };










import React, { useState, useEffect, useContext } from "react";
import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
import Select from "react-select";
import { UserContext } from "../NewContextApis/UserContext.js";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";

export const ClassOfStduentDropDowns = () => {
  // read context (may be undefined if Provider not present)
  const { classContext, setClassContext } = useContext(StudentContext) || {};

  // local selection state (keeps select controlled and syncs with context)
  const [selectedClass, setSelectedClass] = useState(classContext || null);

  const { studentData, setStudentData } = useContext(StudentContext);

  // sync local state when context updates externally
  useEffect(() => {
    setSelectedClass(classContext || null);
  }, [classContext]);

  // fixed class options: 8 and 10 (values are numbers, labels are numbers as requested)
  const classOptions = [
    { value: 8, label: 8 },
    { value: 10, label: 10 },
  ];

  // prefill from studentData if available
  useEffect(() => {
    if (studentData?.classOfStudent) {
      const found = classOptions.find(
        (opt) => opt.value === Number(studentData.classOfStudent)
      );
      if (found) {
        setSelectedClass(found);
        if (setClassContext) setClassContext(found);
      }
    }
  }, [studentData?.classOfStudent]);

  // on change -> update local + context (store same object shape in context)
  const handleChange = (option) => {
    const newVal = option || null;
    setSelectedClass(newVal);
    if (setClassContext) {
      setClassContext(newVal);
    }

    // update in studentData too
    if (typeof setStudentData === "function") {
      setStudentData((prev) => ({
        ...(prev || {}),
        classOfStudent: newVal ? newVal.value : "",
      }));
    }

    console.log("selected class:", newVal);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 6 }}>Class</label>
      <Select
        options={classOptions}
        value={selectedClass}
        onChange={handleChange}
        placeholder="Select class..."
        isClearable
      />
    </div>
  );
};
