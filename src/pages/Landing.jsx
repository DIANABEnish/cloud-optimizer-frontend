import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UploadArea from '../components/Common/UploadArea'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import {analyzeFiles, getSampleData} from '../services/api'
import './Landing.scss';

const Landing = () =>{
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handling real file upload
  const handleFileUpload = async (filesData)=>{
    setLoading(true)
    setError('')

    try{
      //sending to backend
      const results = await analyzeFiles(filesData)

      //Go to dashboard page with the results
      navigate('/dashboard', {state: {results}})
    }catch (err){
      setError(err.message)
      setLoading(false)
    }
  }

  //using demo data
  const handleUseSample = async ()=>{
    const sampleData = getSampleData()
    await handleFileUpload(sampleData.files)
  }

  const handleDownloadPython = () => {
    const link = document.createElement('a');
    link.href = '/scripts/generate_report.py';
    link.download = 'generate_report.py';
    link.click();
  };

  const handleDownloadNodeJS = () => {
    const link = document.createElement('a');
    link.href = '/scripts/generate_report.js';
    link.download = 'generate_report.js';
    link.click();
  };

  if(loading) return <LoadingSpinner/>

  return (
    <div className="landing-page">
      <div className="container">
        <header className="hero">
          <div className="hero-icon">☁️</div>
          <h1 className="hero-title">Cloud Storage Optimizer</h1>
          <p className="hero-subtitle">Analyze your cloud storage and discover potential savings</p>
          <p className="hero-description">Find old files, duplicates, and opportunities to reduce costs</p>
        </header>

        <div className="upload-section">
          <UploadArea
          onFileUpload={handleFileUpload}
          onUseSample={handleUseSample}
          />

          {error && (
            <div className="error-box">
              <p>⚠️ {error}</p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/howToUse" style={{ 
            color: 'white', 
            fontSize: '16px', 
            textDecoration: 'underline',
            opacity: 0.9
          }}>
            📖 Need help? Check our guide →
          </Link>
        </div>

        <section className="features">
          <h2>What We Analyze</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Old Files</h3>
              <p>Files not accessed in 6+ months that can be moved to cheaper storage</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Duplicates</h3>
              <p>Identify identical files wasting storage space</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Cost Savings</h3>
              <p>Calculate potential monthly savings from optimization</p>
            </div>
          </div>
        </section>
      </div>

        <section className="download-scripts">
        <h2>📥 Don't have a JSON file?</h2>
        <p>Download our script to automatically scan your local storage</p>
        
        <div className="script-options">
          <div className="script-card">
            <div className="icon">🐍</div>
            <h3>Python Script</h3>
            <p>Works on all platforms</p>
            <p className="requirement">Requires: Python 3.6+</p>
            <button onClick={handleDownloadPython} className="btn btn-primary">
              Download Python Version
            </button>
          </div>

          <div className="script-card">
            <div className="icon">🟢</div>
            <h3>Node.js Script</h3>
            <p>For JavaScript developers</p>
            <p className="requirement">Requires: Node.js 14+</p>
            <button onClick={handleDownloadNodeJS} className="btn btn-primary">
              Download Node.js Version
            </button>
          </div>
        </div>
      </section>

         <div className="how-to-use">
          <h3>How to use:</h3>
          <ol>
            <li>Download your preferred script</li>
            <li>Run: <code>python generate_report.py</code> or <code>node generate_report.js</code></li>
            <li>Enter the path to scan</li>
            <li>Upload the generated JSON file here</li>
          </ol>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/howToUse" className="btn btn-secondary">
              📖 View Detailed Guide
            </Link>
          </div>
        </div>

    </div>
  )
}

export default Landing