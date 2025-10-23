import React, { useState, useEffect } from 'react';
import DistrictBlockCentersService from '../services/DistrictBlockCentersService';
import Select from 'react-select';
import { Row, Col, Container, Table, Button, Spinner } from 'react-bootstrap';
import DashBoardServices from '../services/DashBoardServices';
import { jsPDF } from "jspdf";



export default function Attendance10() {
    const [examinationCentersList, setExaminationCentersList] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedCenters, setSelectedCenters] = useState("");
    const [allData, setAllData] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);

    //shows the loader kinda thing in attendance sheet
    const [attendanceSheetLoading, setAttendanceSheetLoading] = useState(false)

    const fetchExaminationCentersData = async () => {
        try {
            const response = await DistrictBlockCentersService.getDistrictBlockCenters();
            setExaminationCentersList(response.data.data);
        } catch (error) {
            console.error("Error fetching examination centers:", error);
        }
    };

    useEffect(() => {
        fetchExaminationCentersData();
    }, []);

    const unqDistricts = [...new Set(examinationCentersList.map(item => item.district))];

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption.value);
    };

    const filteredBlock = examinationCentersList.filter(
        (eachBlock) => eachBlock.district === selectedDistrict
    );

    const unqFilteredBlock = [...new Set(filteredBlock.map(item => item.blockName))];

    const handleBlockChange = (selectedOption) => {
        setSelectedBlock(selectedOption.value);
    };

    //activate below snippet for level 1 only

    const filteredCenters = examinationCentersList.filter(
        (eachCenter) =>
            eachCenter.blockName === selectedBlock &&
            eachCenter.examinationLevel === "1" &&
            eachCenter.examType === "S100"
    );

//Activate below snippet for level 2

    // const filteredCenters = examinationCentersList.filter(
    //     (eachCenter) =>
    //         eachCenter.district === selectedDistrict &&
    //         eachCenter.examinationLevel === "2" &&
    //         eachCenter.examType === "MB"
    // );


//Below hook for level 2;
const [filteredGender, setFilteredGENDER] = useState("")
const [filteredBatch, setFilteredBatch] = useState("")

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

      const handleFilterSubmit = async () => {
        if (filteredGender && filteredBatch) {
            setFilterApplied(true);
        } else {
            setFilterApplied(false);
        }





    
        //activate below query for level 1

       

       // let query = `district=${selectedDistrict}&block=${selectedBlock}&L1examinationCenter=${selectedCenters}&admitCard1=${admitCard1}&grade=10`.trim();

        //activate below query for level 2

        // let query = `district=${selectedDistrict}&L2examinationCenter=${selectedCenters}&grade=8`.trim();

    //     try {
    //         const response = await DashBoardServices.GetAllStudentData(query);
    //         setAllData(response.data || []);
    //     } catch (error) {
    //         console.log('Error fetching data: ', error);
    //         setAllData([]);
    //     }
    // };


    //activate below query for level 2


    let query = `L2examinationCenter=Haryana Super 100 Campus, Vill. Barna, Dhand Road, Near Teri College, Kurukshetra&super100L2ExamBatchDivision=${filteredBatch.value}&gender=${filteredGender.value}&grade=10`.trim();

    //activate below query for level 2

    // let query = `district=${selectedDistrict}&L2examinationCenter=${selectedCenters}&grade=8`.trim();

    try {
        const response = await DashBoardServices.GetAllStudentData(query);
        setAllData(response.data || []);
    } catch (error) {
        console.log('Error fetching data: ', error);
        setAllData([]);
    }
};



useEffect(()=>{
console.log(filteredGender)
console.log(allData)
}, [filteredGender,allData])

//-----------------------------------------------------------------------------------

    const sortAllData = allData.sort((a, b) => a.name.localeCompare(b.name));

        const admitHrLogo = "/admitHrLogo.png"
        const buniyaadLogo = "/admitBuniyaLogo.png"

        const generatePDF = async () => {
            setAttendanceSheetLoading(true);
        
            const pdf = new jsPDF('l', 'mm', 'a4');
        
            const tableData = allData.map((student, index) => ({
                serialNumber: index + 1,
                srn: student.srn,
                name: student.name.toUpperCase(),
                father: student.father.toUpperCase(),
                // gender: student.gender,
                district: student.district,
                school: student.school,
                rollNumber: student.rollNumber,
                imageUrl: student.imageUrl,
            }));
        
            const headerOffset = 20;
            let yPositionStart = headerOffset;
            const pageWidth = pdf.internal.pageSize.width;
            const columnWidths = [8, 20, 23, 23, 20, 25, 20, 30, 40, 40, 23]; // Adjusted column widths
            const imageWidth = 20;
            const imageHeight = 20;
        
            const compressImage = (imageUrl) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = imageUrl;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
        
                        const maxWidth = 100;
                        const scaleFactor = maxWidth / img.width;
                        canvas.width = maxWidth;
                        canvas.height = img.height * scaleFactor;
        
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        let quality = 0.5;
                        let compressedImage = canvas.toDataURL("image/jpeg", quality);
        
                        while (compressedImage.length / 1024 > 15 && quality > 0.1) {
                            quality -= 0.05;
                            compressedImage = canvas.toDataURL("image/jpeg", quality);
                        }
        
                        resolve(compressedImage);
                    };
                    img.onerror = () => reject("Image loading failed");
                });
        
            // HEADER
            pdf.addImage(admitHrLogo, "PNG", 10, 3, 15, 15);
            pdf.addImage(buniyaadLogo, "PNG", 270, 3, 15, 15);
            pdf.setFontSize(10);
            pdf.text('Haryana Super 100 Level-2 Attendance Sheet Batch 2025-27', 150, 8, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text(`Center: Haryana Super 100 Campus, Vill. Barna, Dhand Road, Near Teri College, Kurukshetra`, 150, 12, { align: "center" });
            pdf.text(`Batch: ${filteredBatch.value}`, 150, 17, { align: "center" });
        
            const addTableHeader = () => {
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(8);
                let xPosition = 10;
        
                const headers = [
                    "#", "SRN", "Name", "Father", "District", "School",
                    "Roll No.", "Photo", "Signature1", "Signature2", "Room/Bed_No.",
                ];
        
                headers.forEach((header, index) => {
                    pdf.text(header, xPosition + 2, yPositionStart + 7);
                    xPosition += columnWidths[index];
                });
        
                yPositionStart += 10;
            };
        
            const drawGridLines = (rowCount) => {
                let xPosition = 10;
                const yStart = headerOffset + 10;
                const rowHeight = 35; // Increased row height for wrapping
                const totalHeight = rowCount * rowHeight;
        
                pdf.setLineWidth(0.5);
        
                // Vertical lines
                for (let i = 0; i <= columnWidths.length; i++) {
                    let x = 10 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
                    pdf.line(x, yStart, x, yStart + totalHeight);
                }
        
                // Horizontal lines
                for (let i = 0; i <= rowCount; i++) {
                    let y = yStart + i * rowHeight;
                    pdf.line(10, y, pageWidth - 15, y);
                }
        
                // Border for header
                pdf.rect(10, headerOffset, pageWidth - 25, 10);
            };
        
            const addTableRow = async (data) => {
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(8);
                let xPosition = 10;
        
                const cellPadding = 2;
        
                const writeCell = (text, width) => {
                    const wrappedText = pdf.splitTextToSize(text, width - cellPadding * 2);
                    pdf.text(wrappedText, xPosition + cellPadding, yPositionStart + 5, { maxWidth: width - 2 });
                    xPosition += width;
                };
        
                writeCell(String(data.serialNumber), columnWidths[0]);
                writeCell(data.srn, columnWidths[1]);
                writeCell(data.name, columnWidths[2]);
                writeCell(data.father, columnWidths[3]);
               
                writeCell(data.district, columnWidths[4]);
                writeCell(data.school, columnWidths[5]);
                writeCell(String(data.rollNumber), columnWidths[6]);
                // writeCell(data.gender, columnWidths[7]);
        
                if (data.imageUrl) {
                    try {
                        const compressedImage = await compressImage(data.imageUrl);
                        pdf.addImage(compressedImage, "PNG", xPosition + 2, yPositionStart + 2, imageWidth, imageHeight);
                    } catch (error) {
                        console.error("Error loading image:", error);
                    }
                }
                xPosition += columnWidths[8];
        
                writeCell("", columnWidths[9]); // Signature1
                writeCell("", columnWidths[10]); // Signature2
        
                yPositionStart += 35; // Increased row height
            };
        
            addTableHeader();
        
            let currentRow = 0;
            for (const data of tableData) {
                if (yPositionStart > pdf.internal.pageSize.height - 40) {
                    drawGridLines(currentRow);
        
                    pdf.addPage();
                    yPositionStart = headerOffset;
                    addTableHeader();
                    currentRow = 0;
                }
                await addTableRow(data);
                currentRow++;
            }
        
            drawGridLines(currentRow);
        
            alert('Your file is downloaded');
            setAttendanceSheetLoading(false);
        
            pdf.save(`Batch_${filteredBatch.value}_HS100-L2-Attendance.pdf`);
        };
        
        
    //---------------------------------------------------------------------------------    
    
    
    

    return (
        <>
            <Container fluid>
                <div id="content-to-pdf">
                    <Row>
                        {/* <Col>
                            <label>District</label>
                            <Select
                                placeholder="District"
                                options={unqDistricts.map(district => ({ value: district, label: district }))}
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



                        {/* <Col>
                            <label>Center</label>
                            <Select
                                placeholder="Center"
                                options={filteredCenters.map(center => ({
                                    value: center.examinationCenters,
                                    label: center.examinationCenters
                                }))}
                                onChange={handleCenterChange}
                            />
                        </Col>  */}

                        <Col>
                        <label>Select Gender</label>
                                <Select
                                
                                    options ={
                                        [{value: "Female", label: "Female"},
                                        {value: "Male", label: "Male"}]
                                    }
                                onChange={(selectedOption)=>setFilteredGENDER(selectedOption)}
                                
                                />
                        </Col>

                        <Col>
                        <label>Select Batch</label>
                                <Select
                                
                                    options ={
                                        [{value: "1", label: "1"},
                                        {value: "2", label: "2"},
                                        {value:"3", label:"3"}
                                    ]
                                    }
                                onChange={(selectedOption)=>setFilteredBatch(selectedOption)}
                                
                                />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button onClick={handleFilterSubmit}>Submit</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                        {attendanceSheetLoading ? (<h1 style={{color:'red'}}>Please Wait! Your File is Downloading...</h1> ):(<Button onClick={generatePDF}>Download Attendance Sheet</Button>)}
                           
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
                                <h1>Kindly filter your center and download your attendance sheet.</h1>
                            </div>
                        )}
                    </Row>
                </div>
            </Container>
        </>
    );
}




