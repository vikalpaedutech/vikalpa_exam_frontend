


// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { UserContext } from "../NewContextApis/UserContext";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";

// export const BLCStudentSignatureForm = () => {
//   const { userData } = useContext(UserContext) || {};
//   const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [blockOptions, setBlockOptions] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [filteredSchools, setFilteredSchools] = useState([]);

//   useEffect(() => {
//     if (!Array.isArray(districtBlockSchoolData)) return;
//     const districtsMap = new Map();
//     districtBlockSchoolData.forEach((row) => {
//       const key = `${row.districtId}::${row.districtName}`;
//       if (!districtsMap.has(key)) districtsMap.set(key, { value: row.districtName, label: row.districtName, id: row.districtId });
//     });
//     setDistrictOptions(Array.from(districtsMap.values()));
//   }, [districtBlockSchoolData]);

//   useEffect(() => {
//     if (!selectedDistrict) return setBlockOptions([]);
//     const blocksMap = new Map();
//     districtBlockSchoolData.forEach((row) => {
//       if (row.districtName === selectedDistrict.value) {
//         const bkey = `${row.blockId}::${row.blockName}`;
//         if (!blocksMap.has(bkey)) blocksMap.set(bkey, { value: row.blockName, label: row.blockName, id: row.blockId });
//       }
//     });
//     setBlockOptions(Array.from(blocksMap.values()));
//     setSelectedBlock(null);
//   }, [selectedDistrict, districtBlockSchoolData]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//     const schools = districtBlockSchoolData.filter(
//       (r) => r.districtName === selectedDistrict?.value && r.blockName === selectedBlock?.value
//     );
//     setFilteredSchools(schools);
//   };


// //Logos
//   const logo = "/haryana.png";
// const logo2 = "/admitBuniyaLogo.png";


//   const generatePDF = () => {
//     if (!selectedDistrict || !selectedBlock) return;

//     // Sort schools - middle schools first, then others by centerId
//     const schools = Array.from(filteredSchools || []);
//     schools.sort((a, b) => {
//       // Check if school name contains "middle" (case insensitive)
//       const aIsMiddle = a.centerName?.toLowerCase().includes("middle");
//       const bIsMiddle = b.centerName?.toLowerCase().includes("middle");
      
//       // Middle schools come first
//       if (aIsMiddle && !bIsMiddle) return -1;
//       if (!aIsMiddle && bIsMiddle) return 1;
      
//       // If both are middle or both are not middle, sort by centerId
//       const ai = parseInt(a.centerId, 10);
//       const bi = parseInt(b.centerId, 10);
//       if (!isNaN(ai) && !isNaN(bi)) return ai - bi;
//       return String(a.centerId).localeCompare(String(b.centerId));
//     });

//     // Landscape A4
//     const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const margin = 36;
//    // logos - best effort
//     try { doc.addImage(logo, "PNG", 45, 8, 50, 50); } catch (e) {}
//     try { doc.addImage(logo2, "PNG", 750, 8, 50, 50); } catch (e) {}
//     // Build rows - with merged school names
//     const bodyRows = [];
//     let schoolIndex = 0;
    
//     schools.forEach((school) => {
//       schoolIndex += 1;
      
//       // Check if it's a middle school
//       const isMiddleSchool = school.centerName?.toLowerCase().includes("middle");
//       const rowCount = isMiddleSchool ? 3 : 6;
      
//       // For first row of each school, include school name and index
//       bodyRows.push([
//         String(schoolIndex),             // #
//         school.centerName || "",         // School Name (only in first row)
//         isMiddleSchool ? "8" : "8",      // Class (first row - 8th)
//         "",                              // SRN
//         "",                              // Student Name
//         "",                              // Father Name
//         ""                               // Signature
//       ]);
      
//       // For remaining rows, keep school name and index empty (will be merged)
//       for (let i = 2; i <= rowCount; i++) {
//         const cls = isMiddleSchool ? "8" : (i <= 3 ? "8" : "10");
        
//         bodyRows.push([
//           "",                            // # (empty for merged cells)
//           "",                            // School Name (empty for merged cells)
//           cls,                           // Class
//           "",                            // SRN
//           "",                            // Student Name
//           "",                            // Father Name
//           ""                             // Signature
//         ]);
//       }
//     });

//     const head = [["#", "School Name", "Class", "SRN", "Student Name", "Father Name", "Signature"]];

//     // Calculate merge ranges for school names and indices (BODY ONLY)
//     const merges = [];
//     let currentRow = 0;
    
//     schools.forEach((school) => {
//       const isMiddleSchool = school.centerName?.toLowerCase().includes("middle");
//       const rowCount = isMiddleSchool ? 3 : 6;
      
//       // Merge index column (column 0) - BODY ONLY
//       if (rowCount > 1) {
//         merges.push({
//           row: currentRow,
//           column: 0,
//           rowspan: rowCount,
//           colspan: 1
//         });
//       }
      
//       // Merge school name column (column 1) - BODY ONLY
//       if (rowCount > 1) {
//         merges.push({
//           row: currentRow,
//           column: 1,
//           rowspan: rowCount,
//           colspan: 1
//         });
//       }
      
//       currentRow += rowCount;
//     });

//     doc.autoTable({
//       head,
//       body: bodyRows,
//       startY: margin + 30,
//       margin: { left: margin, right: margin, top: margin },
//       styles: {
//         cellPadding: 6,
//         fontSize: 10,
//         valign: "middle",
//         overflow: "linebreak",
//         minCellHeight: 20
//       },
//       headStyles: { 
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold'
//       },
//       theme: "grid",
//       columnStyles: {
//         0: { cellWidth: 30, halign: 'center' },    // #
//         1: { cellWidth: 220, halign: 'left' },     // School Name
//         2: { cellWidth: 40, halign: 'center' },    // Class
//         3: { cellWidth: 80, halign: 'center' },    // SRN
//         4: { cellWidth: 150, halign: 'left' },     // Student Name
//         5: { cellWidth: 150, halign: 'left' },     // Father Name
//         6: { cellWidth: 100, halign: 'center' }    // Signature
//       },
//       didParseCell: function(data) {
//         // Add borders to all cells
//         if (data.section === 'body') {
//           data.cell.styles.lineWidth = 0.5;
//           data.cell.styles.lineColor = [0, 0, 0];
//         }

//         // Apply merges ONLY for body cells
//         if (data.section === 'body') {
//           merges.forEach(merge => {
//             if (data.row.index === merge.row && data.column.index === merge.column) {
//               data.cell.rowSpan = merge.rowspan;
//               data.cell.colSpan = merge.colspan;
//             }
//           });
//         }
//       },
//       didDrawPage: function (data) {
//         const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

//         // District/Block/Prepared by only on first page
//         if (currentPage === 1) {

//           doc.setFontSize(12);
//           doc.text(`Total Schools: ${filteredSchools.length}`, pageWidth / 2, margin - 18, { align: "center" });  

//           doc.setFontSize(14);
//           doc.text(`District: ${selectedDistrict.value}-(Student Signature Form)`, pageWidth / 2, margin, { align: "center" });
          
//           const headerY = margin + 18;
          
//           doc.text(`Block: ${selectedBlock.value}`, pageWidth / 2, headerY, { align: "center" });
//           if (userData && userData.name) {
//             doc.setFontSize(10);
//             doc.text(`Prepared by: ${userData.name}`, pageWidth - margin - 160, headerY);
//           }
//         }

//         // Footer: page number centered
//         const footerY = pageHeight - 18;
//         doc.setFontSize(10);
//         const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
//         doc.text(`Page ${pageNum}`, pageWidth / 2, footerY, { align: "center" });
//       }
//     });

//     // Prepared by / signature lines on final page (ensure space)
//     const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : margin + 300;
//     const spaceAfter = 28;
//     const neededHeight = 60;
//     let footerStartY = finalY + spaceAfter;
//     if (footerStartY + neededHeight > pageHeight - margin) {
//       doc.addPage();
//       footerStartY = margin + 20;
//     }
//     // doc.setFontSize(10);
//     // doc.text("Prepared by: ____________________", margin, footerStartY);
//     // doc.text("ABRC/Principal Signature: ____________________", margin, footerStartY + 20);

//     const filename = `${selectedDistrict.value}_${selectedBlock.value}_student_sign_list.pdf`.replace(/\s+/g, "_");
//     doc.save(filename);
//   };

// //   const downloadBlankTemplate = () => {
// //     // Portrait A4 for blank template
// //     const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
// //     const pageWidth = doc.internal.pageSize.getWidth();
// //     const pageHeight = doc.internal.pageSize.getHeight();
// //     const margin = 36;



// //        // logos - best effort
// //    try { doc.addImage(logo, "PNG", 45, 8, 50, 50); } catch (e) {}
// //     try { doc.addImage(logo2, "PNG", 520, 8, 50, 50); } catch (e) {}
// //     // Build blank rows for template - 10 blank school entries
// //     const bodyRows = [];
    
// //     for (let schoolIndex = 1; schoolIndex <= 10; schoolIndex++) {
// //       // For each school: 6 rows (3 for class 8, 3 for class 10)
      
// //       // First row with empty school name (to be filled manually)
// //       bodyRows.push([
// //         String(schoolIndex),             // #
// //         "",                              // School Name (empty - to be filled manually)
// //         "8",                             // Class (first row - 8th)
// //         "",                              // SRN
// //         "",                              // Student Name
// //         "",                              // Father Name
// //         ""                               // Signature
// //       ]);
      
// //       // Remaining 5 rows with merged school name area
// //       for (let i = 2; i <= 6; i++) {
// //         const cls = i <= 3 ? "8" : "10";
        
// //         bodyRows.push([
// //           "",                            // # (empty for merged cells)
// //           "",                            // School Name (empty for merged cells)
// //           cls,                           // Class
// //           "",                            // SRN
// //           "",                            // Student Name
// //           "",                            // Father Name
// //           ""                             // Signature
// //         ]);
// //       }
// //     }

// //     const head = [["#", "School Name", "Class", "SRN", "Student Name", "Father Name", "Signature"]];

// //     // Calculate merge ranges for blank template (BODY ONLY)
// //     const merges = [];
// //     for (let schoolIndex = 0; schoolIndex < 10; schoolIndex++) {
// //       const startRow = schoolIndex * 6;
      
// //       // Merge index column (column 0) - 6 rows - BODY ONLY
// //       merges.push({
// //         row: startRow,
// //         column: 0,
// //         rowspan: 6,
// //         colspan: 1
// //       });
      
// //       // Merge school name column (column 1) - 6 rows - BODY ONLY
// //       merges.push({
// //         row: startRow,
// //         column: 1,
// //         rowspan: 6,
// //         colspan: 1
// //       });
// //     }

// //     doc.autoTable({
// //       head,
// //       body: bodyRows,
// //       startY: margin + 50,
// //       margin: { left: margin, right: margin, top: margin },
// //       styles: {
// //         cellPadding: 4,
// //         fontSize: 8,
// //         valign: "middle",
// //         overflow: "linebreak",
// //         minCellHeight: 15
// //       },
// //       headStyles: { 
// //         fillColor: [200, 200, 200],
// //         textColor: [0, 0, 0],
// //         fontStyle: 'bold'
// //       },
// //       theme: "grid",
// //       columnStyles: {
// //         0: { cellWidth: 20, halign: 'center' },    // #
// //         1: { cellWidth: 100, halign: 'left' },     // School Name
// //         2: { cellWidth: 25, halign: 'center' },    // Class
// //         3: { cellWidth: 75, halign: 'center' },    // SRN
// //         4: { cellWidth: 95, halign: 'left' },      // Student Name
// //         5: { cellWidth: 95, halign: 'left' },      // Father Name
// //         6: { cellWidth: 110, halign: 'center' }     // Signature
// //       },
// //       didParseCell: function(data) {
// //         // Add borders to all cells
// //         if (data.section === 'body') {
// //           data.cell.styles.lineWidth = 0.5;
// //           data.cell.styles.lineColor = [0, 0, 0];
// //         }

// //         // Apply merges ONLY for body cells
// //         if (data.section === 'body') {
// //           merges.forEach(merge => {
// //             if (data.row.index === merge.row && data.column.index === merge.column) {
// //               data.cell.rowSpan = merge.rowspan;
// //               data.cell.colSpan = merge.colspan;
// //             }
// //           });
// //         }
// //       },
// //       didDrawPage: function (data) {
// //         const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

// //         // Only on first page
// //         if (currentPage === 1) {
         
// //             const headerY = margin + 20;

// //           doc.setFontSize(14);
// //           doc.text("District: _______________", pageWidth / 2, margin, { align: "center" });

        
          
          
// //           doc.setFontSize(14);
        
// //           doc.text("Block: _______________", pageWidth / 2, headerY, { align: "center" });

// //           doc.setFontSize(12);
// //           doc.text("Haryana Pratibha Khoj Block Level Campaign (Student Signature Sheet)", pageWidth / 2, headerY + 20, { align: "center" });
// //         }
// //       }
// //     });

// //     const filename = `blank_student_signature_template.pdf`;
// //     doc.save(filename);
// //   };



// const downloadBlankTemplate = () => {
//   // Portrait A4 for blank template
//   const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 36;

//   // logos - best effort (paths should be accessible, e.g. in public/)
//   try { doc.addImage(logo, "PNG", 45, 8, 50, 50); } catch (e) {}
//   try { doc.addImage(logo2, "PNG", pageWidth - margin - 80, 8, 80, 50); } catch (e) {}

//   // Build blank rows for template - 10 blank school entries
//   const bodyRows = [];

//   for (let schoolIndex = 1; schoolIndex <= 10; schoolIndex++) {
//     // For each school: 6 rows (3 for class 8, 3 for class 10)
//     // NOTE: first column (#) intentionally left blank so user can fill it manually
//     // First row with empty school name (to be filled manually)
//     bodyRows.push([
//       "",                              // # (blank - user will fill)
//       "",                              // School Name (empty - to be filled manually)
//       "8",                             // Class (first row - 8th)
//       "",                              // SRN
//       "",                              // Student Name
//       "",                              // Father Name
//       ""                               // Signature
//     ]);

//     // Remaining 5 rows with merged school name area
//     for (let i = 2; i <= 6; i++) {
//       const cls = i <= 3 ? "8" : "10";

//       bodyRows.push([
//         "",                            // # (blank for merged cells)
//         "",                            // School Name (blank - merged)
//         cls,                           // Class
//         "",                            // SRN
//         "",                            // Student Name
//         "",                            // Father Name
//         ""                             // Signature
//       ]);
//     }
//   }

//   const head = [["#", "School Name", "Class", "SRN", "Student Name", "Father Name", "Signature"]];

//   // Calculate merge ranges for blank template (BODY ONLY)
//   // We merge BOTH column 0 (#) and column 1 (School Name) across 6 rows so they appear as a single merged block (and remain blank)
//   const merges = [];
//   for (let schoolIndex = 0; schoolIndex < 10; schoolIndex++) {
//     const startRow = schoolIndex * 6;

//     // Merge index column (column 0) - 6 rows - BODY ONLY (kept blank for user fill)
//     merges.push({
//       row: startRow,
//       column: 0,
//       rowspan: 6,
//       colspan: 1
//     });

//     // Merge school name column (column 1) - 6 rows - BODY ONLY
//     merges.push({
//       row: startRow,
//       column: 1,
//       rowspan: 6,
//       colspan: 1
//     });
//   }

//   doc.autoTable({
//     head,
//     body: bodyRows,
//     startY: margin + 50,
//     margin: { left: margin, right: margin, top: margin },
//     styles: {
//       cellPadding: 4,
//       fontSize: 8,
//       valign: "middle",
//       overflow: "linebreak",
//       minCellHeight: 15
//     },
//     headStyles: {
//       fillColor: [200, 200, 200],
//       textColor: [0, 0, 0],
//       fontStyle: "bold"
//     },
//     theme: "grid",
//     columnStyles: {
//       0: { cellWidth: 20, halign: 'center' },    // #
//       1: { cellWidth: 100, halign: 'left' },     // School Name
//       2: { cellWidth: 25, halign: 'center' },    // Class
//       3: { cellWidth: 75, halign: 'center' },    // SRN
//       4: { cellWidth: 95, halign: 'left' },      // Student Name
//       5: { cellWidth: 95, halign: 'left' },      // Father Name
//       6: { cellWidth: 110, halign: 'center' }    // Signature
//     },
//     didParseCell: function(data) {
//       // Add borders to all cells
//       if (data.section === 'body') {
//         data.cell.styles.lineWidth = 0.5;
//         data.cell.styles.lineColor = [0, 0, 0];
//       }

//       // Apply merges ONLY for body cells
//       if (data.section === 'body') {
//         merges.forEach(merge => {
//           if (data.row.index === merge.row && data.column.index === merge.column) {
//             data.cell.rowSpan = merge.rowspan;
//             data.cell.colSpan = merge.colspan;
//           }
//         });
//       }
//     },
//     didDrawPage: function (data) {
//       const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

//       // Only on first page
//       if (currentPage === 1) {
//         const headerY = margin + 20;

//         doc.setFontSize(14);
//         doc.text("District: _______________", pageWidth / 2, margin, { align: "center" });

//         doc.setFontSize(14);
//         doc.text("Block: _______________", pageWidth / 2, headerY, { align: "center" });

//         doc.setFontSize(12);
//         doc.text("Haryana Pratibha Khoj Block Level Campaign (Student Signature Sheet)", pageWidth / 2, headerY + 20, { align: "center" });
//       }
//     }
//   });

//   const filename = `blank_student_signature_template.pdf`;
//   doc.save(filename);
// };





// return (
//     <div style={{ padding: 16 }}>
//       <h3>Student Sign List (BLC)</h3>

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: 12, width: 400 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>District</label>
//           <Select
//             options={districtOptions}
//             value={selectedDistrict}
//             onChange={(val) => setSelectedDistrict(val)}
//             placeholder={loadingDBS ? "Loading..." : "Select district"}
//           />
//         </div>

//         <div style={{ marginBottom: 12, width: 400 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>Block</label>
//           <Select
//             options={blockOptions}
//             value={selectedBlock}
//             onChange={(val) => setSelectedBlock(val)}
//             placeholder={selectedDistrict ? "Select block" : "Select district first"}
//             isDisabled={!selectedDistrict}
//           />
//         </div>

//         <div style={{ marginTop: 10 }}>
//           <button type="submit" disabled={!selectedDistrict || !selectedBlock}>
//             Submit
//           </button>
//         </div>
//       </form>

//       {submitted && (
//         <div style={{ marginTop: 18 }}>
//           {filteredSchools.length ? (
//             <div>
//               <p>
//                 Found <strong>{filteredSchools.length}</strong> schools in <strong>{selectedBlock?.value}</strong> block.
//               </p>
//               <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                 <button onClick={generatePDF}>Download Form with Schools</button>
//                 <button onClick={downloadBlankTemplate} style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
//                   Download Blank Template
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <p>No schools found for the selected district & block.</p>
//               <div style={{ marginTop: "10px" }}>
//                 <button onClick={downloadBlankTemplate} style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
//                   Download Blank Template
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Always show blank template download button even before submission */}
//       {!submitted && (
//         <div style={{ marginTop: 18 }}>
//           <button onClick={downloadBlankTemplate} style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
//             Download Blank Template
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BLCStudentSignatureForm;














import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { UserContext } from "../NewContextApis/UserContext";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";

export const BLCStudentSignatureForm = () => {
  const { userData } = useContext(UserContext) || {};
  const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState([]);

  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return;
    const districtsMap = new Map();
    districtBlockSchoolData.forEach((row) => {
      const key = `${row.districtId}::${row.districtName}`;
      if (!districtsMap.has(key)) districtsMap.set(key, { value: row.districtName, label: row.districtName, id: row.districtId });
    });
    setDistrictOptions(Array.from(districtsMap.values()));
  }, [districtBlockSchoolData]);

  useEffect(() => {
    if (!selectedDistrict) return setBlockOptions([]);
    const blocksMap = new Map();
    districtBlockSchoolData.forEach((row) => {
      if (row.districtName === selectedDistrict.value) {
        const bkey = `${row.blockId}::${row.blockName}`;
        if (!blocksMap.has(bkey)) blocksMap.set(bkey, { value: row.blockName, label: row.blockName, id: row.blockId });
      }
    });
    setBlockOptions(Array.from(blocksMap.values()));
    setSelectedBlock(null);
  }, [selectedDistrict, districtBlockSchoolData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const schools = districtBlockSchoolData.filter(
      (r) => r.districtName === selectedDistrict?.value && r.blockName === selectedBlock?.value
    );
    setFilteredSchools(schools);
  };


  //Logos
  const logo = "/haryana.png";
const logo2 = "/admitBuniyaLogo.png";


  const generatePDF = () => {
    if (!selectedDistrict || !selectedBlock) return;

    // Sort schools - middle schools first, then others by centerId
    const schools = Array.from(filteredSchools || []);
    schools.sort((a, b) => {
      // Check if school name contains "middle" (case insensitive)
      const aIsMiddle = a.centerName?.toLowerCase().includes("middle");
      const bIsMiddle = b.centerName?.toLowerCase().includes("middle");
      
      // Middle schools come first
      if (aIsMiddle && !bIsMiddle) return -1;
      if (!aIsMiddle && bIsMiddle) return 1;
      
      // If both are middle or both are not middle, sort by centerId
      const ai = parseInt(a.centerId, 10);
      const bi = parseInt(b.centerId, 10);
      if (!isNaN(ai) && !isNaN(bi)) return ai - bi;
      return String(a.centerId).localeCompare(String(b.centerId));
    });

    // Landscape A4
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;
   // logos - best effort
    try { doc.addImage(logo, "PNG", 45, 8, 50, 50); } catch (e) {}
    try { doc.addImage(logo2, "PNG", 750, 8, 50, 50); } catch (e) {}
    // Build rows - with merged school names
    const bodyRows = [];
    let schoolIndex = 0;
    
    schools.forEach((school) => {
      schoolIndex += 1;
      
      // Check if it's a middle school
      const isMiddleSchool = school.centerName?.toLowerCase().includes("middle");
      const rowCount = isMiddleSchool ? 3 : 6;
      
      // For first row of each school, include school name and index
      bodyRows.push([
        String(schoolIndex),             // #
        school.centerName || "",         // School Name (only in first row)
        isMiddleSchool ? "8" : "8",      // Class (first row - 8th)
        "",                              // SRN
        "",                              // Student Name
        "",                              // Father Name
        ""                               // Signature
      ]);
      
      // For remaining rows, keep school name and index empty (will be merged)
      for (let i = 2; i <= rowCount; i++) {
        const cls = isMiddleSchool ? "8" : (i <= 3 ? "8" : "10");
        
        bodyRows.push([
          "",                            // # (empty for merged cells)
          "",                            // School Name (empty for merged cells)
          cls,                           // Class
          "",                            // SRN
          "",                            // Student Name
          "",                            // Father Name
          ""                             // Signature
        ]);
      }
    });

    const head = [["#", "School Name", "Class", "SRN", "Student Name", "Father Name", "Signature"]];

    // Calculate merge ranges for school names and indices (BODY ONLY)
    const merges = [];
    let currentRow = 0;
    
    schools.forEach((school) => {
      const isMiddleSchool = school.centerName?.toLowerCase().includes("middle");
      const rowCount = isMiddleSchool ? 3 : 6;
      
      // Merge index column (column 0) - BODY ONLY
      if (rowCount > 1) {
        merges.push({
          row: currentRow,
          column: 0,
          rowspan: rowCount,
          colspan: 1
        });
      }
      
      // Merge school name column (column 1) - BODY ONLY
      if (rowCount > 1) {
        merges.push({
          row: currentRow,
          column: 1,
          rowspan: rowCount,
          colspan: 1
        });
      }
      
      currentRow += rowCount;
    });

    doc.autoTable({
      head,
      body: bodyRows,
      startY: margin + 30,
      margin: { left: margin, right: margin, top: margin },
      styles: {
        cellPadding: 6,
        fontSize: 10,
        valign: "middle",
        overflow: "linebreak",
        minCellHeight: 20
      },
      headStyles: { 
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },    // #
        1: { cellWidth: 220, halign: 'left' },     // School Name
        2: { cellWidth: 40, halign: 'center' },    // Class
        3: { cellWidth: 80, halign: 'center' },    // SRN
        4: { cellWidth: 150, halign: 'left' },     // Student Name
        5: { cellWidth: 150, halign: 'left' },     // Father Name
        6: { cellWidth: 100, halign: 'center' }    // Signature
      },
      didParseCell: function(data) {
        // Add borders to all cells
        if (data.section === 'body') {
          data.cell.styles.lineWidth = 0.5;
          data.cell.styles.lineColor = [0, 0, 0];
        }

        // Apply merges ONLY for body cells
        if (data.section === 'body') {
          merges.forEach(merge => {
            if (data.row.index === merge.row && data.column.index === merge.column) {
              data.cell.rowSpan = merge.rowspan;
              data.cell.colSpan = merge.colspan;
            }
          });
        }
      },
      didDrawPage: function (data) {
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

        // District/Block/Prepared by only on first page
        if (currentPage === 1) {

          doc.setFontSize(12);
          doc.text(`Total Schools: ${filteredSchools.length}`, pageWidth / 2, margin - 18, { align: "center" });  

          doc.setFontSize(14);
          doc.text(`District: ${selectedDistrict.value}-(Student Signature Form)`, pageWidth / 2, margin, { align: "center" });
          
          const headerY = margin + 18;
          
          doc.text(`Block: ${selectedBlock.value}-[Date(dd-mm-yy):____-____-____]`, pageWidth / 2, headerY, { align: "center" });
          if (userData && userData.name) {
            doc.setFontSize(10);
            doc.text(`Prepared by: ${userData.name}`, pageWidth - margin - 160, headerY);
          }
        }

        // Footer: page number centered
        const footerY = pageHeight - 18;
        doc.setFontSize(10);
        const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
        doc.text(`Page ${pageNum}`, pageWidth / 2, footerY, { align: "center" });
      }
    });

    // Prepared by / signature lines on final page (ensure space)
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : margin + 300;
    const spaceAfter = 28;
    const neededHeight = 60;
    let footerStartY = finalY + spaceAfter;
    if (footerStartY + neededHeight > pageHeight - margin) {
      doc.addPage();
      footerStartY = margin + 20;
    }
    // doc.setFontSize(10);
    // doc.text("Prepared by: ____________________", margin, footerStartY);
    // doc.text("ABRC/Principal Signature: ____________________", margin, footerStartY + 20);

    const filename = `${selectedDistrict.value}_${selectedBlock.value}_student_sign_list.pdf`.replace(/\s+/g, "_");
    doc.save(filename);
  };

  // Third PDF: simple S.No + School Name + Status blank, appears only when District & Block selected
  const downloadSimpleList = () => {
    if (!selectedDistrict || !selectedBlock) return;

    // build schools list from data (use same sorting logic)
    const schools = districtBlockSchoolData
      .filter((r) => r.districtName === selectedDistrict?.value && r.blockName === selectedBlock?.value)
      .map(s => ({ ...s }));

    schools.sort((a, b) => {
      const aIsMiddle = a.centerName?.toLowerCase().includes("middle");
      const bIsMiddle = b.centerName?.toLowerCase().includes("middle");
      if (aIsMiddle && !bIsMiddle) return -1;
      if (!aIsMiddle && bIsMiddle) return 1;
      const ai = parseInt(a.centerId, 10);
      const bi = parseInt(b.centerId, 10);
      if (!isNaN(ai) && !isNaN(bi)) return ai - bi;
      return String(a.centerId).localeCompare(String(b.centerId));
    });

    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;

    // logos top left and right (best-effort)
    try { doc.addImage(logo, "PNG", margin, 10, 50, 50); } catch (e) {}
    try { doc.addImage(logo2, "PNG", pageWidth - margin - 80, 10, 80, 50); } catch (e) {}

    // Title and district/block on top
    doc.setFontSize(14);
    doc.text(`District: ${selectedDistrict.value}`, pageWidth / 2, 28, { align: "center" });
    doc.setFontSize(12);
  
    doc.text(`Block: ${selectedBlock.value}`,pageWidth / 2 , 50, { align: "center" });

    // Build table rows S.No, School Name, Status (blank)
    const head = [["S.No", "School Name", "Status"]];
    const body = schools.map((s, idx) => {
      return [String(idx + 1), s.centerName || "", ""];
    });

    doc.autoTable({
      head,
      body,
      startY: 70,
      margin: { left: margin, right: margin },
      styles: { cellPadding: 6, fontSize: 11, valign: "middle", overflow: "linebreak" },
      headStyles: { fillColor: [200, 200, 200], textColor: [0,0,0], fontStyle: 'bold' },
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 40, halign: "center" },
        1: { cellWidth: pageWidth - margin * 2 - 40 - 120, halign: "left" }, // remaining width for school name
        2: { cellWidth: 120, halign: "left" } // status column
      },
      didDrawPage: function(data) {
        // page number footer
        const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(10);
        doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 18, { align: "center" });
      }
    });

    const filename = `${selectedDistrict.value}_${selectedBlock.value}_Schools_list.pdf`.replace(/\s+/g, "_");
    doc.save(filename);
  };



const downloadBlankTemplate = () => {
  // Portrait A4 for blank template
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;

  // logos - best effort (paths should be accessible, e.g. in public/)
  try { doc.addImage(logo, "PNG", 45, 8, 50, 50); } catch (e) {}
  try { doc.addImage(logo2, "PNG", pageWidth - margin - 80, 8, 80, 50); } catch (e) {}

  // Build blank rows for template - 10 blank school entries
  const bodyRows = [];

  for (let schoolIndex = 1; schoolIndex <= 10; schoolIndex++) {
    // For each school: 6 rows (3 for class 8, 3 for class 10)
    // NOTE: first column (#) intentionally left blank so user can fill it manually
    // First row with empty school name (to be filled manually)
    bodyRows.push([
      "",                              // # (blank - user will fill)
      "",                              // School Name (empty - to be filled manually)
      "8",                             // Class (first row - 8th)
      "",                              // SRN
      "",                              // Student Name
      "",                              // Father Name
      ""                               // Signature
    ]);

    // Remaining 5 rows with merged school name area
    for (let i = 2; i <= 6; i++) {
      const cls = i <= 3 ? "8" : "10";

      bodyRows.push([
        "",                            // # (blank for merged cells)
        "",                            // School Name (blank - merged)
        cls,                           // Class
        "",                            // SRN
        "",                            // Student Name
        "",                            // Father Name
        ""                             // Signature
      ]);
    }
  }

  const head = [["#", "School Name", "Class", "SRN", "Student Name", "Father Name", "Signature"]];

  // Calculate merge ranges for blank template (BODY ONLY)
  // We merge BOTH column 0 (#) and column 1 (School Name) across 6 rows so they appear as a single merged block (and remain blank)
  const merges = [];
  for (let schoolIndex = 0; schoolIndex < 10; schoolIndex++) {
    const startRow = schoolIndex * 6;

    // Merge index column (column 0) - 6 rows - BODY ONLY (kept blank for user fill)
    merges.push({
      row: startRow,
      column: 0,
      rowspan: 6,
      colspan: 1
    });

    // Merge school name column (column 1) - 6 rows - BODY ONLY
    merges.push({
      row: startRow,
      column: 1,
      rowspan: 6,
      colspan: 1
    });
  }

  doc.autoTable({
    head,
    body: bodyRows,
    startY: margin + 50,
    margin: { left: margin, right: margin, top: margin },
    styles: {
      cellPadding: 4,
      fontSize: 8,
      valign: "middle",
      overflow: "linebreak",
      minCellHeight: 15
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontStyle: "bold"
    },
    theme: "grid",
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },    // #
      1: { cellWidth: 100, halign: 'left' },     // School Name
      2: { cellWidth: 25, halign: 'center' },    // Class
      3: { cellWidth: 75, halign: 'center' },    // SRN
      4: { cellWidth: 95, halign: 'left' },      // Student Name
      5: { cellWidth: 95, halign: 'left' },      // Father Name
      6: { cellWidth: 110, halign: 'center' }    // Signature
    },
    didParseCell: function(data) {
      // Add borders to all cells
      if (data.section === 'body') {
        data.cell.styles.lineWidth = 0.5;
        data.cell.styles.lineColor = [0, 0, 0];
      }

      // Apply merges ONLY for body cells
      if (data.section === 'body') {
        merges.forEach(merge => {
          if (data.row.index === merge.row && data.column.index === merge.column) {
            data.cell.rowSpan = merge.rowspan;
            data.cell.colSpan = merge.colspan;
          }
        });
      }
    },
    didDrawPage: function (data) {
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

      // Only on first page
      if (currentPage === 1) {
        const headerY = margin + 20;

        doc.setFontSize(14);
        doc.text("District: _______________", pageWidth / 2, margin-20, { align: "center" });

        doc.setFontSize(14);
        doc.text("Block: _______________ ", pageWidth / 2, headerY-18, { align: "center" });

        doc.setFontSize(12);
        doc.text("Haryana Pratibha Khoj Block Level Campaign (Student Signature Sheet)", pageWidth / 2, headerY + 5, { align: "center" });
        doc.text("Date(dd-mm-yyyy): ____-____-____", pageWidth / 2, headerY + 23, { align: "center" });
      }
    }
  });

  const filename = `blank_student_signature_template.pdf`;
  doc.save(filename);
};




return (
    <div style={{ padding: 16 }}>
      <h3>Student Sign List (BLC)</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12, width: 400 }}>
          <label style={{ display: "block", marginBottom: 6 }}>District</label>
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={(val) => setSelectedDistrict(val)}
            placeholder={loadingDBS ? "Loading..." : "Select district"}
          />
        </div>

        <div style={{ marginBottom: 12, width: 400 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Block</label>
          <Select
            options={blockOptions}
            value={selectedBlock}
            onChange={(val) => setSelectedBlock(val)}
            placeholder={selectedDistrict ? "Select block" : "Select district first"}
            isDisabled={!selectedDistrict}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={!selectedDistrict || !selectedBlock}>
            Submit
          </button>
        </div>
      </form>

      {selectedDistrict && selectedBlock && (
        <div style={{ marginTop: 12 }}>
          <button onClick={downloadSimpleList} style={{ backgroundColor: "#dfefff", color: "#000", padding: "8px 12px", borderRadius: 4 }}>
            Download School Lists
          </button>
        </div>
      )}

      {submitted && (
        <div style={{ marginTop: 18 }}>
          {filteredSchools.length ? (
            <div>
              <p>
                Found <strong>{filteredSchools.length}</strong> schools in <strong>{selectedBlock?.value}</strong> block.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={generatePDF}>Download BLC Student Signature Form</button>
                <button onClick={downloadBlankTemplate} style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
                  Download Blank Template
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>No schools found for the selected district & block.</p>
              <div style={{ marginTop: "10px" }}>
                <button onClick={downloadBlankTemplate} style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
                  Download BLC Blank Template
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Always show blank template download button even before submission */}
      {!submitted && (
        <div style={{ marginTop: 18 }}>
          <button onClick={downloadBlankTemplate} style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
            Download Blank Template
          </button>
        </div>
      )}
    </div>
  );
};

export default BLCStudentSignatureForm;
