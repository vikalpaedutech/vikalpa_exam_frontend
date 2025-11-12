// // src/components/PrincipalSchoolsAbrcDataCollection.jsx
// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";
// import { updateAbrcPrincipal as updateAbrcPrincipalService } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService";

// const phoneIsValid = (val) => /^\d{10}$/.test(String(val).trim() || "");

// export const BLCStudentSignatureForm = () => {
//   const { userData } = useContext(UserContext) || {};
//   const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};


// console.log(districtBlockSchoolData)

//   return (
//     <div style={{ padding: 16 }}>
     
//     </div>
//   );
// };



import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { UserContext } from "../NewContextApis/UserContext";
import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi";

// This component renders two dependent selects (District -> Block), a submit button
// and — after submitting — a "Download Form" button which generates a PDF using jsPDF.
// The PDF lists every school in the selected block and creates 6 blank rows per school
// (3 students class 8, 3 students class 10) so the proctor can collect SRN, name, father's name, school code and signature.

export const BLCStudentSignatureForm = () => {
  const { userData } = useContext(UserContext) || {};
  const { districtBlockSchoolData = [], loadingDBS } = useDistrictBlockSchool() || {};

  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState([]);

  // build district options from fetched data
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return;
    const districtsMap = new Map();
    districtBlockSchoolData.forEach((row) => {
      const key = `${row.districtId}::${row.districtName}`;
      if (!districtsMap.has(key)) districtsMap.set(key, { value: row.districtName, label: row.districtName, id: row.districtId });
    });
    setDistrictOptions(Array.from(districtsMap.values()));
  }, [districtBlockSchoolData]);

  // when district changes compute blocks available in that district
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
    // filter schools for the selected district/block
    const schools = districtBlockSchoolData.filter(
      (r) => r.districtName === selectedDistrict?.value && r.blockName === selectedBlock?.value
    );
    setFilteredSchools(schools);
  };

  const generatePDF = () => {
    if (!selectedDistrict || !selectedBlock) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const lineHeight = 14;

    const title = "Top Center Header"; // change this if you want a custom top header

    filteredSchools.forEach((school, schoolIndex) => {
      // header
      doc.setFontSize(14);
      doc.text(title, pageWidth / 2, margin, { align: "center" });
      doc.setFontSize(12);
      doc.text(`District: ${selectedDistrict.value}`, margin, margin + 30);
      doc.text(`Block: ${selectedBlock.value}`, margin, margin + 30 + lineHeight);

      // school subheader
      doc.setFontSize(11);
      doc.text(`School: ${school.centerName}`, margin, margin + 30 + lineHeight * 3);

      // prepare table rows: 6 rows (1..6). 1-3 => class 8, 4-6 => class 10
      const rows = [];
      for (let i = 1; i <= 6; i++) {
        const cls = i <= 3 ? "8" : "10";
        rows.push([
          String(i),
          cls,
          "", // SRN
          "", // Student Name
          "", // Father Name
          school.centerId || "", // school code
          "" // signature
        ]);
      }

      // autoTable column headers and styles
      doc.autoTable({
        startY: margin + 30 + lineHeight * 4,
        head: [["#", "Class", "SRN", "Student Name", "Father Name", "School Code", "Signature"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [200, 200, 200] },
        styles: { cellPadding: 6, fontSize: 10 },
        margin: { left: margin, right: margin },
        willDrawCell: function (data) {
          // optional: could add custom drawing for signature column if needed
        }
      });

      // after table, add space for principal/ABRC sign or notes
      const afterY = doc.lastAutoTable.finalY || margin + 300;
      doc.setFontSize(10);
      doc.text("Prepared by: ____________________", margin, afterY + 30);
      doc.text("ABRC/Principal Signature: ____________________", margin, afterY + 50);

      // add a page if not the last school
      if (schoolIndex < filteredSchools.length - 1) doc.addPage();
    });

    // final download
    const filename = `${selectedDistrict.value}_${selectedBlock.value}_student_sign_list.pdf`.replace(/\s+/g, "_");
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

      {submitted && (
        <div style={{ marginTop: 18 }}>
          {filteredSchools.length ? (
            <div>
              <p>
                Found <strong>{filteredSchools.length}</strong> schools in <strong>{selectedBlock?.value}</strong> block.
              </p>
              <button onClick={generatePDF}>Download Form</button>
            </div>
          ) : (
            <p>No schools found for the selected district & block.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BLCStudentSignatureForm;
