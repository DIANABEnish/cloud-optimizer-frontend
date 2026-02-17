import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Cloud, 
  Clock, 
  Files, 
  DollarSign, 
  Download, 
  Activity, 
  Layers, 
  BookOpen,
  User
} from "lucide-react";
import UploadArea from '../components/Common/UploadArea'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import {analyzeFiles, getSampleData} from '../services/api'
import './Landing.scss';

const Landing = () =>{
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (filesData)=>{
    setLoading(true)
    setError('')

    try{
      const results = await analyzeFiles(filesData)
      navigate('/dashboard', {state: {results}})
    }catch (err){
      setError(err.message)
      setLoading(false)
    }
  }

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
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Cloud size={14} />
              CLOUD STORAGE OPTIMIZER
            </div>
            <h1 className="hero-title">Optimize your cloud<br/>storage costs</h1>
            <p className="hero-subtitle">Analyze storage reports to identify old files, duplicates, and cost-saving opportunities.</p>
          </div>
        </div>
      </div>

      {/* Upload Card */}
      <div className="container">
        <div className="upload-card">
          <UploadArea
            onFileUpload={handleFileUpload}
            onUseSample={handleUseSample}
          />

          {error && (
            <div className="error-box">
              <p>⚠️ {error}</p>
            </div>
          )}

          <div className="guide-link">
            <Link to="/howToUse">
              <BookOpen size={16} />
              Need help? Read the guide
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <section className="features">
            <h2 className="section-title">What we analyze</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Clock size={28} />
                </div>
                <h3>Old Files</h3>
                <p>Files not accessed in 6+ months that can be moved to cheaper storage tiers.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Files size={28} />
                </div>
                <h3>Duplicates</h3>
                <p>Identical files wasting space across your directories and buckets.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <DollarSign size={28} />
                </div>
                <h3>Cost Savings</h3>
                <p>Calculate potential monthly savings from optimization opportunities.</p>
              </div>
            </div>
          </section>

          <section className="script-section">
            <h2>
              <Download size={28} />
              Don't have a JSON file?
            </h2>
            <p>Download our scanner script to automatically generate one from your local storage</p>
            
            <div className="script-grid">
              <div className="script-card">
                <div className="script-icon">
                  <Activity size={32} />
                </div>
                <h3>Python Script</h3>
                <p>Works on all platforms</p>
                <p className="requirement">Requires: Python 3.6+</p>
                <button onClick={handleDownloadPython} className="btn btn-primary">
                  <Download size={16} />
                  Download Python Version
                </button>
              </div>

              <div className="script-card">
                <div className="script-icon">
                  <Layers size={32} />
                </div>
                <h3>Node.js Script</h3>
                <p>For JavaScript developers</p>
                <p className="requirement">Requires: Node.js 14+</p>
                <button onClick={handleDownloadNodeJS} className="btn btn-primary">
                  <Download size={16} />
                  Download Node.js Version
                </button>
              </div>
            </div>
          </section>

          <div className="howto-box">
            <h3>How to use:</h3>
            <ol>
              <li>Download your preferred script</li>
              <li>Run: <code>python generate_report.py</code> or <code>node generate_report.js</code></li>
              <li>Enter the path to scan</li>
              <li>Upload the generated JSON file here</li>
            </ol>
            
            <Link to="/howToUse" className="btn btn-secondary">
            
              View Detailed Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing