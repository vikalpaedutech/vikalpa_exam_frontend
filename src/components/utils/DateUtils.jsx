// // DateUtils.jsx
// import React, { useContext } from "react";
// import { DateContext } from "../NewContextApis/DateContextApi";
// import { Form } from "react-bootstrap";

// import { StudentContext } from "../NewContextApis/StudentContextApi";

// export const DateUtils = () => {
//   const { dateContext = [], setSingleDateFromIso, setDateContext } = useContext(DateContext);

//   const {studentData, setStudentData} = useContext(DateContext);


//   // If provider exposes helper, prefer it; otherwise fallback to setting array directly
//   const handleChange = (e) => {
//     const iso = e.target.value; // "YYYY-MM-DD"
//     if (!iso) return;

//     if (typeof setSingleDateFromIso === "function") {
//       const ok = setSingleDateFromIso(iso);
//       if (!ok) console.warn("Invalid date selected:", iso);
//       // provider will console.log updated value
//       return;
//     }

//     // fallback: normalize and set directly
//     const d = new Date(iso + "T00:00:00");
//     if (Number.isNaN(d.getTime())) return;
//     const pad = (n) => String(n).padStart(2, "0");
//     const dd = pad(d.getDate());
//     const mm = pad(d.getMonth() + 1);
//     const yyyy = d.getFullYear();
//     const obj = {
//       date: `${dd}-${mm}-${yyyy}`,
//       day: d.toLocaleDateString(undefined, { weekday: "long" }),
//       dayOfMonth: d.getDate(),
//       month: d.toLocaleDateString(undefined, { month: "long" }),
//       year: yyyy,
//       formatted: d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }),
//     };

//     // replace previous with this one
//     if (typeof setDateContext === "function") {
//       setDateContext([obj]);
//       console.log("Selected date:", obj);
//     }
//   };

//   return (
//     <div>
//       <Form>
//         <Form.Group controlId="datePicker">
//           <Form.Control type="date" onChange={handleChange}
          
//             placeholder={studentData?.dob ?? 
//             "Select Date..."
//           }
//           />
//         </Form.Group>
//       </Form>
//     </div>
//   );
// };










// DateUtils.jsx
import React, { useContext } from "react";
import { DateContext } from "../NewContextApis/DateContextApi";
import { Form } from "react-bootstrap";

import { StudentContext } from "../NewContextApis/StudentContextApi";

export const DateUtils = () => {
  const { dateContext = [], setSingleDateFromIso, setDateContext } = useContext(DateContext);

  const { studentData, setStudentData } = useContext(StudentContext);

  // If provider exposes helper, prefer it; otherwise fallback to setting array directly
  const handleChange = (e) => {
    const iso = e.target.value; // "YYYY-MM-DD"
    if (!iso) return;

    if (typeof setSingleDateFromIso === "function") {
      const ok = setSingleDateFromIso(iso);
      if (!ok) console.warn("Invalid date selected:", iso);
      // provider will console.log updated value

      // also keep studentData.dob in sync so the input's value updates when controlled by studentData
      try {
        if (ok && typeof setStudentData === "function") {
          setStudentData(prev => ({ ...(prev || {}), dob: iso }));
        }
      } catch (err) {
        console.error("failed to update studentData.dob after setSingleDateFromIso:", err);
      }

      return;
    }

    // fallback: normalize and set directly
    const d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return;
    const pad = (n) => String(n).padStart(2, "0");
    const dd = pad(d.getDate());
    const mm = pad(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const obj = {
      date: `${dd}-${mm}-${yyyy}`,
      day: d.toLocaleDateString(undefined, { weekday: "long" }),
      dayOfMonth: d.getDate(),
      month: d.toLocaleDateString(undefined, { month: "long" }),
      year: yyyy,
      formatted: d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }),
    };

    // replace previous with this one
    if (typeof setDateContext === "function") {
      setDateContext([obj]);
      console.log("Selected date:", obj);
    }

    // also update studentData.dob so the controlled input reflects the newly chosen date
    try {
      if (typeof setStudentData === "function") {
        setStudentData(prev => ({ ...(prev || {}), dob: iso }));
      }
    } catch (err) {
      console.error("failed to update studentData.dob after fallback setDateContext:", err);
    }
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="datePicker">
          <Form.Control
            type="date"
            onChange={handleChange}
            value={
              studentData?.dob
                ? new Date(studentData.dob).toISOString().split("T")[0]
                : ""
            }
            placeholder={
              studentData?.dob ??
              "Select Date..."
            }
          />
        </Form.Group>
      </Form>
    </div>
  );
};














