import React, { useState } from 'react';

const AlertPopup = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue); // Pass the input value to the parent component
    onClose(); // Close the alert
  };

  return (
    <div style={styles.alertPopup}>
      <div style={styles.alertContent}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your value here"
          style={styles.inputField}
        />
        <div style={styles.buttonContainer}>
          <button onClick={handleSubmit} style={styles.submitButton}>Submit</button>
          <button onClick={onClose} style={styles.closeButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

const SearchableDropdown = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = () => {
    setIsAlertVisible(true);
  };

  const closeAlert = () => {
    setIsAlertVisible(false);
  };

  const handleSubmit = (value) => {
    console.log(value); // Log the input value
  };

  return (
    <div>
      <button onClick={showAlert}>Show Alert</button>
      {isAlertVisible && (
        <AlertPopup 
          onClose={closeAlert} 
          onSubmit={handleSubmit} 
        />
      )}
    </div>
  );
};

const styles = {
  alertPopup: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  alertContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    width: '300px', // Set a width for better styling
  },
  inputField: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ccc',
    color: 'black',
    cursor: 'pointer',
  },
};

export default SearchableDropdown;
