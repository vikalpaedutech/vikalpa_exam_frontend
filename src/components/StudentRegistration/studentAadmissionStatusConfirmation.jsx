import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Badge, InputGroup, Modal } from "react-bootstrap";
import { GetAttendanceSheetDataCounselling, updateCounsellingFields } from "../../services/StudentRegistrationServices/StudentRegistrationService";
import MBCenters from "../StudentRegistration/MBCenters.json";

export const StudentAdmissionStatusConfirmation = () => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [srnInput, setSrnInput] = useState("");
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [studentNotFound, setStudentNotFound] = useState(false);
  const [showDocVerificationAlert, setShowDocVerificationAlert] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
  
  // Center Preference States
  const [centers, setCenters] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict1, setSelectedDistrict1] = useState("");
  const [selectedDistrict2, setSelectedDistrict2] = useState("");
  const [availableCenters1, setAvailableCenters1] = useState([]);
  const [availableCenters2, setAvailableCenters2] = useState([]);
  const [formData, setFormData] = useState({
    centerPreference1: "",
    centerPreference2: "",
    homeToCp1Distance: "",
    homeToCp2Distance: "",
    slc: false
  });

  // Extract unique districts from centers data
  useEffect(() => {
    if (MBCenters && Array.isArray(MBCenters)) {
      console.log("MBCenters loaded:", MBCenters.length);
      setCenters(MBCenters);
      
      // Extract unique district names
      const uniqueDistricts = [...new Map(MBCenters.map(center => [center.districtName, center])).values()];
      console.log("Unique districts found:", uniqueDistricts.length);
      setDistricts(uniqueDistricts);
    }
  }, []);

  // Filter centers when district1 changes
  useEffect(() => {
    if (selectedDistrict1 && centers.length > 0) {
      const filtered = centers.filter(center => center.districtName === selectedDistrict1);
      setAvailableCenters1(filtered);
    } else {
      setAvailableCenters1([]);
    }
  }, [selectedDistrict1, centers]);

  // Filter centers when district2 changes
  useEffect(() => {
    if (selectedDistrict2 && centers.length > 0) {
      const filtered = centers.filter(center => center.districtName === selectedDistrict2);
      setAvailableCenters2(filtered);
    } else {
      setAvailableCenters2([]);
    }
  }, [selectedDistrict2, centers]);

  // Load student data into form when currentStudent changes
  useEffect(() => {
    if (currentStudent && centers.length > 0) {
      // Load existing data from DB
      const existingCP1 = currentStudent.centerPreference1 || "";
      const existingCP2 = currentStudent.centerPreference2 || "";
      const existingDist1 = currentStudent.homeToCp1Distance || "";
      const existingDist2 = currentStudent.homeToCp2Distance || "";
      const existingSlc = currentStudent.slc || false;
      
      setFormData({
        centerPreference1: existingCP1,
        centerPreference2: existingCP2,
        homeToCp1Distance: existingDist1,
        homeToCp2Distance: existingDist2,
        slc: existingSlc
      });
      
      // Set districts based on existing preferences
      if (existingCP1) {
        const center1 = centers.find(c => c.centerName === existingCP1);
        if (center1) {
          setSelectedDistrict1(center1.districtName);
        }
      }
      if (existingCP2) {
        const center2 = centers.find(c => c.centerName === existingCP2);
        if (center2) {
          setSelectedDistrict2(center2.districtName);
        }
      }
    }
  }, [currentStudent, centers]);

  const handleSRNSearch = async () => {
    if (!srnInput.trim()) {
      setError("Please enter SRN");
      return;
    }

    setSearchingStudent(true);
    setError("");
    setStudentNotFound(false);
    setCurrentStudent(null);
    setShowDocVerificationAlert(false);
    
    try {
      const response = await GetAttendanceSheetDataCounselling({ srn: srnInput.trim() });
      console.log("Full response:", response);
      
      let student = null;
      
      if (response && response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          student = response.data[0];
        } else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          student = response.data.data[0];
        } else if (typeof response.data === 'object' && response.data._id) {
          student = response.data;
        }
      } else if (Array.isArray(response) && response.length > 0) {
        student = response[0];
      } else if (response && response._id) {
        student = response;
      }
      
      if (student) {
        if (!hasCompletedDocVerification(student)) {
          setShowDocVerificationAlert(true);
          setSearchingStudent(false);
          return;
        }
        
        setCurrentStudent(student);
        setStudentNotFound(false);
        setSuccessMessage(`✓ Student found: ${student.name}`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setStudentNotFound(true);
        setError(`No student found with SRN: ${srnInput}`);
      }
    } catch (error) {
      console.error("Error fetching student data", error);
      setError("An error occurred while fetching student data: " + (error.message || "Unknown error"));
      setStudentNotFound(true);
    } finally {
      setSearchingStudent(false);
    }
  };

  const hasCompletedDocVerification = (student) => {
    const validStatuses = ["Admission Done", "Provisional", "Waiting", "Selected-absent",  "Waiting-absent" ];
    return student.finalAdmissionStatus && validStatuses.includes(student.finalAdmissionStatus);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!currentStudent) {
      setError("No student selected");
      return;
    }

    setUpdatingData(true);
    setError("");
    setSuccessMessage("");

    try {
      // Sirf wahi fields bhejo jo change hui hai
      const updatePayload = {
        _id: currentStudent._id
      };
      
      // Check karo konsi field update karni hai
      if (formData.centerPreference1 !== currentStudent.centerPreference1) {
        updatePayload.centerPreference1 = formData.centerPreference1;
      }
      
      if (formData.centerPreference2 !== currentStudent.centerPreference2) {
        updatePayload.centerPreference2 = formData.centerPreference2 || null;
      }
      
      if (formData.homeToCp1Distance !== currentStudent.homeToCp1Distance) {
        updatePayload.homeToCp1Distance = formData.homeToCp1Distance ? parseFloat(formData.homeToCp1Distance) : null;
      }
      
      if (formData.homeToCp2Distance !== currentStudent.homeToCp2Distance) {
        updatePayload.homeToCp2Distance = formData.homeToCp2Distance ? parseFloat(formData.homeToCp2Distance) : null;
      }
      
      if (formData.slc !== currentStudent.slc) {
        updatePayload.slc = formData.slc;
        updatePayload.finalAdmissionStatus = formData.slc ? "Admission Done" : "Provisional";
      }
      
      // Agar kuch bhi update karne ko nahi hai
      if (Object.keys(updatePayload).length === 1) {
        setError("No changes to update");
        setUpdatingData(false);
        return;
      }
      
      console.log("Updating counselling fields:", updatePayload);
      
      const response = await updateCounsellingFields(updatePayload);
      console.log("Update response:", response);
      
      if (response && response.success) {
        // Show success modal instead of alert
        setShowSuccessModal(true);
        // Update current student with new data
        setCurrentStudent(prev => ({
          ...prev,
          ...updatePayload
        }));
        // Auto close modal after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        setError(response?.message || "Failed to update student data");
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      setError(error.response?.data?.message || "An error occurred while updating student data");
    } finally {
      setUpdatingData(false);
    }
  };

  const handleReset = () => {
    setCurrentStudent(null);
    setSrnInput("");
    setError("");
    setSuccessMessage("");
    setStudentNotFound(false);
    setFormData({
      centerPreference1: "",
      centerPreference2: "",
      homeToCp1Distance: "",
      homeToCp2Distance: "",
      slc: false
    });
    setSelectedDistrict1("");
    setSelectedDistrict2("");
    setAvailableCenters1([]);
    setAvailableCenters2([]);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Selected":
        return <Badge bg="success">Selected</Badge>;
      case "Waiting":
        return <Badge bg="warning" text="dark">Waiting</Badge>;
      default:
        return <Badge bg="secondary">{status || "N/A"}</Badge>;
    }
  };

  const getAdmissionStatusBadge = (status) => {
    switch(status) {
      case "Admission Done":
        return <Badge bg="success">Admission Done</Badge>;
      case "Provisional":
        return <Badge bg="warning" text="dark">Provisional</Badge>;
      case "Waiting":
        return <Badge bg="secondary">Waiting</Badge>;
      default:
        return <Badge bg="info">{status || "Not Set"}</Badge>;
    }
  };

  const closeDocVerificationAlert = () => {
    setShowDocVerificationAlert(false);
    setSrnInput("");
  };

  return (
    <Container fluid className="mt-4">
      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered backdrop="static">
        <Modal.Header style={{ background: '#28a745', color: 'white', borderBottom: 'none' }}>
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '1.5rem' }}></i>
            Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-check-circle" style={{ fontSize: '4rem', color: '#28a745' }}></i>
          <h4 className="mt-3">Student Data Updated Successfully!</h4>
          <p className="text-muted mt-2">
            The student's information has been updated in the database.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-top-0">
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            <i className="bi bi-check-circle me-2"></i>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Document Verification Alert */}
      <Modal show={showDocVerificationAlert} onHide={closeDocVerificationAlert} centered>
        <Modal.Header closeButton style={{ background: '#dc3545', color: 'white' }}>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Document Verification Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-file-earmark-x" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
          <h5 className="mt-3">Please Complete Document Verification First</h5>
          <p className="text-muted mt-2">
            This student has not completed the document verification process.
            <br />
            Please go to <strong>Document Verification</strong> section and verify all documents first.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeDocVerificationAlert}>
            <i className="bi bi-check-circle me-2"></i>
            OK, Go Back
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={12}>
          {!currentStudent ? (
            <Card className="shadow-lg border-0 bg-gradient-search">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="search-icon mb-3">
                    <i className="bi bi-search-heart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
                  </div>
                  <h3 className="mb-2">Student Admission Status & Center Preference</h3>
                  <p className="text-muted">Enter SRN to view and update student details</p>
                </div>
                
                {successMessage && (
                  <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                    {successMessage}
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" onClose={() => setError("")} dismissible>
                    {error}
                  </Alert>
                )}
                
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Form.Group>
                      <InputGroup className="shadow-lg" style={{ borderRadius: '50px', overflow: 'hidden' }}>
                        <InputGroup.Text style={{ background: '#fff', border: 'none', padding: '12px 20px' }}>
                          <i className="bi bi-person-badge" style={{ fontSize: '1.2rem', color: '#667eea' }}></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter Student SRN"
                          value={srnInput}
                          onChange={(e) => setSrnInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSRNSearch()}
                          disabled={searchingStudent}
                          autoFocus
                          style={{ padding: '12px', border: 'none', fontSize: '1.1rem' }}
                        />
                        <Button 
                          variant="primary" 
                          onClick={handleSRNSearch}
                          disabled={searchingStudent || !srnInput.trim()}
                          style={{ padding: '12px 30px', borderRadius: '0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                        >
                          {searchingStudent ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            <>
                              <i className="bi bi-search me-2"></i>
                              Search
                            </>
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-gradient-primary text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h5 className="mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Student: {currentStudent.name} ({currentStudent.srn})
                  </h5>
                  <div className="d-flex gap-2 mt-2 mt-sm-0">
                    {getStatusBadge(currentStudent.selectionStatusForL3)}
                    {getAdmissionStatusBadge(currentStudent.finalAdmissionStatus)}
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" onClose={() => setError("")} dismissible className="mb-4">
                    {error}
                  </Alert>
                )}

                {/* Student Basic Info */}
                <Row className="mb-4">
                  <Col md={3}>
                    <div className="detail-card">
                      <div className="detail-icon"><i className="bi bi-person-circle"></i></div>
                      <div><label className="detail-label">Father</label><div>{currentStudent.father || "N/A"}</div></div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="detail-card">
                      <div className="detail-icon"><i className="bi bi-person"></i></div>
                      <div><label className="detail-label">Mother</label><div>{currentStudent.mother || "N/A"}</div></div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="detail-card">
                      <div className="detail-icon"><i className="bi bi-geo-alt"></i></div>
                      <div><label className="detail-label">District</label><div>{currentStudent.schoolDistrict || "N/A"}</div></div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="detail-card">
                      <div className="detail-icon"><i className="bi bi-building"></i></div>
                      <div><label className="detail-label">Venue</label><div>{currentStudent.counsellingVenue || "N/A"}</div></div>
                    </div>
                  </Col>
                </Row>

                <hr />

                {/* Center Preference Form */}
                <h5 className="mb-3">Center Preferences & Distance</h5>
                
                {/* CP1 - Row 1 */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CP1 - Select District</Form.Label>
                      <Form.Select
                        value={selectedDistrict1}
                        onChange={(e) => setSelectedDistrict1(e.target.value)}
                      >
                        <option value="">-- Select District --</option>
                        {districts.map((district, idx) => (
                          <option key={idx} value={district.districtName}>
                            {district.districtName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CP1 - Select Center</Form.Label>
                      <Form.Select
                        value={formData.centerPreference1}
                        onChange={(e) => handleInputChange("centerPreference1", e.target.value)}
                        disabled={!selectedDistrict1}
                      >
                        <option value="">-- Select Center --</option>
                        {availableCenters1.map((center, idx) => (
                          <option key={idx} value={center.centerName}>
                            {center.centerName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CP1 - Distance from Home (km)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        placeholder="Enter distance in kilometers"
                        value={formData.homeToCp1Distance}
                        onChange={(e) => handleInputChange("homeToCp1Distance", e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr />

                {/* CP2 - Optional */}
                <h5 className="mb-3 mt-3">Center Preference 2 (Optional)</h5>
                
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CP2 - Select District</Form.Label>
                      <Form.Select
                        value={selectedDistrict2}
                        onChange={(e) => setSelectedDistrict2(e.target.value)}
                      >
                        <option value="">-- Select District --</option>
                        {districts.map((district, idx) => (
                          <option key={idx} value={district.districtName}>
                            {district.districtName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CP2 - Select Center</Form.Label>
                      <Form.Select
                        value={formData.centerPreference2}
                        onChange={(e) => handleInputChange("centerPreference2", e.target.value)}
                        disabled={!selectedDistrict2}
                      >
                        <option value="">-- Select Center --</option>
                        {availableCenters2.map((center, idx) => (
                          <option key={idx} value={center.centerName}>
                            {center.centerName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CP2 - Distance from Home (km)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        placeholder="Enter distance in kilometers"
                        value={formData.homeToCp2Distance}
                        onChange={(e) => handleInputChange("homeToCp2Distance", e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr />

                {/* SLC Status and Admission Status */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        id="slc-checkbox"
                        label={
                          <span className="fw-bold">
                            SLC (Student Leaving Certificate) Submitted
                          </span>
                        }
                        checked={formData.slc}
                        onChange={(e) => handleInputChange("slc", e.target.checked)}
                        className="mb-2"
                      />
                      <Form.Text className="text-muted">
                        Check this box if student has submitted SLC
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <div className="p-3 bg-light rounded">
                      <label className="fw-bold mb-2">Final Admission Status will be:</label>
                      <div>
                        {formData.slc ? (
                          <Badge bg="success" style={{ fontSize: '1rem', padding: '8px 15px' }}>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Admission Done
                          </Badge>
                        ) : (
                          <Badge bg="warning" text="dark" style={{ fontSize: '1rem', padding: '8px 15px' }}>
                            <i className="bi bi-clock-history me-2"></i>
                            Provisional
                          </Badge>
                        )}
                      </div>
                      <small className="text-muted d-block mt-2">
                        {formData.slc ? 
                          "SLC submitted → Admission Done" : 
                          "SLC not submitted → Provisional Admission"}
                      </small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <Button variant="danger" onClick={handleReset} className="px-4">
                    <i className="bi bi-x-circle me-2"></i>
                    Reset
                  </Button>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={handleSubmit}
                      disabled={updatingData}
                      className="px-4"
                    >
                      {updatingData ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Save & Update
                        </>
                      )}
                    </Button>
                    <Button variant="primary" onClick={handleReset} className="px-4">
                      <i className="bi bi-arrow-right-circle me-2"></i>
                      Next Student
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          )}
        </Col>
      </Row>

      <style jsx>{`
        .bg-gradient-search {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 15px;
        }
        
        .detail-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 10px;
        }
        
        .detail-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          color: white;
          font-size: 1.2rem;
        }
        
        .detail-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #6c757d;
          margin-bottom: 3px;
        }
        
        @media (max-width: 768px) {
          .detail-card {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </Container>
  );
};