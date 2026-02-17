import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Rocket,
  Cloud,
  BookOpen,
  HelpCircle,
  HardDrive,
  Camera,
  AlertTriangle
} from 'lucide-react';
import './HowToUse.scss';

const HowToUse = () => {
  return (
    <div className="how-to-use-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <BookOpen size={32} />
            How It Works
          </h1>
          <Link to="/" className="back-btn">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        <section className="section">
          <h2>
            <CheckCircle size={24} />
            What can be analyzed
          </h2>
          <ul className="two-column-list">
            <li>
              <CheckCircle size={18} />
              Files on your computer (C:\, D:\, etc.)
            </li>
            <li>
              <CheckCircle size={18} />
              Synced cloud folders (Google Drive Desktop, Dropbox, OneDrive)
            </li>
            <li>
              <CheckCircle size={18} />
              External drives (USB, hard drives)
            </li>
            <li>
              <XCircle size={18} />
              Cloud-only files without local sync (requires workaround)
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>
            <Rocket size={24} />
            Quick Start Guide
          </h2>
          
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h3>Download the Script</h3>
                <p>Choose Python or Node.js version based on what you have installed</p>
              </div>
            </div>

            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h3>Open Command Prompt (Windows) or Terminal (Mac/Linux)</h3>
                <p>Windows: Press Win+R, type "cmd", press Enter</p>
              </div>
            </div>

            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h3>Navigate to Script Location</h3>
                <code >cd C:\Users\YourName\Downloads</code>
              </div>
            </div>

            <div className="step">
              <span className="step-number">4</span>
              <div className="step-content">
                <h3>Run the Script</h3>
                <code>node generate_report.js</code>
                <p>or</p>
                <code>python generate_report.py</code>
              </div>
            </div>

            <div className="step">
              <span className="step-number">5</span>
              <div className="step-content">
                <h3>Enter Folder Path</h3>
                <p>Example: D:\Documents or C:\Users\YourName\Google Drive</p>
              </div>
            </div>

            <div className="step">
              <span className="step-number">6</span>
              <div className="step-content">
                <h3>Upload JSON to Analyzer</h3>
                <p>Upload the generated storage_report.json file</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>
            <Cloud size={24} />
            For Cloud Storage Users
          </h2>
          
          <div className="cloud-guides">
            <div className="guide-card">
              <div className="guide-icon-col guide-icon-col--drive">
                <div className="guide-icon guide-icon--drive">
                  <HardDrive size={20} />
                </div>
              </div>
              <div className="guide-card-body">
                <h3>Google Drive</h3>
                <p><strong>Option 1:</strong> Google Drive Desktop</p>
                <ol>
                  <li>Install from google.com/drive/download</li>
                  <li>Wait for sync to complete</li>
                  <li>Run script on G:\ or Google Drive folder</li>
                </ol>
                <p><strong>Option 2:</strong> Google Takeout</p>
              </div>
            </div>

            <div className="guide-card">
              <div className="guide-icon-col guide-icon-col--dropbox">
                <div className="guide-icon guide-icon--dropbox">
                  <Cloud size={20} />
                </div>
              </div>
              <div className="guide-card-body">
                <h3>Dropbox</h3>
                <p>Use Dropbox Desktop app — files sync automatically to your local folder and are ready to scan</p>
              </div>
            </div>

            <div className="guide-card">
              <div className="guide-icon-col guide-icon-col--onedrive">
                <div className="guide-icon guide-icon--onedrive">
                  <Cloud size={20} />
                </div>
              </div>
              <div className="guide-card-body">
                <h3>OneDrive</h3>
                <p>Built into Windows, your files are already synced locally:</p>
                <code>C:\Users\YourName\OneDrive</code>
              </div>
            </div>

            <div className="guide-card guide-card--warning">
              <div className="guide-icon-col guide-icon-col--photos">
                <div className="guide-icon guide-icon--photos">
                  <Camera size={20} />
                </div>
              </div>
              <div className="guide-card-body">
                <h3>Google Photos</h3>
                <div className="warning-badge">
                  <AlertTriangle size={13} />
                  No Desktop Sync
                </div>
                <p><strong>Use Google Takeout:</strong></p>
                <ol>
                  <li>Go to takeout.google.com</li>
                  <li>Select "Google Photos"</li>
                  <li>Export &amp; download ZIP</li>
                  <li>Extract &amp; run script</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="section faq">
          <h2>
            <HelpCircle size={24} />
            FAQ
          </h2>
          
          <div className="faq-list">
            <div className="faq-item">
              <h3>Do I need to install Python or Node.js?</h3>
              <p>Yes, you need one of them installed to run the script. Python is usually pre-installed on Mac/Linux. On Windows, download from python.org or nodejs.org.</p>
            </div>

            <div className="faq-item">
              <h3>Is my data sent to your servers?</h3>
              <p>No! The script runs locally on your computer. Only the JSON file (metadata only — no actual file content) is uploaded for analysis. Your files never leave your machine.</p>
            </div>

            <div className="faq-item">
              <h3>Can I analyze cloud storage directly?</h3>
              <p>Currently, you need to sync files locally first. Direct cloud integration (S3, GCS, Azure Blob) is planned for a future version.</p>
            </div>
          </div>
        </section>

        <div className="back-to-home">
          <Link to="/" className="btn">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
