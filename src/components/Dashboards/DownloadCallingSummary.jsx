// import React, {useState, useEffect, useContext} from "react";
// import { getCallSummary } from "../../services/DashBoardServices/DashboardService";



// export const GetCallSummary = () => {





//     return (
//         <>
//         <h1>Call summary download</h1>
//         </>
//     )
// }








// import React, { useState, useEffect, useContext } from "react";
// import { getCallSummary } from "../../services/DashBoardServices/DashboardService";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export const GetCallSummary = () => {
//   const [formData, setFormData] = useState({
//     callMadeTo: "Principal",
//     startDate: "",
//     endDate: "",
//     districtId: "",
//     blockId: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [summaryData, setSummaryData] = useState(null);
//   const [error, setError] = useState("");

//   const callMadeToOptions = ["Principal", "ABRC", "BEO", "DEO"];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
    
//     try {
//       const response = await getCallSummary(formData);
//       if (response.success) {
//         setSummaryData(response.data);
//       } else {
//         setError(response.message || "Failed to fetch data");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching call summary");
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = () => {
//     if (!summaryData) return;

//     const doc = new jsPDF();
    
//     // Title
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text(`Call Summary Report - ${summaryData.callMadeTo}`, 14, 15);
    
//     // Date Range and Filters
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Date Range: ${summaryData.dateRange.startDate} to ${summaryData.dateRange.endDate}`, 14, 25);
//     doc.text(`District: ${summaryData.filters.districtId || "All"} | Block: ${summaryData.filters.blockId || "All"}`, 14, 32);
    
//     // Overall Summary
//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Overall Summary:", 14, 45);
    
//     doc.setFontSize(10);
//     const overall = summaryData.overallSummary;
//     doc.text(`Total Persons: ${overall.totalPersons}`, 14, 55);
//     doc.text(`Unique Contacts: ${overall.uniqueContacts}`, 14, 62);
//     doc.text(`Total Calls Assigned: ${overall.totalAssigned}`, 14, 69);
//     doc.text(`Connected Calls: ${overall.connected}`, 14, 76);
//     doc.text(`Not Connected Calls: ${overall.notConnected}`, 14, 83);
//     doc.text(`Pending Calls: ${overall.pending}`, 14, 90);
    
//     // Detailed Table
//     const tableColumn = [
//       "Caller Name", 
//       "District", 
//       "Block", 
//       "Total Assigned", 
//       "Connected", 
//       "Not Connected", 
//       "Pending"
//     ];
    
//     const tableRows = [];
    
//     summaryData.summaryByDistrictBlock.forEach(districtBlock => {
//       districtBlock.assignedCallers.forEach(caller => {
//         // Skip the placeholder "No caller assigned"
//         if (caller.userName === "No caller assigned") return;
        
//         tableRows.push([
//           caller.userName,
//           districtBlock.districtName || districtBlock.districtId,
//           districtBlock.blockName || districtBlock.blockId,
//           districtBlock.summary.calls.totalAssigned.toString(),
//           districtBlock.summary.calls.connected.toString(),
//           districtBlock.summary.calls.notConnected.toString(),
//           districtBlock.summary.calls.pending.toString()
//         ]);
//       });
      
//       // If no assigned callers, still show the district-block data
//       if (districtBlock.assignedCallers.length === 0 || 
//           (districtBlock.assignedCallers.length === 1 && 
//            districtBlock.assignedCallers[0].userName === "No caller assigned")) {
//         tableRows.push([
//           "Not Assigned",
//           districtBlock.districtName || districtBlock.districtId,
//           districtBlock.blockName || districtBlock.blockId,
//           districtBlock.summary.calls.totalAssigned.toString(),
//           districtBlock.summary.calls.connected.toString(),
//           districtBlock.summary.calls.notConnected.toString(),
//           districtBlock.summary.calls.pending.toString()
//         ]);
//       }
//     });

//     // Add table to PDF
//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 100,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 245, 245] }
//     });

//     // Footer
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(150, 150, 150);
//       doc.text(
//         `Page ${i} of ${pageCount} | Generated on: ${new Date().toLocaleDateString()}`,
//         doc.internal.pageSize.width / 2,
//         doc.internal.pageSize.height - 10,
//         { align: 'center' }
//       );
//     }

//     // Save the PDF
//     doc.save(`call-summary-${summaryData.callMadeTo}-${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <h1 style={{ color: "#2c3e50", marginBottom: "30px", textAlign: "center" }}>
//         Call Summary Report
//       </h1>

//       {/* Form Section */}
//       <div style={{ 
//         backgroundColor: "#f8f9fa", 
//         padding: "20px", 
//         borderRadius: "8px", 
//         marginBottom: "30px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//       }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ 
//             display: "grid", 
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
//             gap: "15px",
//             alignItems: "end"
//           }}>
//             {/* Call Made To */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 Call Made To *
//               </label>
//               <select
//                 name="callMadeTo"
//                 value={formData.callMadeTo}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               >
//                 {callMadeToOptions.map(option => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Start Date */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* End Date */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* District ID */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 District ID
//               </label>
//               <input
//                 type="text"
//                 name="districtId"
//                 value={formData.districtId}
//                 onChange={handleInputChange}
//                 placeholder="Enter District ID"
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* Block ID */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 Block ID
//               </label>
//               <input
//                 type="text"
//                 name="blockId"
//                 value={formData.blockId}
//                 onChange={handleInputChange}
//                 placeholder="Enter Block ID"
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   width: "100%",
//                   padding: "10px 20px",
//                   backgroundColor: loading ? "#95a5a6" : "#3498db",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   transition: "background-color 0.3s"
//                 }}
//                 onMouseOver={(e) => {
//                   if (!loading) e.target.style.backgroundColor = "#2980b9";
//                 }}
//                 onMouseOut={(e) => {
//                   if (!loading) e.target.style.backgroundColor = "#3498db";
//                 }}
//               >
//                 {loading ? "Loading..." : "Get Call Summary"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div style={{
//           backgroundColor: "#e74c3c",
//           color: "white",
//           padding: "15px",
//           borderRadius: "4px",
//           marginBottom: "20px",
//           textAlign: "center"
//         }}>
//           {error}
//         </div>
//       )}

//       {/* Download Button */}
//       {summaryData && (
//         <div style={{ textAlign: "center", marginBottom: "30px" }}>
//           <button
//             onClick={downloadPDF}
//             style={{
//               padding: "12px 30px",
//               backgroundColor: "#27ae60",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "background-color 0.3s"
//             }}
//             onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
//             onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
//           >
//             📄 Download PDF Report
//           </button>
//         </div>
//       )}

//       {/* Data Preview */}
//       {summaryData && (
//         <div style={{ 
//           backgroundColor: "white", 
//           padding: "20px", 
//           borderRadius: "8px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//         }}>
//           <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Data Preview</h3>
          
//           {/* Overall Summary */}
//           <div style={{ 
//             backgroundColor: "#ecf0f1", 
//             padding: "15px", 
//             borderRadius: "4px",
//             marginBottom: "20px"
//           }}>
//             <h4 style={{ color: "#34495e", marginBottom: "10px" }}>Overall Summary</h4>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//               <div><strong>Total Persons:</strong> {summaryData.overallSummary.totalPersons}</div>
//               <div><strong>Unique Contacts:</strong> {summaryData.overallSummary.uniqueContacts}</div>
//               <div><strong>Total Assigned:</strong> {summaryData.overallSummary.totalAssigned}</div>
//               <div><strong>Connected:</strong> {summaryData.overallSummary.connected}</div>
//               <div><strong>Not Connected:</strong> {summaryData.overallSummary.notConnected}</div>
//               <div><strong>Pending:</strong> {summaryData.overallSummary.pending}</div>
//             </div>
//           </div>

//           {/* Detailed Table */}
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ 
//               width: "100%", 
//               borderCollapse: "collapse",
//               fontSize: "14px"
//             }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#34495e", color: "white" }}>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Caller Name</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>District</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Block</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Total Assigned</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Connected</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Not Connected</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Pending</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {summaryData.summaryByDistrictBlock.map((districtBlock, index) => (
//                   districtBlock.assignedCallers.map((caller, callerIndex) => (
//                     <tr 
//                       key={`${index}-${callerIndex}`}
//                       style={{ 
//                         backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
//                         borderBottom: "1px solid #e9ecef"
//                       }}
//                     >
//                       <td style={{ padding: "12px" }}>{caller.userName}</td>
//                       <td style={{ padding: "12px" }}>{districtBlock.districtName}</td>
//                       <td style={{ padding: "12px" }}>{districtBlock.blockName}</td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.totalAssigned}</td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.connected}</td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.notConnected}</td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.pending}</td>
//                     </tr>
//                   ))
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };







// import React, { useState, useEffect, useContext } from "react";
// import { getCallSummary } from "../../services/DashBoardServices/DashboardService";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from 'xlsx';

// export const GetCallSummary = () => {
//   const [formData, setFormData] = useState({
//     callMadeTo: "Principal",
//     startDate: "",
//     endDate: "",
//     districtId: "",
//     blockId: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [summaryData, setSummaryData] = useState(null);
//   const [error, setError] = useState("");

//   const callMadeToOptions = ["Principal", "ABRC", "BEO", "DEO"];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
    
//     try {
//       const response = await getCallSummary(formData);
//       if (response.success) {
//         setSummaryData(response.data);
//       } else {
//         setError(response.message || "Failed to fetch data");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching call summary");
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = () => {
//     if (!summaryData) return;

//     const doc = new jsPDF();
    
//     // Title
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text(`Call Summary Report - ${summaryData.callMadeTo}`, 14, 15);
    
//     // Report Date
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
    
//     const startDate = new Date(summaryData.dateRange.startDate);
//     const endDate = new Date(summaryData.dateRange.endDate);
//     const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
//     const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    
//     if (diffDays === 1) {
//       doc.text(`Report Date: ${summaryData.dateRange.startDate}`, 14, 25);
//     } else {
//       doc.text(`Date Range: ${summaryData.dateRange.startDate} to ${summaryData.dateRange.endDate}`, 14, 25);
//     }
    
//     // Filters
//     doc.text(`District: ${summaryData.filters.districtId || "All"} | Block: ${summaryData.filters.blockId || "All"}`, 14, 32);
    
//     // Overall Summary
//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Overall Summary:", 14, 45);
    
//     doc.setFontSize(10);
//     const overall = summaryData.overallSummary;
//     doc.text(`Total Persons: ${overall.totalPersons}`, 14, 55);
//     doc.text(`Unique Contacts: ${overall.uniqueContacts}`, 14, 62);
//     doc.text(`Total Calls Assigned: ${overall.totalAssigned}`, 14, 69);
//     doc.text(`Connected Calls: ${overall.connected}`, 14, 76);
//     doc.text(`Not Connected Calls: ${overall.notConnected}`, 14, 83);
//     doc.text(`Pending Calls: ${overall.pending}`, 14, 90);
    
//     // Detailed Table
//     const baseColumns = formData.callMadeTo === "BEO" 
//       ? [
//           "S.No",
//           "Caller Name", 
//           "District", 
//           "Total Assigned", 
//           "Connected", 
//           "Not Connected", 
//           "Pending"
//         ]
//       : [
//           "S.No",
//           "Caller Name", 
//           "District", 
//           "Block", 
//           "Total Assigned", 
//           "Connected", 
//           "Not Connected", 
//           "Pending"
//         ];
    
//     const tableRows = [];
//     let grandTotalAssigned = 0;
//     let grandTotalConnected = 0;
//     let grandTotalNotConnected = 0;
//     let grandTotalPending = 0;
//     let serialNumber = 1;
    
//     if (formData.callMadeTo === "BEO") {
//       // For BEO, group by district and sum the calls but keep caller names
//       const districtCallerMap = {};
      
//       summaryData.summaryByDistrictBlock.forEach(districtBlock => {
//         const districtName = districtBlock.districtName || districtBlock.districtId;
        
//         districtBlock.assignedCallers.forEach(caller => {
//           // Skip the placeholder "No caller assigned"
//           if (caller.userName === "No caller assigned") return;
          
//           const key = `${districtName}_${caller.userName}`;
          
//           if (!districtCallerMap[key]) {
//             districtCallerMap[key] = {
//               callerName: caller.userName,
//               districtName: districtName,
//               totalAssigned: 0,
//               connected: 0,
//               notConnected: 0,
//               pending: 0
//             };
//           }
          
//           districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
//           districtCallerMap[key].connected += districtBlock.summary.calls.connected;
//           districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
//           districtCallerMap[key].pending += districtBlock.summary.calls.pending;
//         });
        
//         // If no assigned callers, still show the district data
//         if (districtBlock.assignedCallers.length === 0 || 
//             (districtBlock.assignedCallers.length === 1 && 
//              districtBlock.assignedCallers[0].userName === "No caller assigned")) {
//           const key = `${districtName}_Not Assigned`;
          
//           if (!districtCallerMap[key]) {
//             districtCallerMap[key] = {
//               callerName: "Not Assigned",
//               districtName: districtName,
//               totalAssigned: 0,
//               connected: 0,
//               notConnected: 0,
//               pending: 0
//             };
//           }
          
//           districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
//           districtCallerMap[key].connected += districtBlock.summary.calls.connected;
//           districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
//           districtCallerMap[key].pending += districtBlock.summary.calls.pending;
//         }
//       });
      
//       // Convert to table rows
//       Object.values(districtCallerMap).forEach(callerData => {
//         tableRows.push([
//           serialNumber.toString(),
//           callerData.callerName,
//           callerData.districtName,
//           callerData.totalAssigned.toString(),
//           callerData.connected.toString(),
//           callerData.notConnected.toString(),
//           callerData.pending.toString()
//         ]);
        
//         grandTotalAssigned += callerData.totalAssigned;
//         grandTotalConnected += callerData.connected;
//         grandTotalNotConnected += callerData.notConnected;
//         grandTotalPending += callerData.pending;
//         serialNumber++;
//       });
//     } else {
//       // For Principal, ABRC, DEO - keep original logic
//       summaryData.summaryByDistrictBlock.forEach(districtBlock => {
//         districtBlock.assignedCallers.forEach(caller => {
//           // Skip the placeholder "No caller assigned"
//           if (caller.userName === "No caller assigned") return;
          
//           tableRows.push([
//             serialNumber.toString(),
//             caller.userName,
//             districtBlock.districtName || districtBlock.districtId,
//             districtBlock.blockName || districtBlock.blockId,
//             districtBlock.summary.calls.totalAssigned.toString(),
//             districtBlock.summary.calls.connected.toString(),
//             districtBlock.summary.calls.notConnected.toString(),
//             districtBlock.summary.calls.pending.toString()
//           ]);
          
//           grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
//           grandTotalConnected += districtBlock.summary.calls.connected;
//           grandTotalNotConnected += districtBlock.summary.calls.notConnected;
//           grandTotalPending += districtBlock.summary.calls.pending;
//           serialNumber++;
//         });
        
//         // If no assigned callers, still show the district-block data
//         if (districtBlock.assignedCallers.length === 0 || 
//             (districtBlock.assignedCallers.length === 1 && 
//              districtBlock.assignedCallers[0].userName === "No caller assigned")) {
//           tableRows.push([
//             serialNumber.toString(),
//             "Not Assigned",
//             districtBlock.districtName || districtBlock.districtId,
//             districtBlock.blockName || districtBlock.blockId,
//             districtBlock.summary.calls.totalAssigned.toString(),
//             districtBlock.summary.calls.connected.toString(),
//             districtBlock.summary.calls.notConnected.toString(),
//             districtBlock.summary.calls.pending.toString()
//           ]);
          
//           grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
//           grandTotalConnected += districtBlock.summary.calls.connected;
//           grandTotalNotConnected += districtBlock.summary.calls.notConnected;
//           grandTotalPending += districtBlock.summary.calls.pending;
//           serialNumber++;
//         }
//       });
//     }

//     // Add grand total row
//     if (formData.callMadeTo === "BEO") {
//       tableRows.push([
//         "",
//         "GRAND TOTAL",
//         "",
//         grandTotalAssigned.toString(),
//         grandTotalConnected.toString(),
//         grandTotalNotConnected.toString(),
//         grandTotalPending.toString()
//       ]);
//     } else {
//       tableRows.push([
//         "",
//         "GRAND TOTAL",
//         "",
//         "",
//         grandTotalAssigned.toString(),
//         grandTotalConnected.toString(),
//         grandTotalNotConnected.toString(),
//         grandTotalPending.toString()
//       ]);
//     }

//     // Add table to PDF
//     doc.autoTable({
//       head: [baseColumns],
//       body: tableRows,
//       startY: 100,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 245, 245] },
//       willDrawCell: function (data) {
//         // Style the grand total row
//         if (data.row.index === tableRows.length - 1) {
//           doc.setFillColor(41, 128, 185);
//           doc.setTextColor(255, 255, 255);
//           doc.setFont(undefined, 'bold');
//         }
//       }
//     });

//     // Footer
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(150, 150, 150);
//       doc.text(
//         `Page ${i} of ${pageCount} | Generated on: ${new Date().toLocaleDateString()}`,
//         doc.internal.pageSize.width / 2,
//         doc.internal.pageSize.height - 10,
//         { align: 'center' }
//       );
//     }

//     // Save the PDF
//     doc.save(`call-summary-${summaryData.callMadeTo}-${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   const downloadExcel = () => {
//     if (!summaryData) return;

//     const workbook = XLSX.utils.book_new();
    
//     // Prepare data for Excel
//     const baseColumns = formData.callMadeTo === "BEO" 
//       ? [
//           "S.No",
//           "Caller Name", 
//           "District", 
//           "Total Assigned", 
//           "Connected", 
//           "Not Connected", 
//           "Pending"
//         ]
//       : [
//           "S.No",
//           "Caller Name", 
//           "District", 
//           "Block", 
//           "Total Assigned", 
//           "Connected", 
//           "Not Connected", 
//           "Pending"
//         ];
    
//     const excelData = [baseColumns];
//     let serialNumber = 1;
//     let grandTotalAssigned = 0;
//     let grandTotalConnected = 0;
//     let grandTotalNotConnected = 0;
//     let grandTotalPending = 0;
    
//     if (formData.callMadeTo === "BEO") {
//       // For BEO, group by district and sum the calls but keep caller names
//       const districtCallerMap = {};
      
//       summaryData.summaryByDistrictBlock.forEach(districtBlock => {
//         const districtName = districtBlock.districtName || districtBlock.districtId;
        
//         districtBlock.assignedCallers.forEach(caller => {
//           // Skip the placeholder "No caller assigned"
//           if (caller.userName === "No caller assigned") return;
          
//           const key = `${districtName}_${caller.userName}`;
          
//           if (!districtCallerMap[key]) {
//             districtCallerMap[key] = {
//               callerName: caller.userName,
//               districtName: districtName,
//               totalAssigned: 0,
//               connected: 0,
//               notConnected: 0,
//               pending: 0
//             };
//           }
          
//           districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
//           districtCallerMap[key].connected += districtBlock.summary.calls.connected;
//           districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
//           districtCallerMap[key].pending += districtBlock.summary.calls.pending;
//         });
        
//         // If no assigned callers, still show the district data
//         if (districtBlock.assignedCallers.length === 0 || 
//             (districtBlock.assignedCallers.length === 1 && 
//              districtBlock.assignedCallers[0].userName === "No caller assigned")) {
//           const key = `${districtName}_Not Assigned`;
          
//           if (!districtCallerMap[key]) {
//             districtCallerMap[key] = {
//               callerName: "Not Assigned",
//               districtName: districtName,
//               totalAssigned: 0,
//               connected: 0,
//               notConnected: 0,
//               pending: 0
//             };
//           }
          
//           districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
//           districtCallerMap[key].connected += districtBlock.summary.calls.connected;
//           districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
//           districtCallerMap[key].pending += districtBlock.summary.calls.pending;
//         }
//       });
      
//       // Convert to excel rows
//       Object.values(districtCallerMap).forEach(callerData => {
//         excelData.push([
//           serialNumber,
//           callerData.callerName,
//           callerData.districtName,
//           callerData.totalAssigned,
//           callerData.connected,
//           callerData.notConnected,
//           callerData.pending
//         ]);
        
//         grandTotalAssigned += callerData.totalAssigned;
//         grandTotalConnected += callerData.connected;
//         grandTotalNotConnected += callerData.notConnected;
//         grandTotalPending += callerData.pending;
//         serialNumber++;
//       });
//     } else {
//       // For Principal, ABRC, DEO - keep original logic
//       summaryData.summaryByDistrictBlock.forEach(districtBlock => {
//         districtBlock.assignedCallers.forEach(caller => {
//           // Skip the placeholder "No caller assigned"
//           if (caller.userName === "No caller assigned") return;
          
//           excelData.push([
//             serialNumber,
//             caller.userName,
//             districtBlock.districtName || districtBlock.districtId,
//             districtBlock.blockName || districtBlock.blockId,
//             districtBlock.summary.calls.totalAssigned,
//             districtBlock.summary.calls.connected,
//             districtBlock.summary.calls.notConnected,
//             districtBlock.summary.calls.pending
//           ]);
          
//           grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
//           grandTotalConnected += districtBlock.summary.calls.connected;
//           grandTotalNotConnected += districtBlock.summary.calls.notConnected;
//           grandTotalPending += districtBlock.summary.calls.pending;
//           serialNumber++;
//         });
        
//         // If no assigned callers, still show the district-block data
//         if (districtBlock.assignedCallers.length === 0 || 
//             (districtBlock.assignedCallers.length === 1 && 
//              districtBlock.assignedCallers[0].userName === "No caller assigned")) {
//           excelData.push([
//             serialNumber,
//             "Not Assigned",
//             districtBlock.districtName || districtBlock.districtId,
//             districtBlock.blockName || districtBlock.blockId,
//             districtBlock.summary.calls.totalAssigned,
//             districtBlock.summary.calls.connected,
//             districtBlock.summary.calls.notConnected,
//             districtBlock.summary.calls.pending
//           ]);
          
//           grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
//           grandTotalConnected += districtBlock.summary.calls.connected;
//           grandTotalNotConnected += districtBlock.summary.calls.notConnected;
//           grandTotalPending += districtBlock.summary.calls.pending;
//           serialNumber++;
//         }
//       });
//     }

//     // Add grand total row
//     if (formData.callMadeTo === "BEO") {
//       excelData.push([
//         "",
//         "GRAND TOTAL",
//         "",
//         grandTotalAssigned,
//         grandTotalConnected,
//         grandTotalNotConnected,
//         grandTotalPending
//       ]);
//     } else {
//       excelData.push([
//         "",
//         "GRAND TOTAL",
//         "",
//         "",
//         grandTotalAssigned,
//         grandTotalConnected,
//         grandTotalNotConnected,
//         grandTotalPending
//       ]);
//     }

//     const worksheet = XLSX.utils.aoa_to_sheet(excelData);
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Call Summary");
    
//     // Save the Excel file
//     XLSX.writeFile(workbook, `call-summary-${summaryData.callMadeTo}-${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <h1 style={{ color: "#2c3e50", marginBottom: "30px", textAlign: "center" }}>
//         Call Summary Report
//       </h1>

//       {/* Form Section */}
//       <div style={{ 
//         backgroundColor: "#f8f9fa", 
//         padding: "20px", 
//         borderRadius: "8px", 
//         marginBottom: "30px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//       }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ 
//             display: "grid", 
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
//             gap: "15px",
//             alignItems: "end"
//           }}>
//             {/* Call Made To */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 Call Made To *
//               </label>
//               <select
//                 name="callMadeTo"
//                 value={formData.callMadeTo}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               >
//                 {callMadeToOptions.map(option => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Start Date */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* End Date */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* District ID */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 District ID
//               </label>
//               <input
//                 type="text"
//                 name="districtId"
//                 value={formData.districtId}
//                 onChange={handleInputChange}
//                 placeholder="Enter District ID"
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* Block ID */}
//             <div>
//               <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
//                 Block ID
//               </label>
//               <input
//                 type="text"
//                 name="blockId"
//                 value={formData.blockId}
//                 onChange={handleInputChange}
//                 placeholder="Enter Block ID"
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #bdc3c7",
//                   borderRadius: "4px",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   width: "100%",
//                   padding: "10px 20px",
//                   backgroundColor: loading ? "#95a5a6" : "#3498db",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   transition: "background-color 0.3s"
//                 }}
//                 onMouseOver={(e) => {
//                   if (!loading) e.target.style.backgroundColor = "#2980b9";
//                 }}
//                 onMouseOut={(e) => {
//                   if (!loading) e.target.style.backgroundColor = "#3498db";
//                 }}
//               >
//                 {loading ? "Loading..." : "Get Call Summary"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div style={{
//           backgroundColor: "#e74c3c",
//           color: "white",
//           padding: "15px",
//           borderRadius: "4px",
//           marginBottom: "20px",
//           textAlign: "center"
//         }}>
//           {error}
//         </div>
//       )}

//       {/* Download Buttons */}
//       {summaryData && (
//         <div style={{ textAlign: "center", marginBottom: "30px", display: "flex", gap: "15px", justifyContent: "center" }}>
//           <button
//             onClick={downloadPDF}
//             style={{
//               padding: "12px 30px",
//               backgroundColor: "#27ae60",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "background-color 0.3s"
//             }}
//             onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
//             onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
//           >
//             📄 Download PDF Report
//           </button>
//           <button
//             onClick={downloadExcel}
//             style={{
//               padding: "12px 30px",
//               backgroundColor: "#2980b9",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "background-color 0.3s"
//             }}
//             onMouseOver={(e) => e.target.style.backgroundColor = "#2471a3"}
//             onMouseOut={(e) => e.target.style.backgroundColor = "#2980b9"}
//           >
//             📊 Download Excel Report
//           </button>
//         </div>
//       )}

//       {/* Data Preview */}
//       {summaryData && (
//         <div style={{ 
//           backgroundColor: "white", 
//           padding: "20px", 
//           borderRadius: "8px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//         }}>
//           <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Data Preview</h3>
          
//           {/* Overall Summary */}
//           <div style={{ 
//             backgroundColor: "#ecf0f1", 
//             padding: "15px", 
//             borderRadius: "4px",
//             marginBottom: "20px"
//           }}>
//             <h4 style={{ color: "#34495e", marginBottom: "10px" }}>Overall Summary</h4>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//               <div><strong>Total Persons:</strong> {summaryData.overallSummary.totalPersons}</div>
//               <div><strong>Unique Contacts:</strong> {summaryData.overallSummary.uniqueContacts}</div>
//               <div><strong>Total Assigned:</strong> {summaryData.overallSummary.totalAssigned}</div>
//               <div><strong>Connected:</strong> {summaryData.overallSummary.connected}</div>
//               <div><strong>Not Connected:</strong> {summaryData.overallSummary.notConnected}</div>
//               <div><strong>Pending:</strong> {summaryData.overallSummary.pending}</div>
//             </div>
//           </div>

//           {/* Detailed Table */}
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ 
//               width: "100%", 
//               borderCollapse: "collapse",
//               fontSize: "14px"
//             }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#34495e", color: "white" }}>
//                   {formData.callMadeTo === "BEO" ? (
//                     <>
//                       <th style={{ padding: "12px", textAlign: "left" }}>S.No</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Caller Name</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>District</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Total Assigned</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Connected</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Not Connected</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Pending</th>
//                     </>
//                   ) : (
//                     <>
//                       <th style={{ padding: "12px", textAlign: "left" }}>S.No</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Caller Name</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>District</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Block</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Total Assigned</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Connected</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Not Connected</th>
//                       <th style={{ padding: "12px", textAlign: "center" }}>Pending</th>
//                     </>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {formData.callMadeTo === "BEO" ? (
//                   // For BEO - show district wise summary with caller names
//                   (() => {
//                     const districtCallerMap = {};
//                     let serialNumber = 1;
                    
//                     summaryData.summaryByDistrictBlock.forEach(districtBlock => {
//                       const districtName = districtBlock.districtName || districtBlock.districtId;
                      
//                       districtBlock.assignedCallers.forEach(caller => {
//                         // Skip the placeholder "No caller assigned"
//                         if (caller.userName === "No caller assigned") return;
                        
//                         const key = `${districtName}_${caller.userName}`;
                        
//                         if (!districtCallerMap[key]) {
//                           districtCallerMap[key] = {
//                             serialNumber: serialNumber++,
//                             callerName: caller.userName,
//                             districtName: districtName,
//                             totalAssigned: 0,
//                             connected: 0,
//                             notConnected: 0,
//                             pending: 0
//                           };
//                         }
                        
//                         districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
//                         districtCallerMap[key].connected += districtBlock.summary.calls.connected;
//                         districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
//                         districtCallerMap[key].pending += districtBlock.summary.calls.pending;
//                       });
                      
//                       // If no assigned callers, still show the district data
//                       if (districtBlock.assignedCallers.length === 0 || 
//                           (districtBlock.assignedCallers.length === 1 && 
//                            districtBlock.assignedCallers[0].userName === "No caller assigned")) {
//                         const key = `${districtName}_Not Assigned`;
                        
//                         if (!districtCallerMap[key]) {
//                           districtCallerMap[key] = {
//                             serialNumber: serialNumber++,
//                             callerName: "Not Assigned",
//                             districtName: districtName,
//                             totalAssigned: 0,
//                             connected: 0,
//                             notConnected: 0,
//                             pending: 0
//                           };
//                         }
                        
//                         districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
//                         districtCallerMap[key].connected += districtBlock.summary.calls.connected;
//                         districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
//                         districtCallerMap[key].pending += districtBlock.summary.calls.pending;
//                       }
//                     });
                    
//                     return Object.values(districtCallerMap).map((callerData, index) => (
//                       <tr 
//                         key={`${callerData.districtName}_${callerData.callerName}`}
//                         style={{ 
//                           backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
//                           borderBottom: "1px solid #e9ecef"
//                         }}
//                       >
//                         <td style={{ padding: "12px" }}>{callerData.serialNumber}</td>
//                         <td style={{ padding: "12px" }}>{callerData.callerName}</td>
//                         <td style={{ padding: "12px" }}>{callerData.districtName}</td>
//                         <td style={{ padding: "12px", textAlign: "center" }}>{callerData.totalAssigned}</td>
//                         <td style={{ padding: "12px", textAlign: "center" }}>{callerData.connected}</td>
//                         <td style={{ padding: "12px", textAlign: "center" }}>{callerData.notConnected}</td>
//                         <td style={{ padding: "12px", textAlign: "center" }}>{callerData.pending}</td>
//                       </tr>
//                     ));
//                   })()
//                 ) : (
//                   // For Principal, ABRC, DEO - keep original logic
//                   (() => {
//                     let serialNumber = 1;
//                     return summaryData.summaryByDistrictBlock.map((districtBlock, index) => (
//                       districtBlock.assignedCallers.map((caller, callerIndex) => (
//                         <tr 
//                           key={`${index}-${callerIndex}`}
//                           style={{ 
//                             backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
//                             borderBottom: "1px solid #e9ecef"
//                           }}
//                         >
//                           <td style={{ padding: "12px" }}>{serialNumber++}</td>
//                           <td style={{ padding: "12px" }}>{caller.userName}</td>
//                           <td style={{ padding: "12px" }}>{districtBlock.districtName}</td>
//                           <td style={{ padding: "12px" }}>{districtBlock.blockName}</td>
//                           <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.totalAssigned}</td>
//                           <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.connected}</td>
//                           <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.notConnected}</td>
//                           <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.pending}</td>
//                         </tr>
//                       ))
//                     ));
//                   })()
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };







import React, { useState, useEffect, useContext } from "react";
import { getCallSummary } from "../../services/DashBoardServices/DashboardService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

export const GetCallSummary = () => {
  const [formData, setFormData] = useState({
    callMadeTo: "Principal",
    startDate: "",
    endDate: "",
    districtId: "",
    blockId: ""
  });
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState("");

  const callMadeToOptions = ["Principal", "ABRC", "BEO", "DEO"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await getCallSummary(formData);
      if (response.success) {
        setSummaryData(response.data);
      } else {
        setError(response.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching call summary");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!summaryData) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`Call Summary Report - ${summaryData.callMadeTo}`, 14, 15);
    
    // Report Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    const startDate = new Date(summaryData.dateRange.startDate);
    const endDate = new Date(summaryData.dateRange.endDate);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    
    if (diffDays <= 1) {
      doc.text(`Report Date: ${summaryData.dateRange.startDate}`, 14, 25);
    } else {
      // Subtract one day from end date for display
      const displayEndDate = new Date(endDate);
      displayEndDate.setDate(displayEndDate.getDate() - 1);
      const formattedEndDate = displayEndDate.toISOString().split('T')[0];
      doc.text(`Date Range: ${summaryData.dateRange.startDate} to ${formattedEndDate}`, 14, 25);
    }
    
    // Detailed Table
    const baseColumns = formData.callMadeTo === "BEO" 
      ? [
          "S.No",
          "Caller Name", 
          "District", 
          "Total Assigned", 
          "Connected", 
          "Not Connected", 
          "Pending"
        ]
      : [
          "S.No",
          "Caller Name", 
          "District", 
          "Block", 
          "Total Assigned", 
          "Connected", 
          "Not Connected", 
          "Pending"
        ];
    
    const tableRows = [];
    let grandTotalAssigned = 0;
    let grandTotalConnected = 0;
    let grandTotalNotConnected = 0;
    let grandTotalPending = 0;
    let serialNumber = 1;
    
    if (formData.callMadeTo === "BEO") {
      // For BEO, group by district and sum the calls but keep caller names
      const districtCallerMap = {};
      
      summaryData.summaryByDistrictBlock.forEach(districtBlock => {
        const districtName = districtBlock.districtName || districtBlock.districtId;
        
        districtBlock.assignedCallers.forEach(caller => {
          // Skip the placeholder "No caller assigned"
          if (caller.userName === "No caller assigned") return;
          
          const key = `${districtName}_${caller.userName}`;
          
          if (!districtCallerMap[key]) {
            districtCallerMap[key] = {
              callerName: caller.userName,
              districtName: districtName,
              totalAssigned: 0,
              connected: 0,
              notConnected: 0,
              pending: 0
            };
          }
          
          districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
          districtCallerMap[key].connected += districtBlock.summary.calls.connected;
          districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
          districtCallerMap[key].pending += districtBlock.summary.calls.pending;
        });
        
        // If no assigned callers, still show the district data
        if (districtBlock.assignedCallers.length === 0 || 
            (districtBlock.assignedCallers.length === 1 && 
             districtBlock.assignedCallers[0].userName === "No caller assigned")) {
          const key = `${districtName}_Not Assigned`;
          
          if (!districtCallerMap[key]) {
            districtCallerMap[key] = {
              callerName: "Not Assigned",
              districtName: districtName,
              totalAssigned: 0,
              connected: 0,
              notConnected: 0,
              pending: 0
            };
          }
          
          districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
          districtCallerMap[key].connected += districtBlock.summary.calls.connected;
          districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
          districtCallerMap[key].pending += districtBlock.summary.calls.pending;
        }
      });
      
      // Convert to table rows
      Object.values(districtCallerMap).forEach(callerData => {
        tableRows.push([
          serialNumber.toString(),
          callerData.callerName,
          callerData.districtName,
          callerData.totalAssigned.toString(),
          callerData.connected.toString(),
          callerData.notConnected.toString(),
          callerData.pending.toString()
        ]);
        
        grandTotalAssigned += callerData.totalAssigned;
        grandTotalConnected += callerData.connected;
        grandTotalNotConnected += callerData.notConnected;
        grandTotalPending += callerData.pending;
        serialNumber++;
      });
    } else {
      // For Principal, ABRC, DEO - keep original logic
      summaryData.summaryByDistrictBlock.forEach(districtBlock => {
        districtBlock.assignedCallers.forEach(caller => {
          // Skip the placeholder "No caller assigned"
          if (caller.userName === "No caller assigned") return;
          
          tableRows.push([
            serialNumber.toString(),
            caller.userName,
            districtBlock.districtName || districtBlock.districtId,
            districtBlock.blockName || districtBlock.blockId,
            districtBlock.summary.calls.totalAssigned.toString(),
            districtBlock.summary.calls.connected.toString(),
            districtBlock.summary.calls.notConnected.toString(),
            districtBlock.summary.calls.pending.toString()
          ]);
          
          grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
          grandTotalConnected += districtBlock.summary.calls.connected;
          grandTotalNotConnected += districtBlock.summary.calls.notConnected;
          grandTotalPending += districtBlock.summary.calls.pending;
          serialNumber++;
        });
        
        // If no assigned callers, still show the district-block data
        if (districtBlock.assignedCallers.length === 0 || 
            (districtBlock.assignedCallers.length === 1 && 
             districtBlock.assignedCallers[0].userName === "No caller assigned")) {
          tableRows.push([
            serialNumber.toString(),
            "Not Assigned",
            districtBlock.districtName || districtBlock.districtId,
            districtBlock.blockName || districtBlock.blockId,
            districtBlock.summary.calls.totalAssigned.toString(),
            districtBlock.summary.calls.connected.toString(),
            districtBlock.summary.calls.notConnected.toString(),
            districtBlock.summary.calls.pending.toString()
          ]);
          
          grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
          grandTotalConnected += districtBlock.summary.calls.connected;
          grandTotalNotConnected += districtBlock.summary.calls.notConnected;
          grandTotalPending += districtBlock.summary.calls.pending;
          serialNumber++;
        }
      });
    }

    // Add grand total row
    if (formData.callMadeTo === "BEO") {
      tableRows.push([
        "",
        "GRAND TOTAL",
        "",
        grandTotalAssigned.toString(),
        grandTotalConnected.toString(),
        grandTotalNotConnected.toString(),
        grandTotalPending.toString()
      ]);
    } else {
      tableRows.push([
        "",
        "GRAND TOTAL",
        "",
        "",
        grandTotalAssigned.toString(),
        grandTotalConnected.toString(),
        grandTotalNotConnected.toString(),
        grandTotalPending.toString()
      ]);
    }

    // Add table to PDF
    doc.autoTable({
      head: [baseColumns],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      willDrawCell: function (data) {
        // Style the grand total row
        if (data.row.index === tableRows.length - 1) {
          doc.setFillColor(41, 128, 185);
          doc.setTextColor(255, 255, 255);
          doc.setFont(undefined, 'bold');
        }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | Generated on: ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`call-summary-${summaryData.callMadeTo}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadExcel = () => {
    if (!summaryData) return;

    const workbook = XLSX.utils.book_new();
    
    // Prepare data for Excel
    const baseColumns = formData.callMadeTo === "BEO" 
      ? [
          "S.No",
          "Caller Name", 
          "District", 
          "Total Assigned", 
          "Connected", 
          "Not Connected", 
          "Pending"
        ]
      : [
          "S.No",
          "Caller Name", 
          "District", 
          "Block", 
          "Total Assigned", 
          "Connected", 
          "Not Connected", 
          "Pending"
        ];
    
    const excelData = [baseColumns];
    let serialNumber = 1;
    let grandTotalAssigned = 0;
    let grandTotalConnected = 0;
    let grandTotalNotConnected = 0;
    let grandTotalPending = 0;
    
    if (formData.callMadeTo === "BEO") {
      // For BEO, group by district and sum the calls but keep caller names
      const districtCallerMap = {};
      
      summaryData.summaryByDistrictBlock.forEach(districtBlock => {
        const districtName = districtBlock.districtName || districtBlock.districtId;
        
        districtBlock.assignedCallers.forEach(caller => {
          // Skip the placeholder "No caller assigned"
          if (caller.userName === "No caller assigned") return;
          
          const key = `${districtName}_${caller.userName}`;
          
          if (!districtCallerMap[key]) {
            districtCallerMap[key] = {
              callerName: caller.userName,
              districtName: districtName,
              totalAssigned: 0,
              connected: 0,
              notConnected: 0,
              pending: 0
            };
          }
          
          districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
          districtCallerMap[key].connected += districtBlock.summary.calls.connected;
          districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
          districtCallerMap[key].pending += districtBlock.summary.calls.pending;
        });
        
        // If no assigned callers, still show the district data
        if (districtBlock.assignedCallers.length === 0 || 
            (districtBlock.assignedCallers.length === 1 && 
             districtBlock.assignedCallers[0].userName === "No caller assigned")) {
          const key = `${districtName}_Not Assigned`;
          
          if (!districtCallerMap[key]) {
            districtCallerMap[key] = {
              callerName: "Not Assigned",
              districtName: districtName,
              totalAssigned: 0,
              connected: 0,
              notConnected: 0,
              pending: 0
            };
          }
          
          districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
          districtCallerMap[key].connected += districtBlock.summary.calls.connected;
          districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
          districtCallerMap[key].pending += districtBlock.summary.calls.pending;
        }
      });
      
      // Convert to excel rows
      Object.values(districtCallerMap).forEach(callerData => {
        excelData.push([
          serialNumber,
          callerData.callerName,
          callerData.districtName,
          callerData.totalAssigned,
          callerData.connected,
          callerData.notConnected,
          callerData.pending
        ]);
        
        grandTotalAssigned += callerData.totalAssigned;
        grandTotalConnected += callerData.connected;
        grandTotalNotConnected += callerData.notConnected;
        grandTotalPending += callerData.pending;
        serialNumber++;
      });
    } else {
      // For Principal, ABRC, DEO - keep original logic
      summaryData.summaryByDistrictBlock.forEach(districtBlock => {
        districtBlock.assignedCallers.forEach(caller => {
          // Skip the placeholder "No caller assigned"
          if (caller.userName === "No caller assigned") return;
          
          excelData.push([
            serialNumber,
            caller.userName,
            districtBlock.districtName || districtBlock.districtId,
            districtBlock.blockName || districtBlock.blockId,
            districtBlock.summary.calls.totalAssigned,
            districtBlock.summary.calls.connected,
            districtBlock.summary.calls.notConnected,
            districtBlock.summary.calls.pending
          ]);
          
          grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
          grandTotalConnected += districtBlock.summary.calls.connected;
          grandTotalNotConnected += districtBlock.summary.calls.notConnected;
          grandTotalPending += districtBlock.summary.calls.pending;
          serialNumber++;
        });
        
        // If no assigned callers, still show the district-block data
        if (districtBlock.assignedCallers.length === 0 || 
            (districtBlock.assignedCallers.length === 1 && 
             districtBlock.assignedCallers[0].userName === "No caller assigned")) {
          excelData.push([
            serialNumber,
            "Not Assigned",
            districtBlock.districtName || districtBlock.districtId,
            districtBlock.blockName || districtBlock.blockId,
            districtBlock.summary.calls.totalAssigned,
            districtBlock.summary.calls.connected,
            districtBlock.summary.calls.notConnected,
            districtBlock.summary.calls.pending
          ]);
          
          grandTotalAssigned += districtBlock.summary.calls.totalAssigned;
          grandTotalConnected += districtBlock.summary.calls.connected;
          grandTotalNotConnected += districtBlock.summary.calls.notConnected;
          grandTotalPending += districtBlock.summary.calls.pending;
          serialNumber++;
        }
      });
    }

    // Add grand total row
    if (formData.callMadeTo === "BEO") {
      excelData.push([
        "",
        "GRAND TOTAL",
        "",
        grandTotalAssigned,
        grandTotalConnected,
        grandTotalNotConnected,
        grandTotalPending
      ]);
    } else {
      excelData.push([
        "",
        "GRAND TOTAL",
        "",
        "",
        grandTotalAssigned,
        grandTotalConnected,
        grandTotalNotConnected,
        grandTotalPending
      ]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Summary");
    
    // Save the Excel file
    XLSX.writeFile(workbook, `call-summary-${summaryData.callMadeTo}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "30px", textAlign: "center" }}>
        Call Summary Report
      </h1>

      {/* Form Section */}
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "30px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "15px",
            alignItems: "end"
          }}>
            {/* Call Made To */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
                Call Made To *
              </label>
              <select
                name="callMadeTo"
                value={formData.callMadeTo}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bdc3c7",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              >
                {callMadeToOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bdc3c7",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bdc3c7",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            {/* District ID */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
                District ID
              </label>
              <input
                type="text"
                name="districtId"
                value={formData.districtId}
                onChange={handleInputChange}
                placeholder="Enter District ID"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bdc3c7",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            {/* Block ID */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#34495e" }}>
                Block ID
              </label>
              <input
                type="text"
                name="blockId"
                value={formData.blockId}
                onChange={handleInputChange}
                placeholder="Enter Block ID"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #bdc3c7",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  backgroundColor: loading ? "#95a5a6" : "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = "#2980b9";
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = "#3498db";
                }}
              >
                {loading ? "Loading..." : "Get Call Summary"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#e74c3c",
          color: "white",
          padding: "15px",
          borderRadius: "4px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {/* Download Buttons */}
      {summaryData && (
        <div style={{ textAlign: "center", marginBottom: "30px", display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={downloadPDF}
            style={{
              padding: "12px 30px",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
          >
            📄 Download PDF Report
          </button>
          <button
            onClick={downloadExcel}
            style={{
              padding: "12px 30px",
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#2471a3"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2980b9"}
          >
            📊 Download Excel Report
          </button>
        </div>
      )}

      {/* Data Preview */}
      {summaryData && (
        <div style={{ 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Data Preview</h3>

          {/* Detailed Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              fontSize: "14px"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#34495e", color: "white" }}>
                  {formData.callMadeTo === "BEO" ? (
                    <>
                      <th style={{ padding: "12px", textAlign: "left" }}>S.No</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Caller Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>District</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Total Assigned</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Connected</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Not Connected</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Pending</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: "12px", textAlign: "left" }}>S.No</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Caller Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>District</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Block</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Total Assigned</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Connected</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Not Connected</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Pending</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {formData.callMadeTo === "BEO" ? (
                  // For BEO - show district wise summary with caller names
                  (() => {
                    const districtCallerMap = {};
                    let serialNumber = 1;
                    
                    summaryData.summaryByDistrictBlock.forEach(districtBlock => {
                      const districtName = districtBlock.districtName || districtBlock.districtId;
                      
                      districtBlock.assignedCallers.forEach(caller => {
                        // Skip the placeholder "No caller assigned"
                        if (caller.userName === "No caller assigned") return;
                        
                        const key = `${districtName}_${caller.userName}`;
                        
                        if (!districtCallerMap[key]) {
                          districtCallerMap[key] = {
                            serialNumber: serialNumber++,
                            callerName: caller.userName,
                            districtName: districtName,
                            totalAssigned: 0,
                            connected: 0,
                            notConnected: 0,
                            pending: 0
                          };
                        }
                        
                        districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
                        districtCallerMap[key].connected += districtBlock.summary.calls.connected;
                        districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
                        districtCallerMap[key].pending += districtBlock.summary.calls.pending;
                      });
                      
                      // If no assigned callers, still show the district data
                      if (districtBlock.assignedCallers.length === 0 || 
                          (districtBlock.assignedCallers.length === 1 && 
                           districtBlock.assignedCallers[0].userName === "No caller assigned")) {
                        const key = `${districtName}_Not Assigned`;
                        
                        if (!districtCallerMap[key]) {
                          districtCallerMap[key] = {
                            serialNumber: serialNumber++,
                            callerName: "Not Assigned",
                            districtName: districtName,
                            totalAssigned: 0,
                            connected: 0,
                            notConnected: 0,
                            pending: 0
                          };
                        }
                        
                        districtCallerMap[key].totalAssigned += districtBlock.summary.calls.totalAssigned;
                        districtCallerMap[key].connected += districtBlock.summary.calls.connected;
                        districtCallerMap[key].notConnected += districtBlock.summary.calls.notConnected;
                        districtCallerMap[key].pending += districtBlock.summary.calls.pending;
                      }
                    });
                    
                    return Object.values(districtCallerMap).map((callerData, index) => (
                      <tr 
                        key={`${callerData.districtName}_${callerData.callerName}`}
                        style={{ 
                          backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                          borderBottom: "1px solid #e9ecef"
                        }}
                      >
                        <td style={{ padding: "12px" }}>{callerData.serialNumber}</td>
                        <td style={{ padding: "12px" }}>{callerData.callerName}</td>
                        <td style={{ padding: "12px" }}>{callerData.districtName}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>{callerData.totalAssigned}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>{callerData.connected}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>{callerData.notConnected}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>{callerData.pending}</td>
                      </tr>
                    ));
                  })()
                ) : (
                  // For Principal, ABRC, DEO - keep original logic
                  (() => {
                    let serialNumber = 1;
                    return summaryData.summaryByDistrictBlock.map((districtBlock, index) => (
                      districtBlock.assignedCallers.map((caller, callerIndex) => (
                        <tr 
                          key={`${index}-${callerIndex}`}
                          style={{ 
                            backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                            borderBottom: "1px solid #e9ecef"
                          }}
                        >
                          <td style={{ padding: "12px" }}>{serialNumber++}</td>
                          <td style={{ padding: "12px" }}>{caller.userName}</td>
                          <td style={{ padding: "12px" }}>{districtBlock.districtName}</td>
                          <td style={{ padding: "12px" }}>{districtBlock.blockName}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.totalAssigned}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.connected}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.notConnected}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>{districtBlock.summary.calls.pending}</td>
                        </tr>
                      ))
                    ));
                  })()
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};