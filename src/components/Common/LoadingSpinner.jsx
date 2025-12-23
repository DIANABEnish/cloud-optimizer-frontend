import React from "react";
import './LoadingSpinner.scss';

//loading spinner with customizable message
const LoadingSpinner = ({ message = 'Analyzing your files...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
      <p className="loading-submessage">This may take a few moments</p>
    </div>
  );
};

export default LoadingSpinner;