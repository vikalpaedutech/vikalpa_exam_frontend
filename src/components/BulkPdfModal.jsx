//Not completed yet. i will complete it later


import React from 'react';

const BulkPdfModal = ({ show, onClose, children }) => {
    if (!isShow) return null;
   
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <iframe
                    src={`data:application/pdf;base64,${pdfData}`}
                    width="100%"
                    height="400px"
                    title="PDF Preview"
                />
                <button onClick={handleDownload}>Download PDF</button>
            </div>
        </div>
    );
};

export default BulkPdfModal;
