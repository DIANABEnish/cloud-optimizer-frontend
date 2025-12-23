import React, { useState, useRef } from 'react';
import './UploadArea.scss';

// Component for JSON file upload via drag-and-drop or file selection
const UploadArea = ({ onFileUpload, onUseSample }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  // Handle file selection via input
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Process and validate the uploaded file
  const processFile = (file) => {
    setError('');

    if (!file) return;
    
    // Check for JSON format
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        // Validate JSON structure
        if (!jsonData.files || !Array.isArray(jsonData.files)) {
          setError('Invalid JSON format. Expected { "files": [...] }');
          return;
        }

        // Pass files to parent component
        onFileUpload(jsonData.files);
        
      } catch (err) {
        setError('Invalid JSON file. Please check the format.');
        console.error('JSON Parse Error:', err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-wrapper">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className="upload-icon">📁</div>
        
        {fileName ? (
          <p className="file-name">✅ {fileName}</p>
        ) : (
          <>
            <h3>Drop your JSON file here</h3>
            <p>or click to browse</p>
          </>
        )}

        {error && <p className="error-message">❌ {error}</p>}
      </div>

      {/* Option to use sample data */}
      <div className="sample-option">
        <p>Don't have a file? Try our sample data</p>
        <button onClick={onUseSample} className="btn btn-secondary">
          Use Sample Data
        </button>
      </div>
    </div>
  );
};

export default UploadArea;