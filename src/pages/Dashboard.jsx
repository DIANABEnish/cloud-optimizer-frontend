import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  BarChart3, 
  ArrowLeft, 
  Download, 
  FileText, 
  Table2,
  Lightbulb,
  Check,
  DollarSign
} from "lucide-react";
import SummaryCards from '../components/Dashboard/SummaryCards'
import FileTable from "../components/Analysis/FileTable";
import FileTypeChart from '../components/Dashboard/FileTypeChart';
import { generateCSV, generateSummary, downloadFile } from '../utils/downloadUtils';
import './Dashboard.scss'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { results } = location.state || {}

  console.log('📊 Results from backend:', results);
  console.log('📋 Files:', results?.files);

  // back to homepage if there are no results
  if (!results) {
    navigate('/')
    return null
  }

  const { summary, files } = results

  const handleAnalyzeNew = () => {
    navigate('/')
  }

  // download handlers
  const handleDownloadCSV = () => {
    const csvContent = generateCSV(files);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csvContent, `storage-analysis-${timestamp}.csv`, 'text/csv');
  };

  const handleDownloadSummary = () => {
    const summaryContent = generateSummary(summary, files);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(summaryContent, `storage-summary-${timestamp}.txt`, 'text/plain');
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <h1>
              <BarChart3 />
              Analysis Results
            </h1>
            <p>Here's what we found in your storage</p>
          </div>
          <button onClick={handleAnalyzeNew} className="btn btn-primary">
            <ArrowLeft size={16} />
            Analyze New Files
          </button>
        </header>

        {/* Download Report Section */}
        <div className="download-report">
          <h3>
            <Download />
            Download Report
          </h3>
          <div className="download-buttons">
            <button onClick={handleDownloadCSV} className="btn-download csv">
              <span className="icon">
                <Table2 />
              </span>
              <span className="text">
                <strong>CSV Format</strong>
                <small>Detailed file list for spreadsheets</small>
                <small>Open with Excel or Google Sheets</small>
              </span>
            </button>
            <button onClick={handleDownloadSummary} className="btn-download summary">
              <span className="icon">
                <FileText />
              </span>
              <span className="text">
                <strong>Text Summary</strong>
                <small>Overview report with recommendations</small>
              </span>
            </button>
          </div>
        </div>

        {/* summary cards */}
        <SummaryCards summary={summary} />

        {/* Chart and Quick Wins - Side by Side */}
        <div className="chart-and-recommendations">
          {/* Pie Chart */}
          <FileTypeChart files={files} />

          {/* Quick Wins - moved next to chart */}
          {summary.estimatedSavings > 0 && (
            <div className="recommendations-box">
              <h3>
                <Lightbulb />
                Quick Wins
              </h3>
              <ul>
                {summary.oldFiles > 0 && (
                  <li>
                    <Check size={18} />
                    Move <strong>{summary.oldFiles}</strong> old files to Glacier storage
                  </li>
                )}
                {summary.duplicates > 0 && (
                  <li>
                    <Check size={18} />
                    Remove <strong>{summary.duplicates}</strong> duplicate files
                  </li>
                )}
                <li className="savings-highlight">
                  <DollarSign size={20} />
                  Total potential savings: <strong>${summary.estimatedSavings.toFixed(2)}/mo</strong>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* files table */}
        <FileTable files={files} />

        <div className="back-to-home">
          <Link to="/" className="btn">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard