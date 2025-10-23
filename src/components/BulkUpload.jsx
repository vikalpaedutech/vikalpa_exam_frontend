import React, { useState, useContext } from 'react';
import * as XLSX from 'xlsx';
import BulkUploadService from '../services/BulkUploadService';
import { UserContext } from './ContextApi/UserContextAPI/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

export default function BulkUpload() {
    const { user } = useContext(UserContext);
    const isRegisteredBy = user.mobile;

    const [file, setFile] = useState(null);
    const [uploadedData, setUploadedData] = useState(null);

    // Modal visibility state
    const [openModal, setOpenModal] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file); // 'file' should match the field name in multer
        formData.append('isRegisteredBy', isRegisteredBy);

        try {
            const response = await BulkUploadService.BulkPost(formData);
            console.log('Response:', response.data);
            setUploadedData(response.data);
            setOpenModal(true); // Show the modal on success
            toast.success('Students Registered Successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            setOpenModal(false);
            toast.error('Student not registered. Try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>

            {/* Modal */}
            <Modal show={openModal} onHide={() => setOpenModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {uploadedData ? (
                        <>
                            <p>Students Registered Successfully!</p>
                            <p>Total Records: {uploadedData.data?.length || 0}</p>
                            {/* Render more details if needed */}
                        </>
                    ) : (
                        <p>No data available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Link to={'/userprofile'}><Button variant="secondary" onClick={() => setOpenModal(false)}>
                        Go Back
                    </Button></Link>
                    <Link to={'/userprofile/dashboard-mb'}><Button variant="secondary" onClick={() => setOpenModal(false)}>
                        Download Acknowledgement
                    </Button></Link>
                </Modal.Footer>
            </Modal>
        </div>
    );
}