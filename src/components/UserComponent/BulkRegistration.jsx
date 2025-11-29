import React, { useContext, useState, useEffect } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Alert,
    Spinner,
    Table,
    Form,
    Modal,
} from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
import { DistrictBlockSchoolDependentDropDownContext } from "../NewContextApis/District_block_schoolsCotextApi.js";
import { UserContext } from "../NewContextApis/UserContext.js";
import { createStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

export const BulkRegistrations = () => {
    const navigate = useNavigate();

    const context = useContext(DistrictBlockSchoolDependentDropDownContext);
    const { userData } = useContext(UserContext);
    const {
        districtContext,
        blockContext,
        schoolContext,
        setDistrictContext,
        setBlockContext,
        setSchoolContext,
    } = context || {};

    const [selectedClass, setSelectedClass] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [uploadResults, setUploadResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const classOptions = [
        { value: "8", label: "8" },
        { value: "10", label: "10" },
    ];

    const isDownloadEnabled = selectedClass && districtContext && blockContext && schoolContext;

    const isUploadEnabled = selectedClass && districtContext && blockContext && schoolContext && csvFile;

    const isUserLoggedIn = userData?.user?._id;

    useEffect(() => {
        if (setDistrictContext) setDistrictContext(null);
        if (setBlockContext) setBlockContext(null);
        if (setSchoolContext) setSchoolContext(null);
        setSelectedClass("");
        setCsvFile(null);
        setUploadResults([]);
        setAlert(null);
        setShowSuccessAlert(false);
    }, [setDistrictContext, setBlockContext, setSchoolContext]);

    const getPercentageHeader = () => {
        if (selectedClass === "8") return "class7thAnnualExamPercentage";
        if (selectedClass === "10") return "class09thAnnualExamPercentage";
        return "previousClassAnnualExamPercentage";
    };

    const getSanitizedSchoolForFilename = () => {
        const raw = schoolContext?.label || "school";
        return String(raw)
            .trim()
            .replace(/[^A-Za-z0-9_\- ]/g, "")
            .replace(/\s+/g, "_");
    };

    const downloadTemplate = () => {
        if (!isDownloadEnabled) return;

        const percentageHeader = getPercentageHeader();

        const headers = [
            "srn",
            "name",
            "father",
            "mother",
            "dob",
            "gender",
            "category",
            "aadhar",
            "mobile",
            "whatsapp",
            "houseNumber",
            "cityTownVillage",
            "addressBlock",
            "addressDistrict",
            "addressState",
            percentageHeader,
        ];

        const sampleData = [
            '="1234567890"',
            "STUDENT NAME",
            "FATHER NAME",
            "MOTHER NAME",
            "01-01-2008",
            "Male",
            "GEN",
            '="123456789012"',
            '="9876543210"',
            '="9876543210"',
            "HNO-123",
            "CITY NAME",
            "BLOCK NAME",
            "DISTRICT NAME",
            "STATE NAME",
            "85.50",
        ];

        let csvContent = headers.join(",") + "\n";
        csvContent += sampleData.join(",") + "\n";

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const schoolFilePart = getSanitizedSchoolForFilename();
        link.href = url;
        link.setAttribute("download", `${schoolFilePart}_${selectedClass}_template.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvText = e.target.result;
                    const lines = csvText.split("\n").filter(line => line.trim() && !line.startsWith("#"));

                    if (lines.length < 2) {
                        reject(new Error("CSV file must contain headers and at least one data row"));
                        return;
                    }

                    const headers = lines[0].split(",").map(h => h.trim());
                    const data = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(",");
                        const row = {};

                        headers.forEach((header, index) => {
                            let value = values[index] ? values[index].trim() : "";

                            if (header === 'dob' && value) {
                                value = convertDDMMYYYYToISO(value);
                            }

                            if (header === 'aadhar' && value) {
                                const excelFormulaMatch = value.match(/^="?(.+?)"$/);
                                if (excelFormulaMatch) value = excelFormulaMatch[1];
                                value = String(value).trim();
                            }

                            if ((header === 'srn' || header === 'mobile' || header === 'whatsapp') && value) {
                                const excelFormulaMatch = value.match(/^="?(.+?)"$/);
                                if (excelFormulaMatch) value = excelFormulaMatch[1];
                                value = String(value).replace(/\D+/g, "");
                            }

                            row[header] = value;
                        });

                        data.push(row);
                    }

                    resolve(data);
                } catch (error) {
                    reject(new Error("Error parsing CSV file: " + error.message));
                }
            };
            reader.onerror = () => reject(new Error("Please Reload the page."));
            reader.readAsText(file);
        });
    };

    const convertDDMMYYYYToISO = (dateString) => {
        try {
            const parts = dateString.split('-');
            if (parts.length !== 3) {
                throw new Error("Invalid date format");
            }

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);

            const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }

            const isoString = date.toISOString();
            return isoString;
        } catch (error) {
            console.error("Date conversion error:", error);
            return dateString;
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setAlert({ type: "danger", message: "Please upload a valid CSV file" });
                return;
            }
            setCsvFile(file);
            setUploadResults([]);
            setAlert(null);
            setShowSuccessAlert(false);
        }
    };

    const validateSchoolDetails = () => {
        if (!districtContext || !districtContext.label || !districtContext.value) {
            return "Please select District before uploading";
        }
        if (!blockContext || !blockContext.label || !blockContext.value) {
            return "Please select Block before uploading";
        }
        if (!schoolContext || !schoolContext.label || !schoolContext.value) {
            return "Please select School before uploading";
        }
        if (!selectedClass) {
            return "Please select Class before uploading";
        }
        return null;
    };

    const trim = (s) => (typeof s === "string" ? s.trim() : s);
    const toUpperTrim = (s) => trim(String(s || "")).toUpperCase();
    const onlyDigits = (value, maxLen = 10) => String(value || "").replace(/\D+/g, "").slice(0, maxLen);
    const onlyAlphaSpace = (value) => String(value || "").replace(/[^A-Za-z\s\u00A0-\u017F]/g, "");
    const alphaNumUpper = (value, maxLen = 100) => String(value || "").replace(/[^A-Za-z0-9\s\-\/]/g, "").slice(0, maxLen).trim().toUpperCase();
    const sanitizePercentage = (value) => {
        const v = String(value || "").trim();
        const cleaned = v.replace(/[^0-9.]/g, "");
        const parts = cleaned.split(".");
        if (parts.length <= 1) return parts[0].slice(0, 3);
        const integer = parts[0].slice(0, 3);
        const decimal = parts[1].slice(0, 2);
        return `${integer}.${decimal}`;
    };

    const validateRow = (row, index) => {
        const errors = [];

        const percentageHeader = getPercentageHeader();

        const requiredFields = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp"];
        requiredFields.forEach(field => {
            if (!row[field] || String(row[field]).trim() === "") {
                errors.push(`${field} is required`);
            }
        });

        const addressFields = ["cityTownVillage", "addressBlock", "addressDistrict", "addressState"];
        addressFields.forEach(field => {
            if (!row[field] || String(row[field]).trim() === "") {
                errors.push(`${field} must not be empty`);
            }
        });

        if (row.srn && !/^\d{10}$/.test(row.srn)) {
            errors.push("SRN must be exactly 10 digits");
        }

        ["name", "father", "mother"].forEach(field => {
            if (row[field] && !/^[A-Za-z\s]+$/.test(row[field])) {
                errors.push(`${field} must contain only alphabets and spaces`);
            }
        });

        if (row.mobile && !/^\d{10}$/.test(row.mobile)) {
            errors.push("Mobile must be 10 digits");
        }
        if (row.whatsapp && !/^\d{10}$/.test(row.whatsapp)) {
            errors.push("WhatsApp must be 10 digits");
        }

        // FIXED: Percentage validation logic
        const percentageValue = row[percentageHeader];
        if (!percentageValue || String(percentageValue).trim() === "") {
            errors.push("Percentage is required");
        } else {
            const cleanedValue = String(percentageValue).trim();
            if (!/^\d{1,3}(\.\d{1,2})?$/.test(cleanedValue)) {
                errors.push("Percentage must be valid (up to 3 digits with 2 decimals)");
            } else {
                const numValue = parseFloat(cleanedValue);
                if (numValue < 0 || numValue > 100) {
                    errors.push("Percentage must be between 0 and 100");
                }
            }
        }

        if (row.dob) {
            try {
                const date = new Date(row.dob);
                if (isNaN(date.getTime())) {
                    errors.push("Invalid date format for DOB");
                } else {
                    const isoDate = date.toISOString();
                    if (!isoDate.endsWith('T00:00:00.000Z')) {
                        errors.push("DOB must be in correct UTC format");
                    }
                }
            } catch (error) {
                errors.push("Invalid date format for DOB");
            }
        }

        return {
            rowIndex: index + 1,
            isValid: errors.length === 0,
            errors: errors,
            data: row
        };
    };

    const clearAllData = () => {
        window.location.reload();
    };

    const processBulkUpload = async () => {
        if (!isUserLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        const schoolValidationError = validateSchoolDetails();
        if (schoolValidationError) {
            setAlert({ type: "danger", message: schoolValidationError });
            return;
        }

        if (!csvFile) {
            setAlert({ type: "danger", message: "Please select a CSV file first." });
            return;
        }

        setLoading(true);
        setUploadResults([]);
        setAlert(null);
        setShowSuccessAlert(false);

        try {
            const csvData = await parseCSV(csvFile);
            const validationResults = csvData.map((row, index) => validateRow(row, index));

            setUploadResults(validationResults);

            const validRows = validationResults.filter(result => result.isValid);
            const invalidRows = validationResults.filter(result => !result.isValid);

            if (invalidRows.length > 0) {
                setAlert({
                    type: "warning",
                    message: `${invalidRows.length} rows have validation errors. ${validRows.length} valid rows will be uploaded immediately.`
                });
            }

            const processResults = [...validationResults];
            setUploadResults([...processResults]);

            const percentageHeader = getPercentageHeader();

            for (let i = 0; i < validRows.length; i++) {
                const result = validRows[i];

                try {
                    const formData = new FormData();
                    const row = result.data;

                    const slipId = (row.name?.slice(0, 3) || "STU").toUpperCase() + (row.srn?.slice(-5) || "00000");
                    const registrationDate = new Date().toISOString();

                    let dobValue = row.dob;
                    if (dobValue) {
                        const date = new Date(dobValue);
                        if (!isNaN(date.getTime())) {
                            const utcDate = new Date(Date.UTC(
                                date.getUTCFullYear(),
                                date.getUTCMonth(),
                                date.getUTCDate(),
                                0, 0, 0, 0
                            ));
                            dobValue = utcDate.toISOString();
                        }
                    }

                    formData.append("slipId", trim(slipId));
                    formData.append("srn", trim(row.srn));
                    formData.append("name", toUpperTrim(row.name));
                    formData.append("father", toUpperTrim(row.father));
                    formData.append("mother", toUpperTrim(row.mother));
                    formData.append("dob", dobValue);
                    formData.append("gender", trim(row.gender).toUpperCase());
                    formData.append("category", trim(row.category).toUpperCase());
                    formData.append("aadhar", trim(String(row.aadhar || "")));
                    formData.append("mobile", trim(row.mobile));
                    formData.append("whatsapp", trim(row.whatsapp));
                    formData.append("registrationDate", registrationDate);
                    formData.append("isRegisteredBy", userData.user._id);
                    formData.append("isBulkRegistered", "true");

                    formData.append("houseNumber", alphaNumUpper(row.houseNumber || ""));
                    formData.append("cityTownVillage", alphaNumUpper(row.cityTownVillage || ""));
                    formData.append("addressBlock", alphaNumUpper(row.addressBlock || ""));
                    formData.append("addressDistrict", alphaNumUpper(row.addressDistrict || ""));
                    formData.append("addressState", alphaNumUpper(row.addressState || ""));

                    formData.append("schoolDistrict", toUpperTrim(districtContext?.label || ""));
                    formData.append("schoolDistrictCode", trim(districtContext?.value || ""));
                    formData.append("schoolBlock", toUpperTrim(blockContext?.label || ""));
                    formData.append("schoolBlockCode", trim(blockContext?.value || ""));
                    formData.append("school", toUpperTrim(schoolContext?.label || ""));
                    formData.append("schoolCode", trim(schoolContext?.value || ""));

                    formData.append("previousClassAnnualExamPercentage", trim(row[percentageHeader] || ""));
                    formData.append("classOfStudent", trim(selectedClass));
                    formData.append("isVerified", trim("Verified"));
                    formData.append("verifiedBy", trim("Bulk-Upload"));

                    const response = await createStudent(formData);

                    const resultIndex = processResults.findIndex(r => r.rowIndex === result.rowIndex);
                    if (resultIndex !== -1) {
                        processResults[resultIndex] = {
                            ...processResults[resultIndex],
                            status: "success",
                            message: "Student created successfully",
                            studentId: response.data?._id
                        };
                    }

                } catch (error) {
                    const resultIndex = processResults.findIndex(r => r.rowIndex === result.rowIndex);
                    if (resultIndex !== -1) {
                        processResults[resultIndex] = {
                            ...processResults[resultIndex],
                            status: "error",
                            message: error.response?.data?.message || error.message || "Failed to create student"
                        };
                    }
                }

                setUploadResults([...processResults]);
            }

            const successful = processResults.filter(r => r.status === "success").length;
            const failed = processResults.filter(r => r.status === "error").length;
            const invalid = processResults.filter(r => !r.isValid).length;

            const finalMessage = `Bulk upload completed: ${successful} successful, ${failed} failed, ${invalid} invalid out of ${processResults.length} total rows`;
            setSuccessMessage(finalMessage);
            setShowSuccessAlert(true);

        } catch (error) {
            console.error("Bulk upload error:", error);
            setAlert({
                type: "danger",
                message: error.message || "Failed to process CSV file"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        setShowLoginModal(false);
        navigate('/exam-user-login');
    };

    const downloadFailedEntriesCSV = () => {
        const failedRows = uploadResults.filter(r => (r.status === "error") || (!r.isValid));
        if (!failedRows.length) return;

        const percentageHeader = getPercentageHeader();
        const headerSet = new Set();
        const preferred = ["srn", "name", "father", "mother", "dob", "gender", "category", "aadhar", "mobile", "whatsapp", "houseNumber", "cityTownVillage", "addressBlock", "addressDistrict", "addressState", percentageHeader];
        preferred.forEach(h => headerSet.add(h));
        failedRows.forEach(r => {
            Object.keys(r.data || {}).forEach(k => headerSet.add(k));
        });

        headerSet.add("failureReason");

        const headers = Array.from(headerSet);

        const csvEscape = (val) => {
            if (val === null || val === undefined) return "";
            const s = String(val);
            if (s.includes(",") || s.includes('"') || s.includes("\n")) {
                return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        };

        let csv = headers.join(",") + "\n";
        failedRows.forEach(r => {
            const failureReason = r.status === "error" ? (r.message || "") : (!r.isValid ? r.errors.join(", ") : "");
            const row = headers.map(h => {
                if (h === "failureReason") return csvEscape(failureReason);
                if (h === 'aadhar') {
                    const val = r.data?.[h] ?? "";
                    return csvEscape(`="${String(val).replace(/"/g, '""')}"`);
                }
                if (h === 'srn' || h === 'mobile' || h === 'whatsapp') {
                    const digits = onlyDigits(r.data?.[h] ?? "", 20);
                    return csvEscape(`="${digits}"`);
                }
                return csvEscape(r.data?.[h] ?? "");
            });
            csv += row.join(",") + "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `failed_bulk_rows_${selectedClass || "class"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Container fluid className="py-3">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Please login first to perform bulk upload operations.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLoginRedirect}>
                        Login Now
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                <Col lg={12}>
                    <Card className="mb-4" style={{ display: 'flex' }}>
                        <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
                            Bulk Student Registration (बल्क छात्र पंजीकरण)
                        </Card.Header>
                        <Card.Body>


                            <Card className="mb-4 border-warning">
                                <Card.Header style={{ backgroundColor: "#fff3cd", fontWeight: 600 }}>
                                    Instructions / निर्देश
                                </Card.Header>



                                <div style={{ display: 'flex' }}>

<Row className="w-100 gx-4">
  <Col xs={12} md={6} className="d-flex flex-column" style={{ minWidth: 0 }}>
    <Card.Body className="h-100 d-flex flex-column justify-content-start">
      <ol className="mb-0" style={{ paddingLeft: '1.25rem', width: '100%' }}>
        <li style={{ textAlign: 'left' }}>
          Select Class, District, Block, and School first (पहले कक्षा, जिला, ब्लॉक और स्कूल चुनें)
        </li>
        <li style={{ textAlign: 'left' }}>Download the CSV template (CSV टेम्पलेट डाउनलोड करें)</li>
        <li style={{ textAlign: 'left' }}>Fill the template with student data (टेम्पलेट में छात्र डेटा भरें)</li>
        <li style={{ textAlign: 'left' }}>
          <strong>
            Date of Birth must be in DD-MM-YYYY format (e.g., 01-01-2008) (जन्म तिथि DD-MM-YYYY फॉर्मेट में होनी चाहिए)
          </strong>
        </li>
        <li style={{ textAlign: 'left' }}>
          School details will be automatically filled based on your dropdown selection. You do not need to fill them manually in the CSV template.(स्कूल की जानकारी आपके ड्रॉपडाउन चयन के आधार पर अपने-आप भर जाएगी। आपको इन्हें CSV टेम्पलेट में मैन्युअली भरने की आवश्यकता नहीं है।)
        </li>
      </ol>
    </Card.Body>
  </Col>

  <Col xs={12} md={6} className="d-flex flex-column" style={{ minWidth: 0 }}>
    <Card.Body className="h-100 d-flex flex-column justify-content-start">
      <Row>
        <Col style={{ minWidth: 0 }}>
          <Form.Group className="mb-3">
            <Form.Label>Select Class (कक्षा चुनें):</Form.Label>
            <div style={{ minWidth: 0 }}>
              <Select
                value={classOptions.find(opt => opt.value === selectedClass)}
                options={classOptions}
                onChange={(opt) => setSelectedClass(opt ? opt.value : "")}
                placeholder="Choose class..."
                styles={{
                  container: (provided) => ({ ...provided, width: '100%' }),
                  control: (provided) => ({ ...provided, minHeight: '38px' })
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <District_block_school_manual_school_name_dependentDropdown />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col style={{ minWidth: 0 }}>
          <Button
            variant="outline-primary"
            onClick={downloadTemplate}
            disabled={!isDownloadEnabled}
            className="w-100"
          >
            Download CSV Template
          </Button>
          <small className="text-muted d-block mt-1">
            {!isDownloadEnabled
              ? "Select class and school details to enable download"
              : "Template will include DD-MM-YYYY date format"}
          </small>

          <Form.Group className="mt-3">
            <Form.Label>Upload CSV File (CSV फ़ाइल अपलोड करें):</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={!selectedClass || !districtContext || !blockContext || !schoolContext || loading}
            />
            <Form.Text className="text-muted">
              {!selectedClass || !districtContext || !blockContext || !schoolContext
                ? "Please select Class, District, Block and School first"
                : "CSV file must use DD-MM-YYYY format for dates"}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {csvFile && (
        <Row className="mt-3">
          <Col style={{ minWidth: 0 }}>
            <Button
              variant="primary"
              onClick={processBulkUpload}
              disabled={loading || !isUploadEnabled}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Processing...
                </>
              ) : (
                "Start Bulk Upload"
              )}
            </Button>
            {!isUploadEnabled && (
              <small className="text-danger d-block mt-1">
                Please ensure all fields are selected and CSV file is uploaded
              </small>
            )}
          </Col>
        </Row>
      )}
    </Card.Body>
  </Col>
</Row>
                                </div>



                            </Card>
                            <Card>

                            </Card>

                        </Card.Body>
                    </Card>

                    {uploadResults.length > 0 && (
                        <Card>
                            <Card.Header style={{ backgroundColor: "#f7f7f7", fontWeight: 700 }}>
                                Upload Results (अपलोड परिणाम)
                            </Card.Header>
                            <Card.Body>
                                {showSuccessAlert && (
                                    <Alert variant="success" className="mb-3">
                                        {successMessage}
                                    </Alert>
                                )}

                                <div className="mb-3">
                                    <Button
                                        variant="outline-primary"
                                        onClick={clearAllData}
                                        className="w-100"
                                    >
                                        Bulk Upload Again
                                    </Button>
                                </div>

                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    <Table striped bordered hover size="sm">
                                        <thead style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
                                            <tr>
                                                <th>Row</th>
                                                <th>SRN</th>
                                                <th>Name</th>
                                                <th>Status</th>
                                                <th>Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uploadResults.map((result, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{result.rowIndex}</td>
                                                        <td>{result.data.srn}</td>
                                                        <td>{result.data.name}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${result.status === "success"
                                                                    ? "bg-success"
                                                                    : result.status === "error"
                                                                        ? "bg-danger"
                                                                        : result.isValid
                                                                            ? "bg-warning"
                                                                            : "bg-danger"
                                                                    }`}
                                                            >
                                                                {result.status === "success"
                                                                    ? "Success"
                                                                    : result.status === "error"
                                                                        ? "Failed"
                                                                        : result.isValid
                                                                            ? "Valid"
                                                                            : "Invalid"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {result.status === "success" && "Student created successfully"}
                                                            {result.status === "error" && result.message}
                                                            {!result.status && !result.isValid && result.errors.join(", ")}
                                                            {!result.status && result.isValid && "Ready for upload"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>

                                <div className="mt-3 d-flex gap-2">
                                    <Button
                                        variant="outline-danger"
                                        onClick={downloadFailedEntriesCSV}
                                        disabled={uploadResults.filter(r => (r.status === "error") || (!r.isValid)).length === 0}
                                    >
                                        Download Failed Entries (CSV)
                                    </Button>
                                </div>

                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};