// // src/components/Dashboards/BlockSchoolDashboard8.jsx
// import React, { useEffect, useState, useMemo, useContext } from "react";
// import {
//   Card,
//   Table,
//   Spinner,
//   Alert,
//   Badge,
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   FormControl,
// } from "react-bootstrap";
// import Select from "react-select";
// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi.js";
// import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices.js";
// import { updateSchoolCenterPreferences } from "../../services/DistrictBLockSchoolServices/DistrictBlockSchoolService.js";
// import { UserContext } from "../NewContextApis/UserContext";

// export const CenterAllocation = () => {



// const FetchCenters = async () => {

//     try {
//         const response = await GetCentersDataByExaminationAndExamType();

//         console.log(response.data)
//     } catch (error) {
//         console.error("Error fetching data", error)
//     }
// }

// useEffect(() =>{
//     FetchCenters()
// }, [])

//     return (
//         <h1>Center allocation logic</h1>
//     )
// };



// src/components/CenterAllocation/CenterAllocationComponent.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import Select from "react-select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GetCentersDataByExaminationAndExamType } from "../../services/ExaminationVenue/ExaminationVenueServices.js";
import { FaDownload, FaFileExcel, FaInfoCircle, FaQuestionCircle } from "react-icons/fa";

export const CenterAllocation = () => {
  const [centers, setCenters] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [allocationResults, setAllocationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Select District, 2: Upload CSV, 3: View Results
  const [districtBlocks, setDistrictBlocks] = useState({}); // Store blocks for selected district

  // Fetch centers data
  const fetchCenters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetCentersDataByExaminationAndExamType();
      if (response.data) {
        setCenters(response.data);
        
        // Extract unique districts
        const uniqueDistricts = Array.from(
          new Map(
            response.data.map(item => [
              item.districtId,
              { value: item.districtId, label: item.districtName }
            ])
          ).values()
        );
        setDistricts(uniqueDistricts);
      }
    } catch (error) {
      console.error("Error fetching centers", error);
      setError("Failed to fetch center data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    
    if (district) {
      // Get all blocks for this district from centers data
      const districtCenters = centers.filter(c => c.districtId === district.value);
      const uniqueBlocks = Array.from(
        new Map(
          districtCenters.map(center => [
            center.blockName,
            { name: center.blockName, centers: [] }
          ])
        ).values()
      );
      
      // Organize centers by block
      const blocksWithCenters = {};
      uniqueBlocks.forEach(block => {
        const blockCenters = districtCenters.filter(c => c.blockName === block.name);
        blocksWithCenters[block.name] = {
          name: block.name,
          centers: blockCenters.map(c => ({
            name: c.examinationVenue,
            capacity: c.capacity,
            sequence: c.examinationVenueSequenceInBlock
          }))
        };
      });
      
      setDistrictBlocks(blocksWithCenters);
    } else {
      setDistrictBlocks({});
    }
  };

  // Download dummy template
  const downloadDummyTemplate = () => {
    try {
      // Create sample data based on selected district
      let sampleData = [
        ['district', 'block', 'srn'],
        ['Faridabad', 'Ballabgarh', 'SRN001'],
        ['Faridabad', 'Ballabgarh', 'SRN002'],
        ['Faridabad', 'Ballabgarh', 'SRN003'],
        ['Faridabad', 'Ballabgarh', 'SRN004'],
        ['Faridabad', 'Ballabgarh', 'SRN005'],
      ];

      // If district is selected, use actual blocks from that district
      if (selectedDistrict && Object.keys(districtBlocks).length > 0) {
        const blocks = Object.keys(districtBlocks);
        sampleData = [
          ['district', 'block', 'srn'],
          [selectedDistrict.label, blocks[0], 'SRN001'],
          [selectedDistrict.label, blocks[0], 'SRN002'],
          [selectedDistrict.label, blocks[0], 'SRN003'],
          [selectedDistrict.label, blocks[Math.min(1, blocks.length-1)] || blocks[0], 'SRN004'],
          [selectedDistrict.label, blocks[Math.min(2, blocks.length-1)] || blocks[0], 'SRN005'],
        ];
      }

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(sampleData);
      
      // Add column widths
      const wscols = [
        { wch: 20 }, // district column width
        { wch: 25 }, // block column width
        { wch: 15 }, // srn column width
      ];
      ws['!cols'] = wscols;
      
      // Add instructions sheet
      const instructions = [
        ['INSTRUCTIONS FOR CSV TEMPLATE'],
        [''],
        ['Column Headers (MUST BE EXACT):'],
        ['1. district - Name of the district (case insensitive)'],
        ['2. block    - Name of the block (case insensitive)'],
        ['3. srn      - Student Registration Number'],
        [''],
        ['Important Notes:'],
        ['- File must be in CSV or Excel format'],
        ['- First row must contain the headers'],
        ['- All columns are required'],
        ['- Ensure district and block names match the centers data'],
        ['- SRNs must be unique'],
        [''],
        ['Example Data:'],
        ['district,block,srn'],
        ['Faridabad,Ballabgarh,SRN001'],
        ['Faridabad,Ballabgarh,SRN002'],
        ['Nuh Mewat,Nuh,SRN003'],
        ['Nuh Mewat,Nuh,SRN004'],
        [''],
        ['Available Blocks for Selected District:'],
        ...(selectedDistrict ? 
          Object.keys(districtBlocks).map(block => [block]) : 
          [['Please select a district first']]
        ),
        [''],
        ['Center Allocation Logic:'],
        ['- Students are grouped by block'],
        ['- Centers are allocated proportionally based on capacity'],
        ['- Allocation respects center sequence order'],
        ['- Students are distributed evenly across available centers']
      ];
      
      const ws2 = XLSX.utils.aoa_to_sheet(instructions);
      ws2['!cols'] = [{ wch: 80 }]; // Set width for instructions sheet
      
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.utils.book_append_sheet(wb, ws2, "Instructions");
      
      // Generate and download file
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, `center_allocation_template_${selectedDistrict ? selectedDistrict.label : 'sample'}.xlsx`);
      
    } catch (error) {
      console.error("Error creating template:", error);
      setError("Error creating template. Please try again.");
    }
  };

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    setError(null);
    const file = event.target.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ""
        });
        
        // Check if file is empty
        if (jsonData.length === 0) {
          setError("The uploaded file is empty.");
          return;
        }
        
        // Assuming first row is header
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        // Validate headers
        const requiredHeaders = ['district', 'block', 'srn'];
        const hasRequiredHeaders = requiredHeaders.every(header => 
          headers.map(h => h.toLowerCase().trim()).includes(header.toLowerCase())
        );
        
        if (!hasRequiredHeaders) {
          setError(`CSV must contain columns: district, block, and srn. Found: ${headers.join(', ')}`);
          return;
        }
        
        // Parse data based on header positions
        const districtIndex = headers.findIndex(h => h.toLowerCase().trim() === 'district');
        const blockIndex = headers.findIndex(h => h.toLowerCase().trim() === 'block');
        const srnIndex = headers.findIndex(h => h.toLowerCase().trim() === 'srn');
        
        const parsed = rows
          .filter(row => row[districtIndex] && row[blockIndex] && row[srnIndex])
          .map((row, index) => ({
            district: String(row[districtIndex]).trim(),
            block: String(row[blockIndex]).trim(),
            srn: String(row[srnIndex]).trim(),
            rowNumber: index + 2, // +2 because: 1 for header, 1 for 0-index
            originalRow: row
          }));
        
        // Check for duplicates in SRN
        const srnSet = new Set();
        const duplicates = [];
        parsed.forEach(student => {
          if (srnSet.has(student.srn)) {
            duplicates.push(student.srn);
          }
          srnSet.add(student.srn);
        });
        
        if (duplicates.length > 0) {
          setError(`Found duplicate SRNs: ${duplicates.slice(0, 5).join(', ')}${duplicates.length > 5 ? '...' : ''}`);
          return;
        }
        
        // Validate against selected district if applicable
        if (selectedDistrict) {
          const mismatchedDistricts = new Set();
          parsed.forEach(student => {
            if (student.district.toLowerCase() !== selectedDistrict.label.toLowerCase()) {
              mismatchedDistricts.add(student.district);
            }
          });
          
          if (mismatchedDistricts.size > 0) {
            setError(`Found students from other districts: ${Array.from(mismatchedDistricts).join(', ')}. You selected ${selectedDistrict.label}.`);
            return;
          }
        }
        
        setParsedData(parsed);
        setCsvData(jsonData);
        setStep(2);
        
        // Show success message
        setError(null);
        
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setError("Error parsing CSV file. Please check the format and try again.");
      }
    };
    
    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Group students by block
  const groupStudentsByBlock = (students) => {
    const groups = {};
    
    students.forEach(student => {
      const key = `${student.block.toLowerCase()}|${student.district.toLowerCase()}`;
      if (!groups[key]) {
        groups[key] = {
          blockName: student.block,
          districtName: student.district,
          students: [],
          count: 0
        };
      }
      groups[key].students.push(student);
      groups[key].count++;
    });
    
    return Object.values(groups);
  };

  // Calculate allocation
  const calculateAllocation = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter centers for selected district or all
      const districtCenters = selectedDistrict 
        ? centers.filter(center => center.districtId === selectedDistrict.value)
        : centers;
      
      // Group centers by block
      const centersByBlock = {};
      districtCenters.forEach(center => {
        const key = `${center.blockName.toLowerCase()}|${center.districtName.toLowerCase()}`;
        if (!centersByBlock[key]) {
          centersByBlock[key] = {
            blockName: center.blockName,
            districtName: center.districtName,
            centers: [],
            totalCapacity: 0,
            requiredPaperSum: 0
          };
        }
        centersByBlock[key].centers.push({
          ...center,
          allocatedStudents: 0,
          allocatedSRNs: []
        });
        centersByBlock[key].totalCapacity += center.capacity;
        centersByBlock[key].requiredPaperSum += center.requiredPaperCount || 0;
      });
      
      // Group students by block (case insensitive)
      const studentGroups = groupStudentsByBlock(parsedData);
      
      const results = [];
      const warnings = [];
      
      // Allocate students to centers
      studentGroups.forEach(group => {
        const blockKey = `${group.blockName.toLowerCase()}|${group.districtName.toLowerCase()}`;
        const blockCenters = centersByBlock[blockKey];
        
        if (!blockCenters) {
          results.push({
            blockName: group.blockName,
            districtName: group.districtName,
            error: `No centers found for this block`,
            totalStudents: group.count,
            allocated: 0
          });
          warnings.push(`Block "${group.blockName}" in district "${group.districtName}" has no centers.`);
          return;
        }
        
        // Check if total capacity is sufficient
        if (blockCenters.totalCapacity < group.count) {
          warnings.push(`Insufficient capacity in block "${group.blockName}". Students: ${group.count}, Capacity: ${blockCenters.totalCapacity}`);
        }
        
        // Calculate allocation proportion
        const totalStudents = group.count;
        let remainingStudents = totalStudents;
        const centersWithAllocation = [];
        
        // Sort centers by sequence
        const sortedCenters = [...blockCenters.centers].sort((a, b) => 
          parseInt(a.examinationVenueSequenceInBlock || 0) - 
          parseInt(b.examinationVenueSequenceInBlock || 0)
        );
        
        // Allocate students proportionally
        sortedCenters.forEach((center, index) => {
          if (remainingStudents <= 0) {
            centersWithAllocation.push({
              ...center,
              allocatedStudents: 0,
              proportion: 0
            });
            return;
          }
          
          // Calculate proportional allocation
          let allocated;
          if (index === sortedCenters.length - 1) {
            // Last center gets all remaining students
            allocated = Math.min(center.capacity, remainingStudents);
          } else {
            const proportion = center.capacity / blockCenters.totalCapacity;
            allocated = Math.floor(totalStudents * proportion);
            allocated = Math.min(allocated, center.capacity, remainingStudents);
          }
          
          // Allocate specific SRNs
          const startIndex = totalStudents - remainingStudents;
          const endIndex = startIndex + allocated;
          const allocatedSRNs = group.students
            .slice(startIndex, endIndex)
            .map(student => student.srn);
          
          centersWithAllocation.push({
            ...center,
            allocatedStudents: allocated,
            allocatedSRNs,
            proportion: (center.capacity / blockCenters.totalCapacity) * 100
          });
          
          remainingStudents -= allocated;
        });
        
        // Handle any remaining students (due to rounding)
        if (remainingStudents > 0) {
          // Distribute remaining students to centers with available capacity
          for (let i = 0; i < centersWithAllocation.length && remainingStudents > 0; i++) {
            const center = centersWithAllocation[i];
            const availableCapacity = center.capacity - center.allocatedStudents;
            
            if (availableCapacity > 0) {
              const toAllocate = Math.min(availableCapacity, remainingStudents);
              const startIndex = totalStudents - remainingStudents;
              const endIndex = startIndex + toAllocate;
              const additionalSRNs = group.students
                .slice(startIndex, endIndex)
                .map(student => student.srn);
              
              center.allocatedStudents += toAllocate;
              center.allocatedSRNs.push(...additionalSRNs);
              remainingStudents -= toAllocate;
            }
          }
        }
        
        results.push({
          blockName: group.blockName,
          districtName: group.districtName,
          totalStudents: group.count,
          allocatedStudents: totalStudents - remainingStudents,
          remainingStudents,
          centers: centersWithAllocation,
          totalCapacity: blockCenters.totalCapacity,
          requiredPaperSum: blockCenters.requiredPaperSum,
          utilizationPercentage: blockCenters.totalCapacity > 0 ? 
            ((totalStudents - remainingStudents) / blockCenters.totalCapacity) * 100 : 0
        });
      });
      
      // Show warnings if any
      if (warnings.length > 0) {
        setError(`Allocation completed with warnings:\n${warnings.join('\n')}`);
      }
      
      setAllocationResults(results);
      setStep(3);
      
    } catch (error) {
      console.error("Error calculating allocation:", error);
      setError("Error calculating allocation. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // 1. Summary sheet
      const summaryData = [
        ['CENTER ALLOCATION SUMMARY'],
        [`Generated on: ${new Date().toLocaleString()}`],
        [`Selected District: ${selectedDistrict?.label || 'All Districts'}`],
        [`Total Students: ${parsedData.length}`],
        [''],
        ['District', 'Block', 'Total Students', 'Total Capacity', 'Allocated', 'Remaining', 'Utilization %', 'Status'],
        ...allocationResults.map(result => [
          result.districtName,
          result.blockName,
          result.totalStudents,
          result.totalCapacity,
          result.allocatedStudents,
          result.remainingStudents,
          result.totalCapacity > 0 ? 
            `${((result.allocatedStudents / result.totalCapacity) * 100).toFixed(2)}%` : 'N/A',
          result.remainingStudents === 0 ? 'FULLY ALLOCATED' : 
          result.remainingStudents > 0 ? 'PARTIAL' : 'OVER CAPACITY'
        ])
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      
      // 2. Student Allocation sheet
      const detailData = [
        ['STUDENT-WISE ALLOCATION'],
        [''],
        ['SRN', 'District', 'Block', 'Allocated Center', 'Center Code', 'Center Capacity', 'Center Sequence', 'Allocation Status'],
        ...parsedData.map(student => {
          let allocation = null;
          
          // Find allocation for this student
          allocationResults.forEach(result => {
            result.centers?.forEach(center => {
              if (center.allocatedSRNs?.includes(student.srn)) {
                allocation = center;
              }
            });
          });
          
          return [
            student.srn,
            student.district,
            student.block,
            allocation?.examinationVenue || 'NOT ALLOCATED',
            allocation?.examinationVenueCode || 'N/A',
            allocation?.capacity || 'N/A',
            allocation?.examinationVenueSequenceInBlock || 'N/A',
            allocation ? 'ALLOCATED' : 'NOT ALLOCATED'
          ];
        })
      ];
      
      const detailWs = XLSX.utils.aoa_to_sheet(detailData);
      
      // 3. Center Details sheet
      const centerData = [
        ['CENTER-WISE ALLOCATION DETAILS'],
        [''],
        ['District', 'Block', 'Center Name', 'Center Code', 'Sequence', 'Capacity', 'Allocated', 'Remaining Seats', 'Utilization %', 'SRNs'],
        ...allocationResults.flatMap(result => 
          result.centers?.map(center => [
            result.districtName,
            result.blockName,
            center.examinationVenue,
            center.examinationVenueCode,
            center.examinationVenueSequenceInBlock,
            center.capacity,
            center.allocatedStudents,
            center.capacity - center.allocatedStudents,
            center.capacity > 0 ? 
              `${((center.allocatedStudents / center.capacity) * 100).toFixed(2)}%` : 'N/A',
            center.allocatedSRNs?.join(', ') || ''
          ]) || []
        )
      ];
      
      const centerWs = XLSX.utils.aoa_to_sheet(centerData);
      
      // 4. Instructions sheet
      const instructionsData = [
        ['ALLOCATION PROCESS INFORMATION'],
        [''],
        ['Process Date:', new Date().toLocaleDateString()],
        ['Process Time:', new Date().toLocaleTimeString()],
        ['Total Students Processed:', parsedData.length],
        ['Total Blocks:', allocationResults.length],
        ['Total Allocated:', allocationResults.reduce((sum, r) => sum + r.allocatedStudents, 0)],
        ['Total Remaining:', allocationResults.reduce((sum, r) => sum + r.remainingStudents, 0)],
        [''],
        ['Allocation Algorithm:'],
        ['1. Students are grouped by block'],
        ['2. Centers are sorted by sequence number'],
        ['3. Allocation is proportional to center capacity'],
        ['4. Remaining students are distributed to available capacity'],
        [''],
        ['File Information:'],
        ['- Sheet 1: Summary of allocation'],
        ['- Sheet 2: Student-wise allocation details'],
        ['- Sheet 3: Center-wise allocation details'],
        ['- Sheet 4: Process information (this sheet)']
      ];
      
      const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData);
      
      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
      XLSX.utils.book_append_sheet(wb, detailWs, "Student Allocation");
      XLSX.utils.book_append_sheet(wb, centerWs, "Center Details");
      XLSX.utils.book_append_sheet(wb, instructionsWs, "Process Info");
      
      // Generate file
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const districtName = selectedDistrict ? selectedDistrict.label.replace(/\s+/g, '_') : 'All_Districts';
      saveAs(blob, `Center_Allocation_${districtName}_${timestamp}.xlsx`);
      
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Error exporting to Excel. Please try again.");
    }
  };

  // Reset process
  const resetProcess = () => {
    setSelectedDistrict(null);
    setCsvData([]);
    setParsedData([]);
    setAllocationResults([]);
    setDistrictBlocks({});
    setStep(1);
    setError(null);
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">
              <FaFileExcel className="me-2" />
              Automated Center Allocation System
            </h4>
            <small className="opacity-75">Proportional allocation based on center capacity</small>
          </div>
          <Button 
            variant="light" 
            size="sm" 
            onClick={() => {
              const info = `This system automatically allocates students to examination centers based on:
              
1. Upload a CSV file with student data (district, block, srn)
2. Centers are selected from the database
3. Allocation is proportional to center capacity
4. Results can be exported to Excel

Required CSV format:
- Columns: district, block, srn
- First row must be headers
- Data must match center database`;
              alert(info);
            }}
          >
            <FaQuestionCircle /> Help
          </Button>
        </Card.Header>
        
        <Card.Body>
          {/* Step Indicator */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-label">Select District</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-label">Upload CSV</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-label">Results & Export</div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant={error.includes('warning') ? 'warning' : 'danger'} onClose={() => setError(null)} dismissible>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{error}</pre>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Processing allocation...</p>
            </div>
          )}

          {/* Step 1: District Selection */}
          {step === 1 && (
            <div className="step-content">
              <h5>
                <Badge bg="primary" className="me-2">Step 1</Badge>
                Select District
              </h5>
              <p className="text-muted mb-4">
                Select the district for center allocation. Centers will be filtered based on this selection.
                You can also work with all districts by leaving this unselected.
              </p>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <strong>Select District (Optional)</strong>
                      <span className="text-muted ms-1">- Leave empty for all districts</span>
                    </Form.Label>
                    <Select
                      options={districts}
                      value={selectedDistrict}
                      onChange={handleDistrictSelect}
                      placeholder="Select a district or leave empty for all..."
                      isClearable
                      isSearchable
                    />
                  </Form.Group>
                  
                  <div className="d-flex gap-2 mb-4">
                    <Button 
                      variant="primary" 
                      onClick={() => setStep(2)}
                      disabled={loading}
                    >
                      Next: Upload CSV
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={fetchCenters} 
                      disabled={loading}
                    >
                      Refresh Centers Data
                    </Button>
                  </div>
                </Col>
                
                <Col md={6}>
                  <Card>
                    <Card.Header className="bg-light">
                      <FaInfoCircle className="me-1" />
                      <strong>Quick Actions</strong>
                    </Card.Header>
                    <Card.Body>
                      <Button 
                        variant="outline-success" 
                        onClick={downloadDummyTemplate}
                        className="w-100 mb-2"
                        disabled={loading}
                      >
                        <FaDownload className="me-2" />
                        Download CSV Template
                      </Button>
                      <p className="text-muted small mb-0">
                        Get a sample CSV file with correct format. 
                        {selectedDistrict && ` Includes blocks from ${selectedDistrict.label}.`}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {selectedDistrict && (
                <div className="mt-4">
                  <Card>
                    <Card.Header className="bg-light">
                      <strong>
                        Available Centers in {selectedDistrict.label}
                        <Badge bg="info" className="ms-2">
                          {centers.filter(c => c.districtId === selectedDistrict.value).length} centers
                        </Badge>
                      </strong>
                    </Card.Header>
                    <Card.Body>
                      {Object.keys(districtBlocks).length > 0 ? (
                        <Table striped bordered size="sm">
                          <thead>
                            <tr>
                              <th>Block</th>
                              <th>Number of Centers</th>
                              <th>Total Capacity</th>
                              <th>Sample Centers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(districtBlocks).map(([blockName, blockData]) => {
                              const blockCenters = centers.filter(c => 
                                c.districtId === selectedDistrict.value && 
                                c.blockName === blockName
                              );
                              const totalCapacity = blockCenters.reduce((sum, c) => sum + c.capacity, 0);
                              
                              return (
                                <tr key={blockName}>
                                  <td>
                                    <strong>{blockName}</strong>
                                    <div className="small text-muted">
                                      {blockCenters.length} center{blockCenters.length !== 1 ? 's' : ''}
                                    </div>
                                  </td>
                                  <td>{blockCenters.length}</td>
                                  <td>
                                    <Badge bg="success">{totalCapacity}</Badge>
                                  </td>
                                  <td>
                                    <div className="small">
                                      {blockCenters.slice(0, 2).map(c => (
                                        <div key={c._id}>
                                          {c.examinationVenue} ({c.capacity})
                                        </div>
                                      ))}
                                      {blockCenters.length > 2 && (
                                        <span className="text-muted">
                                          + {blockCenters.length - 2} more...
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-muted">Loading centers data...</p>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Step 2: CSV Upload */}
          {step === 2 && (
            <div className="step-content">
              <h5>
                <Badge bg="primary" className="me-2">Step 2</Badge>
                Upload Student Data
              </h5>
              <p className="text-muted mb-4">
                Upload your CSV file containing student information. Ensure the file has the correct format.
              </p>
              
              <Row>
                <Col md={8}>
                  <Card className="mb-4">
                    <Card.Header className="bg-light">
                      <strong>Upload CSV File</strong>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group>
                        <Form.Label>
                          <strong>Select your CSV file</strong>
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                          disabled={loading}
                        />
                        <Form.Text className="text-muted">
                          Supported formats: CSV, Excel (.xlsx, .xls). 
                          Maximum file size: 10MB
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="mt-3">
                        <Button 
                          variant="outline-success" 
                          onClick={downloadDummyTemplate}
                          className="me-2"
                          disabled={loading}
                        >
                          <FaDownload className="me-1" />
                          Download Template
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setStep(1)}
                          disabled={loading}
                        >
                          Back to District Selection
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={4}>
                  <Card>
                    <Card.Header className="bg-light">
                      <strong>CSV Format Requirements</strong>
                    </Card.Header>
                    <Card.Body>
                      <div className="small">
                        <p><strong>Required columns (exact names):</strong></p>
                        <ul>
                          <li><code>district</code> - District name</li>
                          <li><code>block</code> - Block name</li>
                          <li><code>srn</code> - Student Registration Number</li>
                        </ul>
                        <p><strong>Example:</strong></p>
                        <pre className="bg-light p-2 rounded">
                          district,block,srn{'\n'}
                          Faridabad,Ballabgarh,SRN001{'\n'}
                          Faridabad,Ballabgarh,SRN002{'\n'}
                          Nuh Mewat,Nuh,SRN003
                        </pre>
                        <p className="mb-0 text-danger">
                          <small>Note: Column names are case-insensitive but must match exactly.</small>
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {parsedData.length > 0 && (
                <div className="mt-4">
                  <Card>
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <strong>CSV Data Preview ({parsedData.length} records)</strong>
                      <Badge bg="success">Valid Format ✓</Badge>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>District</th>
                            <th>Block</th>
                            <th>SRN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.slice(0, 8).map((student, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{student.district}</td>
                              <td>{student.block}</td>
                              <td><code>{student.srn}</code></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      
                      {parsedData.length > 8 && (
                        <div className="text-center">
                          <p className="text-muted">
                            ... and {parsedData.length - 8} more records
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button 
                          variant="primary" 
                          size="lg" 
                          onClick={calculateAllocation}
                          disabled={parsedData.length === 0 || loading}
                          className="w-100"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Calculating Allocation...
                            </>
                          ) : (
                            'Calculate Center Allocation'
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="step-content">
              <h5>
                <Badge bg="primary" className="me-2">Step 3</Badge>
                Allocation Results
              </h5>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-0">Allocation Complete!</h4>
                  <p className="text-muted mb-0">
                    {allocationResults.length} blocks processed successfully
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="success" onClick={exportToExcel} size="lg">
                    <FaFileExcel className="me-2" />
                    Download Excel Report
                  </Button>
                  <Button variant="outline-primary" onClick={resetProcess}>
                    Start New Allocation
                  </Button>
                </div>
              </div>
              
              {/* Summary Statistics */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center border-primary">
                    <Card.Body>
                      <Card.Title className="text-primary">Total Students</Card.Title>
                      <h2 className="text-primary">{parsedData.length}</h2>
                      <small className="text-muted">Uploaded in CSV</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-info">
                    <Card.Body>
                      <Card.Title className="text-info">Total Blocks</Card.Title>
                      <h2 className="text-info">{allocationResults.length}</h2>
                      <small className="text-muted">With allocation data</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-success">
                    <Card.Body>
                      <Card.Title className="text-success">Successfully Allocated</Card.Title>
                      <h2 className="text-success">
                        {allocationResults.reduce((sum, r) => sum + r.allocatedStudents, 0)}
                      </h2>
                      <small className="text-muted">
                        {((allocationResults.reduce((sum, r) => sum + r.allocatedStudents, 0) / parsedData.length) * 100).toFixed(1)}% of total
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-warning">
                    <Card.Body>
                      <Card.Title className="text-warning">Remaining to Allocate</Card.Title>
                      <h2 className="text-warning">
                        {allocationResults.reduce((sum, r) => sum + r.remainingStudents, 0)}
                      </h2>
                      <small className="text-muted">
                        Due to capacity constraints
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {/* Detailed Results */}
              <div className="accordion" id="allocationAccordion">
                {allocationResults.map((result, blockIndex) => (
                  <Card key={blockIndex} className="mb-3">
                    <Card.Header 
                      className={`d-flex justify-content-between align-items-center ${result.error ? 'bg-danger text-white' : 'bg-light'}`}
                      id={`heading-${blockIndex}`}
                    >
                      <div className="d-flex align-items-center">
                        <Button
                          variant="link"
                          className="text-decoration-none p-0 me-2"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${blockIndex}`}
                          aria-expanded="true"
                          aria-controls={`collapse-${blockIndex}`}
                        >
                          {result.error ? '❌' : '📊'}
                        </Button>
                        <span>
                          <strong>{result.blockName}</strong> - {result.districtName}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <Badge bg="info">
                          {result.totalStudents} students
                        </Badge>
                        <Badge bg="secondary">
                          Cap: {result.totalCapacity}
                        </Badge>
                        <Badge bg={result.remainingStudents === 0 ? "success" : "warning"}>
                          {result.remainingStudents === 0 ? "✓ Full" : `${result.remainingStudents} left`}
                        </Badge>
                        <Badge bg="light" text="dark">
                          {result.utilizationPercentage ? `${result.utilizationPercentage.toFixed(1)}% util` : 'N/A'}
                        </Badge>
                      </div>
                    </Card.Header>
                    
                    <div 
                      id={`collapse-${blockIndex}`} 
                      className="collapse show"
                      aria-labelledby={`heading-${blockIndex}`}
                      data-bs-parent="#allocationAccordion"
                    >
                      <Card.Body>
                        {result.error ? (
                          <Alert variant="danger">
                            <strong>Error:</strong> {result.error}
                          </Alert>
                        ) : (
                          <>
                            <Row className="mb-3">
                              <Col md={6}>
                                <div className="d-flex align-items-center">
                                  <div className="me-3">
                                    <div className="text-center">
                                      <div className="display-6">{result.allocatedStudents}</div>
                                      <small className="text-muted">Allocated</small>
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="progress" style={{ height: '25px' }}>
                                      <div 
                                        className="progress-bar bg-success" 
                                        role="progressbar" 
                                        style={{ 
                                          width: `${(result.allocatedStudents / result.totalStudents) * 100}%` 
                                        }}
                                      >
                                        Allocated: {result.allocatedStudents}
                                      </div>
                                      {result.remainingStudents > 0 && (
                                        <div 
                                          className="progress-bar bg-warning" 
                                          role="progressbar" 
                                          style={{ 
                                            width: `${(result.remainingStudents / result.totalStudents) * 100}%` 
                                          }}
                                        >
                                          Remaining: {result.remainingStudents}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="small">
                                  <div className="d-flex justify-content-between mb-1">
                                    <span>Capacity Utilization:</span>
                                    <span>
                                      <strong>{result.totalCapacity > 0 ? 
                                        `${((result.allocatedStudents / result.totalCapacity) * 100).toFixed(1)}%` : 'N/A'}
                                      </strong>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span>Centers in block:</span>
                                    <span><strong>{result.centers?.length || 0}</strong></span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            
                            <Table striped bordered hover className="mt-3">
                              <thead className="table-dark">
                                <tr>
                                  <th>#</th>
                                  <th>Center Name</th>
                                  <th>Sequence</th>
                                  <th>Capacity</th>
                                  <th>Allocated</th>
                                  <th>Remaining</th>
                                  <th>Utilization</th>
                                  <th>SRN Count</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.centers?.map((center, idx) => (
                                  <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                      <strong>{center.examinationVenue}</strong>
                                      <div className="small text-muted">
                                        Code: {center.examinationVenueCode}
                                      </div>
                                    </td>
                                    <td>
                                      <Badge bg="secondary">
                                        {center.examinationVenueSequenceInBlock}
                                      </Badge>
                                    </td>
                                    <td>{center.capacity}</td>
                                    <td>
                                      <Badge bg="success">
                                        {center.allocatedStudents}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Badge bg={center.capacity - center.allocatedStudents > 0 ? "warning" : "secondary"}>
                                        {center.capacity - center.allocatedStudents}
                                      </Badge>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="progress flex-grow-1 me-2" style={{ height: '15px' }}>
                                          <div 
                                            className="progress-bar" 
                                            role="progressbar" 
                                            style={{ 
                                              width: `${(center.allocatedStudents / center.capacity) * 100}%`,
                                              backgroundColor: center.allocatedStudents / center.capacity > 0.8 ? 
                                                '#dc3545' : 
                                                center.allocatedStudents / center.capacity > 0.6 ? 
                                                '#ffc107' : '#198754'
                                            }}
                                          ></div>
                                        </div>
                                        <span className="small">
                                          {((center.allocatedStudents / center.capacity) * 100).toFixed(1)}%
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <Button 
                                        variant="outline-info" 
                                        size="sm"
                                        onClick={() => {
                                          alert(`SRNs allocated to ${center.examinationVenue}:\n\n${
                                            center.allocatedSRNs?.slice(0, 50).join(', ') || 'None'
                                          }${center.allocatedSRNs?.length > 50 ? '\n\n... and ' + (center.allocatedSRNs.length - 50) + ' more' : ''}`);
                                        }}
                                      >
                                        View {center.allocatedSRNs?.length || 0} SRNs
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </>
                        )}
                      </Card.Body>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="success" onClick={exportToExcel} size="lg" className="me-2">
                  <FaFileExcel className="me-2" />
                  Download Complete Excel Report
                </Button>
                <Button variant="outline-primary" onClick={resetProcess} size="lg">
                  Start New Allocation
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
        
        <Card.Footer className="bg-light">
          <div className="small text-muted d-flex justify-content-between">
            <div>
              <strong>Center Allocation System v1.0</strong> • Automated proportional allocation
            </div>
            <div>
              Total Centers in System: {centers.length} • Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* CSS for step indicator */}
      <style jsx="true">{`
        .step {
          text-align: center;
          flex: 1;
          position: relative;
        }
        
        .step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin: 0 auto 10px;
          border: 3px solid #e9ecef;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        
        .step.active .step-circle {
          background-color: #0d6efd;
          color: white;
          border-color: #0d6efd;
          box-shadow: 0 0 0 5px rgba(13, 110, 253, 0.1);
        }
        
        .step-label {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .step.active .step-label {
          color: #0d6efd;
          font-weight: bold;
        }
        
        .step-connector {
          flex: 1;
          height: 3px;
          background-color: #e9ecef;
          margin-top: 25px;
          position: relative;
        }
        
        .step-content {
          min-height: 400px;
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .progress-bar {
          transition: width 1s ease-in-out;
        }
        
        .accordion-button::after {
          margin-left: 0;
        }
        
        .table th {
          white-space: nowrap;
        }
        
        .badge {
          font-size: 0.8em;
          font-weight: 500;
        }
        
        pre {
          font-size: 0.85em;
          line-height: 1.4;
        }
      `}</style>
    </Container>
  );
};