// Generate CSV content from files data
export const generateCSV = (files) => {
  // CSV headers
  const headers = [
    'File Name',
    'Size (Bytes)',
    'Size (Formatted)',
    'Last Modified',
    'Type',
    'Is Old',
    'Is Duplicate',
    'Recommendation',
    'Monthly Savings ($)'
  ];

  // Convert files to CSV rows
  const rows = files.map(file => [
    file.name,
    file.size,
    formatSizeForCSV(file.size),
    file.lastModified,
    file.type,
    file.analysis?.isOld ? 'Yes' : 'No',
    file.analysis?.isDuplicate ? 'Yes' : 'No',
    file.analysis?.recommendation || 'Keep',
    file.analysis?.savingsPerMonth || 0
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

// Generate text summary report
export const generateSummary = (summary, files) => {
  const report = `
CLOUD STORAGE OPTIMIZER - ANALYSIS REPORT
==========================================
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Files: ${summary.totalFiles}
Total Size: ${formatSizeForCSV(summary.totalSize)}
Old Files: ${summary.oldFiles}
Duplicates: ${summary.duplicates}
Estimated Monthly Savings: $${summary.estimatedSavings.toFixed(2)}

FILE TYPE BREAKDOWN
-------------------
${getFileTypeBreakdown(files)}

RECOMMENDATIONS
---------------
${getRecommendations(summary)}

TOP 10 LARGEST FILES
--------------------
${getTopLargestFiles(files)}

TOP 10 COST SAVING OPPORTUNITIES
---------------------------------
${getTopSavings(files)}
`;

  return report.trim();
};

// Download file helper
export const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper functions
const formatSizeForCSV = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const getFileTypeBreakdown = (files) => {
  const typeCount = {};
  files.forEach(file => {
    typeCount[file.type] = (typeCount[file.type] || 0) + 1;
  });
  
  return Object.entries(typeCount)
    .map(([type, count]) => `  ${type}: ${count} files`)
    .join('\n');
};

const getRecommendations = (summary) => {
  const recs = [];
  
  if (summary.oldFiles > 0) {
    recs.push(`• Move ${summary.oldFiles} old files to Glacier storage`);
  }
  
  if (summary.duplicates > 0) {
    recs.push(`• Remove ${summary.duplicates} duplicate files`);
  }
  
  if (summary.estimatedSavings > 0) {
    recs.push(`• Potential savings: $${summary.estimatedSavings.toFixed(2)}/month`);
  }
  
  return recs.length > 0 ? recs.join('\n') : '• No immediate actions needed';
};

const getTopLargestFiles = (files) => {
  return files
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .map((file, i) => `  ${i + 1}. ${file.name} - ${formatSizeForCSV(file.size)}`)
    .join('\n');
};

const getTopSavings = (files) => {
  const filesWithSavings = files.filter(f => (f.analysis?.savingsPerMonth || 0) > 0);
  
  if (filesWithSavings.length === 0) {
    return '  No cost saving opportunities identified';
  }
  
  return filesWithSavings
    .sort((a, b) => (b.analysis?.savingsPerMonth || 0) - (a.analysis?.savingsPerMonth || 0))
    .slice(0, 10)
    .map((file, i) => 
      `  ${i + 1}. ${file.name} - $${file.analysis.savingsPerMonth.toFixed(2)}/mo`
    )
    .join('\n');
};