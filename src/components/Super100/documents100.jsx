import React from "react";
import { Button } from 'react-bootstrap'; // if you're using shadcn/ui or replace with your button

const DownloadDocument = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "./documents.pdf"; // adjust the filename here
    link.download = "Document"; // download name
    link.click();
  };

  return (
    <div className="p-4">
      <Button  style={{ backgroundColor: 'transparent', border:'transparent' }}  class="blinking-text" onClick={handleDownload}>
       <h5 className="blinking-text">Click here to</h5>
       <span className="blinking-text">Download</span>
       <h5 className="blinking-text">Admission Documents</h5>
      </Button>
    </div>
  );
};

export default DownloadDocument;
