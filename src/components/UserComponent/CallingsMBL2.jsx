




// import React, { useMemo, useContext, useState, useEffect } from "react";
// import { UserContext } from "../NewContextApis/UserContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Badge,
//   Spinner,
//   Form,
//   Button,
//   Alert,
//   Table
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// import Select from 'react-select';

// import { GetTodayCallingStudents, UpdateCallingStatus } from "../../services/CallLeads/StudentCallingService";

// export const StudentCalling = () => {

 
//     return(

//         <>
//         </>
//     )
// }

import React, { useMemo, useContext, useState, useEffect } from "react";
import { UserContext } from "../NewContextApis/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Form,
  Button,
  Alert,
  Table
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { GetTodayCallingStudents, UpdateCallingStatus } from "../../services/CallLeads/StudentCallingService";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export const CallingsMB2 = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingRemark, setEditingRemark] = useState("");
  
  // Status options for dropdown
  const statusOptions = [
    { value: "Connected", label: "Connected" },
    { value: "Not Connected", label: "Not Connected" },
    { value: "Wrong Number", label: "Wrong Number" }
  ];
  
  // Remark options for dropdown
  const remarkOptions = [
    { value: "Teacher's Number", label: "Teacher's Number" },
    { value: "MB Level 2 Admit Card Downlaod", label: "MB Level 2 Admit Card Downlaod" },
    { value: "Parent's denied for exam", label: "Parent's denied for exam" },
    { value: "School denied for exam", label: "School denied for exam" },
    { value: "Not interested", label: "Not interested" },
    { value: "MB Level 1 exam not given", label: "MB Level 1 exam not given" },
  
  ];
  
  // Function to make phone call
  const makePhoneCall = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === "N/A") return;
    window.open(`tel:${phoneNumber}`, '_self');
  };
  
  // Function to make WhatsApp call
  const makeWhatsAppCall = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === "N/A") return;
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };
  
  // Fetch today's calling students
  const fetchTodayCallingStudents = async () => {
    if (!userData?.user?._id) {
      setError("User not logged in");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const reqBody = {
        CallerObjectId: userData?.user?._id
      };
      
      const result = await GetTodayCallingStudents(reqBody);
      
      if (result.success) {
        // Sort students: not called first (callingStatus is null or empty), then called
        const sortedStudents = (result.data || []).sort((a, b) => {
          const aCalled = a.callingStatus && a.callingStatus.trim() !== "";
          const bCalled = b.callingStatus && b.callingStatus.trim() !== "";
          
          if (!aCalled && bCalled) return -1; // a (not called) comes first
          if (aCalled && !bCalled) return 1;  // b (not called) comes first
          return 0; // maintain order if both have same status
        });
        
        setStudents(sortedStudents);
      } else {
        setError("Failed to fetch calling data");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching calling data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize editing for a student
  const startEditing = (student) => {
    // Only allow editing if callingStatus is null or empty
    if (student.callingStatus && student.callingStatus.trim() !== "") {
      setError("This student has already been called. Cannot edit again.");
      return;
    }
    
    setEditingId(student._id);
    setEditingStatus(student.callingStatus || "");
    setEditingRemark(student.remark || "");
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingStatus("");
    setEditingRemark("");
  };
  
  // Update calling status and remark
  const handleUpdateCallingStatus = async () => {
    if (!editingId) return;
    
    setUpdating(true);
    setError("");
    setSuccess("");
    
    try {
      const reqBody = {
        _id: editingId,
        callingStatus: editingStatus,
        remark: editingRemark
      };
      
      const result = await UpdateCallingStatus(reqBody);
      
      if (result.success) {
        setSuccess("Calling status updated successfully");
        
        // Update local state and re-sort
        setStudents(prevStudents => {
          const updatedStudents = prevStudents.map(student => 
            student._id === editingId 
              ? { ...student, callingStatus: editingStatus, remark: editingRemark }
              : student
          );
          
          // Re-sort after update
          return updatedStudents.sort((a, b) => {
            const aCalled = a.callingStatus && a.callingStatus.trim() !== "";
            const bCalled = b.callingStatus && b.callingStatus.trim() !== "";
            
            if (!aCalled && bCalled) return -1;
            if (aCalled && !bCalled) return 1;
            return 0;
          });
        });
        
        cancelEditing();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError("Failed to update calling status");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating calling status");
      console.error("Error:", err);
    } finally {
      setUpdating(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Connected":
        return "success";
      case "Not Connected":
        return "warning";
      case "Wrong Number":
        return "danger";
      default:
        return "secondary";
    }
  };
  
  // Check if student has been called
  const hasBeenCalled = (student) => {
    return student.callingStatus && student.callingStatus.trim() !== "";
  };
  
  // Get card border color based on calling status
  const getCardBorderColor = (student) => {
    if (student.callingStatus === "Connected") return "border-success";
    if (student.callingStatus === "Not Connected") return "border-warning";
    if (student.callingStatus === "Wrong Number") return "border-danger";
    return "";
  };
  
  // Effect to fetch data on component mount and when user changes
  useEffect(() => {
    if (userData?.user?._id) {
      fetchTodayCallingStudents();
    }
  }, [userData]);
  
  // Refresh data
  const handleRefresh = () => {
    fetchTodayCallingStudents();
    setSuccess("Data refreshed successfully");
    setTimeout(() => setSuccess(""), 3000);
  };
  
  // Calculate statistics
  const stats = {
    total: students.length,
    connected: students.filter(s => s.callingStatus === "Connected").length,
    notConnected: students.filter(s => s.callingStatus === "Not Connected").length,
    wrongNumber: students.filter(s => s.callingStatus === "Wrong Number").length,
    pending: students.filter(s => !hasBeenCalled(s)).length
  };
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h3 className="text-primary">Today's Calling Leads</h3>
          <p className="text-muted">
            View and update calling status for today's leads
            {userData?.user?.name && ` - ${userData?.user?.name}`}
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Refresh"
            )}
          </Button>
        </Col>
      </Row>
      
      {/* Alerts */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}
      
      {/* Summary Statistics */}
      {students.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <h6>Today's Calling Summary</h6>
            <Row>
              <Col xs={6} md={3} className="mb-2">
                <div className="text-center">
                  <Badge bg="primary" className="p-2 w-100 d-block">
                    Total: {stats.total}
                  </Badge>
                </div>
              </Col>
              <Col xs={6} md={3} className="mb-2">
                <div className="text-center">
                  <Badge bg="success" className="p-2 w-100 d-block">
                    Connected: {stats.connected}
                  </Badge>
                </div>
              </Col>
              <Col xs={6} md={3} className="mb-2">
                <div className="text-center">
                  <Badge bg="warning" className="p-2 w-100 d-block">
                    Not Connected: {stats.notConnected}
                  </Badge>
                </div>
              </Col>
              <Col xs={6} md={3} className="mb-2">
                <div className="text-center">
                  <Badge bg="danger" className="p-2 w-100 d-block">
                    Wrong Numbers: {stats.wrongNumber}
                  </Badge>
                </div>
              </Col>
              <Col xs={12} className="mt-2">
                <div className="text-center">
                  <Badge bg="info" className="p-2 w-100 d-block">
                    Pending Calls: {stats.pending}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      {/* Main Content */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading calling data...</p>
        </div>
      ) : students.length === 0 ? (
        <Alert variant="info">
          No calling records found for today. Start by adding some calling data.
        </Alert>
      ) : (
        <Row>
          {students.map((student) => (
            <Col key={student._id} lg={6} className="mb-4">
              <Card className={`h-100 shadow-sm ${getCardBorderColor(student)}`}>
                <Card.Header className={`bg-light d-flex justify-content-between align-items-center ${hasBeenCalled(student) ? 'bg-success bg-opacity-10' : ''}`}>
                  <div>
                    <strong>SRN: {student.srn}</strong>
                    <Badge 
                      bg={getStatusBadge(student.callingStatus)} 
                      className="ms-2"
                    >
                      {student.callingStatus || "Pending Call"}
                    </Badge>
                  </div>
                  <small className="text-muted">
                    {formatTime(student.callingDate)}
                  </small>
                </Card.Header>
                
                <Card.Body>
                  {/* Student Basic Info */}
                  <div className="mb-3">
                    <h6 className="text-primary">{student.name}</h6>
                    <p className="mb-1">
                      <strong>Father:</strong> {student.father}
                    </p>
                    <p className="mb-1">
                      <strong>Class:</strong> {student.classOfStudent}
                    </p>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mb-3">
                    <h6>Contact Information</h6>
                    <Row>
                      <Col sm={6}>
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-2">Mobile:</strong>
                          {student.mobile && student.mobile !== "N/A" ? (
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={() => makePhoneCall(student.mobile)}
                            >
                              <FaPhoneAlt className="me-1" />
                              {student.mobile}
                            </Button>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-2">WhatsApp:</strong>
                          {student.whatsapp && student.whatsapp !== "N/A" ? (
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={() => makeWhatsAppCall(student.whatsapp)}
                            >
                              <FaWhatsapp className="me-1" />
                              {student.whatsapp}
                            </Button>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-2">OMR 1:</strong>
                          {student.omrcontact1 && student.omrcontact1 !== "N/A" ? (
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={() => makePhoneCall(student.omrcontact1)}
                            >
                              <FaPhoneAlt className="me-1" />
                              {student.omrcontact1}
                            </Button>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-2">OMR 2:</strong>
                          {student.omrcontact2 && student.omrcontact2 !== "N/A" ? (
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={() => makePhoneCall(student.omrcontact2)}
                            >
                              <FaPhoneAlt className="me-1" />
                              {student.omrcontact2}
                            </Button>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  {/* Level 2 Exam Info */}
                  <div className="mb-3">
                    <h6>Level 2 Examination Details</h6>
                    <p className="mb-1">
                      <strong>District:</strong> {student.L2ExaminationDistrict || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Block:</strong> {student.L2ExaminationBlock || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Center:</strong> {student.L2ExaminationCenter || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong> {formatDate(student.L2ExaminationDate)}
                    </p>
                  </div>
                  
                  {/* Current Status and Remark */}
                  <div className="mb-3">
                    <h6>Call Status</h6>
                    <p className="mb-1">
                      <strong>Status:</strong> {student.callingStatus || "Pending"}
                    </p>
                    <p className="mb-1">
                      <strong>Remark:</strong> {student.remark || "No remark"}
                    </p>
                  </div>
                  
                  {/* Edit Form - Always shown if not called yet */}
                  {!hasBeenCalled(student) && editingId === student._id ? (
                    <div className="border rounded p-3 bg-light">
                      <h6 className="mb-3">Update Calling Status</h6>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Calling Status <span className="text-danger">*</span></Form.Label>
                        <Select
                          options={statusOptions}
                          value={statusOptions.find(opt => opt.value === editingStatus)}
                          onChange={(selected) => setEditingStatus(selected?.value || "")}
                          placeholder="Select status..."
                          isClearable
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Remark</Form.Label>
                        <Select
                          options={remarkOptions}
                          value={remarkOptions.find(opt => opt.value === editingRemark)}
                          onChange={(selected) => setEditingRemark(selected?.value || "")}
                          placeholder="Select remark..."
                          isClearable
                        />
                      </Form.Group>
                      
                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          onClick={handleUpdateCallingStatus}
                          disabled={updating || !editingStatus}
                        >
                          {updating ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Update"
                          )}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={cancelEditing}
                          disabled={updating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : !hasBeenCalled(student) ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => startEditing(student)}
                    >
                      Update Calling Status
                    </Button>
                  ) : (
                    <Alert variant="success" className="py-2">
                      <strong>Called:</strong> This student has already been contacted.
                    </Alert>
                  )}
                </Card.Body>
                
                <Card.Footer className="text-muted small">
                  Last updated: {formatDate(student.updatedAt)} {formatTime(student.updatedAt)}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};