import React, { useState, useEffect } from "react";
import DistrictBlockCentersService from "../services/DistrictBlockCentersService";
import Select from "react-select";
import { Row, Col, Container, Table, Button } from "react-bootstrap";
import DashBoardServices from "../services/DashBoardServices";
import { jsPDF } from "jspdf";

export default function AttendanceAME() {
  const [examinationCentersList, setExaminationCentersList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedCenters, setSelectedCenters] = useState("");
  const [allData, setAllData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);


 //Below thing is for Level 3 room number 
  const [roomNumber, setRoomNumber] = useState("");



  const roomNumberData = [
    { "district": "Ambala", "RoomNo": ["1", "2", "3", "4", "5", "6", "7", "8"] },
    { "district": "Bhiwani", "RoomNo": ["1", "2", "3", "4", "5"] },
    { "district": "Charkhi Dadri", "RoomNo": ["1", "2"] },
    { "district": "Faridabad", "RoomNo": ["1", "2", "3", "4", "5"] },
    { "district": "Fatehabad", "RoomNo": ["1", "2", "3", "4", "5", "6"] },
    { "district": "Gurugram", "RoomNo": ["1", "2", "3", "4", "5"] },
    { "district": "Hisar", "RoomNo": ["1", "2", "3", "4", "5", "6"] },
    { "district": "Jhajjar", "RoomNo": ["1", "2", "3", "4"] },
    { "district": "Jind", "RoomNo": ["1", "2", "3", "4", "5", "6"] },
    { "district": "Kaithal", "RoomNo": ["1", "2", "3", "4", "5", "6"] },
    { "district": "Karnal", "RoomNo": ["1", "2", "3", "4", "5", "6"] },
    { "district": "Kurukshetra", "RoomNo": ["1", "2", "3", "4", "5", "6", "7"] },
    { "district": "Mahendragarh", "RoomNo": ["1", "2", "3"] },
    { "district": "Nuh Mewat", "RoomNo": ["1", "2", "3", "4", "5"] },
    { "district": "Palwal", "RoomNo": ["1", "2", "3"] },
    { "district": "Panchkula", "RoomNo": ["1", "2", "3", "4", "5", "6"] },
    { "district": "Panipat", "RoomNo": ["1", "2", "3", "4", "5", "6", "7"] },
    { "district": "Rewari", "RoomNo": ["1", "2", "3"] },
    { "district": "Rohtak", "RoomNo": ["1", "2", "3", "4", "5", "6", "7"] },
    { "district": "Sirsa", "RoomNo": ["1", "2", "3", "4"] },
    { "district": "Sonipat", "RoomNo": ["1", "2", "3", "4"] },
    { "district": "Yamunanagar", "RoomNo": ["1", "2", "3", "4", "5", "6"] }
];
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const fetchExaminationCentersData = async () => {
    try {
      const response =
        await DistrictBlockCentersService.getDistrictBlockCenters();
      setExaminationCentersList(response.data.data);
    } catch (error) {
      console.error("Error fetching examination centers:", error);
    }
  };

  useEffect(() => {
    fetchExaminationCentersData();
  }, []);

  const unqDistricts = [
    ...new Set(examinationCentersList.map((item) => item.district)),
  ];

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption.value);
  };

  console.log("i am district selected");
  console.log(selectedDistrict);

  //To filter that boject from roomNumberOjbect which was selected from district filter
  const newRoomObject = roomNumberData.find(obj => obj.district === selectedDistrict);

  console.log('I AM newRoomObject')
  console.log(newRoomObject);

  console.log(roomNumber);
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


  const filteredBlock = examinationCentersList.filter(
    (eachBlock) => eachBlock.district === selectedDistrict
  );

  const unqFilteredBlock = [
    ...new Set(filteredBlock.map((item) => item.blockName)),
  ];

  const handleBlockChange = (selectedOption) => {
    setSelectedBlock(selectedOption.value);
  };

  //activate below snippet for level 1 only

  // const filteredCenters = examinationCentersList.filter(
  //     (eachCenter) =>
  //         eachCenter.blockName === selectedBlock &&
  //         eachCenter.examinationLevel === "2" &&
  //         eachCenter.examType === "MB"
  // );

  //Activate below snippet for level 2

  // const filteredCenters = examinationCentersList.filter(
  //     (eachCenter) =>
  //         eachCenter.district === selectedDistrict &&
  //         eachCenter.examinationLevel === "2" &&
  //         eachCenter.examType === "MB"
  // );

  // const handleCenterChange = (selectedOption) => {
  //     setSelectedCenters(selectedOption.value);
  // };

  //Activate below snippet for level 3

  const filteredCenters = examinationCentersList.filter(
    (eachCenter) =>
      eachCenter.district === selectedDistrict &&
      eachCenter.examinationLevel === "AME" &&
      eachCenter.examType === "MB"
  );

  const handleCenterChange = (selectedOption) => {
    setSelectedCenters(selectedOption.value);
  };

  const admitCard1 = true;
  const attendancePdf = true;

  //Activate below for level 1

  // const handleFilterSubmit = async () => {
  //     if (selectedDistrict && selectedBlock && selectedCenters) {
  //         setFilterApplied(true);
  //     } else {
  //         setFilterApplied(false);
  //     }

  // Activate below for level 2

  //   const handleFilterSubmit = async () => {
  //     if (selectedDistrict && selectedCenters) {
  //         setFilterApplied(true);
  //     } else {
  //         setFilterApplied(false);
  //     }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // Activate below for level 3

  const handleFilterSubmit = async () => {
    if (selectedDistrict && selectedCenters) {
      setFilterApplied(true);
    } else {
      setFilterApplied(false);
    }
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    //For temporary  basisi i am creating object for room filter. So that user can select rooms dynamically on frontend and i can send the room number in query param

    

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    //activate below query for level 1

    // let query = `district=${selectedDistrict}&block=${selectedBlock}&L1examinationCenter=${selectedCenters}&admitCard1=${admitCard1}&grade=8`.trim();

    //activate below query for level 2

    // let query = `district=${selectedDistrict}&L2examinationCenter=${selectedCenters}&grade=8`.trim();

    //activate below query for level 3
    let query =
      `district=${selectedDistrict}&L3examinationCenter=${selectedCenters}&grade=8&Level3StudentsRoomNumber=${roomNumber}`.trim();

    try {
      const response = await DashBoardServices.GetAllStudentData(query);
      setAllData(response.data || []);
    } catch (error) {
      console.log("Error fetching data: ", error);
      setAllData([]);
    }
  };

  const sortAllData = allData.sort((a, b) =>
    a.rollNumber.localeCompare(b.rollNumber)
  );

  const admitHrLogo = "/admitHrLogo.png";
  const buniyaadLogo = "/admitBuniyaLogo.png";

  const generatePDF = async () => {
    const pdf = new jsPDF("l", "mm", "a4");
    const tableData = allData.map((student, index) => ({
      serialNumber: index + 1,
      srn: student.srn,
      name: student.name,
      father: student.father,
      gender: student.gender,
      school: student.school,
      category: student.category,
      L1blockAdmitCard: student.L1blockAdmitCard
      //imageUrl: student.imageUrl, // Assuming imageUrl is a valid URL
    }));
  
    const headerOffset = 20; // Space at the top of the first page for header
    let yPositionStart = headerOffset; // Start drawing the content after the header space
    const pageWidth = pdf.internal.pageSize.width;
    const columnWidths = [25, 25, 25, 25, 25, 25, 25, 25, 25]; // Set column widths for 9 columns (removed Paper Code)
    const imageWidth = 20; // Width of the image
    const imageHeight = 20; // Height of the image
  
    // Compress image using Canvas (target 15KB)
    const compressImage = (imageUrl) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Allow cross-origin
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          const maxWidth = 100; // Adjust width to compress the image
          const scaleFactor = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleFactor;
  
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          let quality = 0.5;
          let compressedImage = canvas.toDataURL("image/jpeg", quality);
  
          // Check if the compressed image is still too large, adjust quality until it's under 15KB
          while (compressedImage.length / 1024 > 15 && quality > 0.1) {
            quality -= 0.05; // Decrease quality to get the target size
            compressedImage = canvas.toDataURL("image/jpeg", quality);
          }
  
          resolve(compressedImage);
        };
        img.onerror = () => reject("Image loading failed");
      });
  
    // Add header to the first page
    pdf.addImage(admitHrLogo, "PNG", 10, 3, 15, 15);
    pdf.addImage(buniyaadLogo, "PNG", 270, 3, 15, 15);
  
    pdf.setFontSize(15);
    pdf.text(
      "Mission Buniyaad Annual Merit Examination Attendance Sheet Batch 2024-26",
      150,
      8,
      { align: "center" }
    );
    pdf.setFontSize(12);
    pdf.text(`District: ${selectedDistrict}`, 150, 12, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`Center: ${selectedCenters}, Room No.: ${roomNumber}`, 150, 17, { align: "center" });
  
    // Add table header
    const addTableHeader = () => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      let xPosition = 10;
  
      const headers = [
        "#",
        "SRN",
        "Name",
        "Father",
        "Gender",
        "Category.",
        "Center",
       
        "Block",
        "Signature", // Removed Paper Code
      ];
  
      headers.forEach((header, index) => {
        pdf.text(header, xPosition + 6, 25);
        xPosition += columnWidths[index];
      });
  
      yPositionStart += 10; // Move down for rows
    };
  
    // Draw grid lines around header and content
    const drawGridLines = () => {
      let xPosition = 10;
      let yPosition = yPositionStart;
  
      // Draw vertical column grid lines
      columnWidths.forEach((width) => {
        pdf.setLineWidth(0.5);
        pdf.line(
          xPosition,
          yPosition,
          xPosition,
          yPositionStart + tableData.length * 30
        ); // Full column height
        xPosition += width;
      });
  
      // Draw horizontal row grid lines
      for (let i = 0; i < tableData.length + 1; i++) {
        // +1 for header row
        pdf.setLineWidth(0.5);
        pdf.line(10, yPosition + i * 30, pageWidth - 10, yPosition + i * 30); // Draw horizontal lines
      }
  
      // Draw grid lines around the header
      xPosition = 10;
      let headerHeight = 10; // Height of the header row
      let headerYPosition = headerOffset; // Start position for header
  
      // Vertical lines around header
      pdf.setLineWidth(0.5);
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // Left side of header
      xPosition += columnWidths[0];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "#"
      xPosition += columnWidths[1];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "SRN"
      xPosition += columnWidths[2];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "Name"
      xPosition += columnWidths[3];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "Father"
      xPosition += columnWidths[4];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "Gender"
      xPosition += columnWidths[5];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "School"
      xPosition += columnWidths[6];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "Roll No."
      xPosition += columnWidths[7];
      pdf.line(
        xPosition,
        headerYPosition,
        xPosition,
        headerYPosition + headerHeight
      ); // After "Photo"
      xPosition += columnWidths[8];
      // pdf.line(xPosition, headerYPosition, xPosition, headerYPosition + headerHeight); // After "Signature"
  
      // Horizontal lines around header
      pdf.line(10, headerYPosition, pageWidth - 10, headerYPosition); // Top side of header
      pdf.line(
        10,
        headerYPosition + headerHeight,
        pageWidth - 10,
        headerYPosition + headerHeight
      ); // Bottom side of header
    };
  
    // Add table rows
    const addTableRow = async (data) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      let xPosition = 10;
  
      // Wrap text for all columns
      const wrappedSerialNumber = pdf.splitTextToSize(
        String(data.serialNumber),
        columnWidths[0] - 4
      );
      pdf.text(wrappedSerialNumber, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[0];
  
      const wrappedSrn = pdf.splitTextToSize(
        String(data.srn),
        columnWidths[1] - 4
      );
      pdf.text(wrappedSrn, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[1];
  
      const wrappedName = pdf.splitTextToSize(data.name, columnWidths[2] - 4);
      pdf.text(wrappedName, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[2];
  
      const wrappedFather = pdf.splitTextToSize(
        data.father,
        columnWidths[3] - 4
      );
      pdf.text(wrappedFather, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[3];
  
      const wrappedGender = pdf.splitTextToSize(
        data.gender,
        columnWidths[4] - 4
      );
      pdf.text(wrappedGender, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[4];

      const wrappedCategory = pdf.splitTextToSize(
        String(data.category),
        columnWidths[5] - 4
      );
      pdf.text(wrappedCategory, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[5];

  
      const wrappedSchool = pdf.splitTextToSize(
        data.school,
        columnWidths[6] - 4
      );
      // Align school text left and move it up slightly
      pdf.text(wrappedSchool, xPosition + 2, yPositionStart + 3); // Move text a bit closer to the row line
      xPosition += columnWidths[6];
  
      const wrappedBlock = pdf.splitTextToSize(
        String(data.L1blockAdmitCard),
        columnWidths[7] - 4
      );
      pdf.text(wrappedBlock, xPosition + 2, yPositionStart + 7);
      xPosition += columnWidths[7];



      
     
  
      // if (data.imageUrl) {
      //   try {
      //     const compressedImage = await compressImage(data.imageUrl);
      //     pdf.addImage(
      //       compressedImage,
      //       "PNG",
      //       xPosition + 2,
      //       yPositionStart + 2,
      //       imageWidth,
      //       imageHeight
      //     );
      //   } catch (error) {
      //     console.error("Error loading image:", error);
      //   }
      // }
      xPosition += columnWidths[7];
      pdf.text("", xPosition + 2, yPositionStart + 7); // Signature Column
      xPosition += columnWidths[8];
  
      yPositionStart += 30; // Adjust for the next row
    };
  
    addTableHeader();
    drawGridLines(); // Draw grid lines for the header and content
  
    for (const data of tableData) {
      if (yPositionStart > pdf.internal.pageSize.height - 30) {
        pdf.addPage();
        yPositionStart = headerOffset; // Reset the Y position for the new page with header space
        addTableHeader();
        drawGridLines(); // Draw grid lines on the new page
      }
      await addTableRow(data);
    }
  
    pdf.save(`${selectedCenters}_AME-Attendance.pdf`);
  };
  

  return (
    <>
      <Container fluid>
      <h1>Annula Merit Examinations Attendance Pdfs</h1>
      <hr></hr>
        <hr></hr>
        <div id="content-to-pdf">
          <Row>
            <Col>
              <label>District</label>
              <Select
                placeholder="District"
                options={unqDistricts.map((district) => ({
                  value: district,
                  label: district,
                }))}
                onChange={handleDistrictChange}
              />
            </Col>

            {/* activate below dropdown at the time of level1 */}

            {/* <Col>
                            <label>Block</label>
                            <Select
                                placeholder="Block"
                                options={unqFilteredBlock.map(block => ({ value: block, label: block }))}
                                onChange={handleBlockChange}
                            />
                        </Col> */}

            <Col>
              <label>Center</label>
              <Select
                placeholder="Center"
                options={filteredCenters.map((center) => ({
                  value: center.examinationCenters,
                  label: center.examinationCenters,
                }))}
                onChange={handleCenterChange}
              />
            </Col>

            
  <Col>
  <label>Room Number</label>
  <Select
    placeholder="Select Room Number"
    options={
      newRoomObject && newRoomObject.RoomNo
        ? newRoomObject.RoomNo.map((roomNo) => ({
            value: roomNo,
            label: roomNo,
          }))
        : [] // return empty array if RoomNo is undefined
    }
    onChange={(selectedOption) => setRoomNumber(selectedOption.value)} // Update roomNumber state
  />
</Col>

           
          </Row>
          <Row>
            <Col>
              <Button onClick={handleFilterSubmit}>Submit</Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Button onClick={generatePDF}>Download Attendance Sheet</Button>
            </Col>
          </Row>
          <hr />
          <Row>
            {filterApplied ? (
              <Row>
                <Col>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>SRN</th>
                        <th>Name</th>
                        <th>Father</th>
                        <th>Gender</th>
                        <th>Category</th>
                        <th>School</th>
                        <th>RollNo.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.length > 0 ? (
                        allData.map((eachStudent, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{eachStudent.srn}</td>
                            <td>{eachStudent.name}</td>
                            <td>{eachStudent.father}</td>
                            <td>{eachStudent.gender}</td>
                            <td>{eachStudent.category}</td>
                            <td>{eachStudent.school}</td>
                            {/* <td>
                                                            <img
                                                                src={eachStudent.imageUrl}
                                                                alt={eachStudent.name}
                                                                style={{ width: 100, height: 100 }}
                                                            />
                                                        </td> */}
                            <td>{eachStudent.rollNumber}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="14" style={{ textAlign: "center" }}>
                            No students found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            ) : (
              <div>
                <h1>
                  Kindly filter your center and download your attendance sheet.
                </h1>
              </div>
            )}
          </Row>
        </div>
      </Container>
    </>
  );
}
