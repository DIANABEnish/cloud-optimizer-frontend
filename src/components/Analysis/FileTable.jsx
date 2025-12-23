import React, { useState } from 'react';
import { formatSize, formatDate, formatPrice } from '../../utils/formatters';
import './FileTable.css';

// displays file analysis data in a sortable and filterable table
const FileTable = ({ files }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');

  console.log('📋 FileTable received files:', files);

  //filter files based on selected type
  const filteredFiles = files.filter(file => {
    if (filterType === 'all') return true;
    if (filterType === 'old') return file.analysis?.isOld;
    if (filterType === 'duplicates') return file.analysis?.isDuplicate;
    if (filterType === 'savings') return (file.analysis?.savingsPerMonth || 0) > 0;
    return true;
  });

  //sort files based on current sort criteria
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'date':
        comparison = new Date(a.lastModified) - new Date(b.lastModified);
        break;
      case 'savings':
        comparison = (a.analysis?.savingsPerMonth || 0) - (b.analysis?.savingsPerMonth || 0);
        break;
      case 'spaceSavings':
        comparison = a.size - b.size;
        
        // Fallback to name sorting if sizes are identical
        if (comparison === 0) {
          comparison = a.name.localeCompare(b.name);
        }
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // handle column sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      
      //default to descending for savings columns
      if (column === 'savings' || column === 'spaceSavings') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };

  // Determine CSS class for recommendation badge
  const getRecommendationClass = (recommendation) => {
    if (recommendation.includes('Glacier') || recommendation.includes('Cold')) return 'move';
    if (recommendation.includes('Delete') || recommendation.includes('Duplicate')) return 'remove';
    return 'keep';
  };

  return (
    <div className="file-table-container">
      <div className="table-header">
        <h3>📋 File Analysis ({sortedFiles.length} files)</h3>
        
        <div className="table-controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Files ({files.length})</option>
              <option value="old">Old Files Only ({files.filter(f => f.analysis?.isOld).length})</option>
              <option value="duplicates">Duplicates Only ({files.filter(f => f.analysis?.isDuplicate).length})</option>
              <option value="savings">With Savings ({files.filter(f => (f.analysis?.savingsPerMonth || 0) > 0).length})</option>
            </select>
          </div>

          <div className="sort-group">
            <label>Quick Sort:</label>
            <button 
              onClick={() => handleSort('savings')} 
              className={`sort-btn ${sortBy === 'savings' ? 'active' : ''}`}
            >
              💰 By Cost Savings {sortBy === 'savings' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button 
              onClick={() => handleSort('spaceSavings')} 
              className={`sort-btn ${sortBy === 'spaceSavings' ? 'active' : ''}`}
            >
              📦 By Space Savings {sortBy === 'spaceSavings' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="file-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('size')} className="sortable">
                Size {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('date')} className="sortable">
                Last Modified {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Type</th>
              <th>Status</th>
              <th>Recommendation</th>
              <th onClick={() => handleSort('savings')} className="sortable">
                Savings {sortBy === 'savings' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFiles.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No files match the current filter
                </td>
              </tr>
            ) : (
              sortedFiles.map((file, index) => {
                const savingsValue = file.analysis?.savingsPerMonth || 0;
                
                return (
                  <tr key={index}>
                    <td className="file-name">
                      <span className="file-icon">📄</span>
                      {file.name}
                    </td>
                    <td>{formatSize(file.size)}</td>
                    <td>{formatDate(file.lastModified)}</td>
                    <td>
                      <span className="type-badge">{file.type}</span>
                    </td>
                    <td>
                      {file.analysis?.isOld && <span className="status-badge old">Old</span>}
                      {file.analysis?.isDuplicate && <span className="status-badge duplicate">Duplicate</span>}
                      {!file.analysis?.isOld && !file.analysis?.isDuplicate && (
                        <span className="status-badge ok">OK</span>
                      )}
                    </td>
                    <td>
                      <span className={`recommendation ${getRecommendationClass(file.analysis?.recommendation || '')}`}>
                        {file.analysis?.recommendation || 'Keep'}
                      </span>
                    </td>
                    <td className="savings">
                      {savingsValue > 0
                        ? `${formatPrice(savingsValue)}/mo`
                        : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;