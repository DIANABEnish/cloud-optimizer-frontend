import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatSize } from '../../utils/formatters';
import './FileTypeChart.scss';

//pie chart showing storage distribution across file types
const FileTypeChart = ({ files }) => {
  //group files by type and calculate total size
  const typeGroups = files.reduce((acc, file) => {
    const type = file.type || 'other';
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        size: 0
      };
    }
    acc[type].count += 1;
    acc[type].size += file.size;
    return acc;
  }, {});

  // format data for Recharts
  const data = Object.entries(typeGroups)
    .map(([type, info]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: info.size,
      count: info.count,
      percentage: 0
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate percentages
  const totalSize = data.reduce((sum, item) => sum + item.value, 0);
  data.forEach(item => {
    item.percentage = ((item.value / totalSize) * 100).toFixed(1);
  });

  // color mapping for file types
  const COLORS = {
    document: '#667eea',
    image: '#f093fb',
    video: '#4facfe',
    backup: '#43e97b',
    log: '#fa709a',
    code: '#feca57',
    audio: '#48dbfb',
    other: '#c8d6e5'
  };

  // Custom tooltip for detailed info
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.name}</p>
          <p className="tooltip-detail">
            <strong>{formatSize(data.value)}</strong> ({data.percentage}%)
          </p>
          <p className="tooltip-count">{data.count} files</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="file-type-chart-container">
      <div className="chart-header">
        <h3>📊 Storage by File Type</h3>
        <p>Distribution of your files across different categories</p>
      </div>

      <div className="chart-content">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                innerRadius={65}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name.toLowerCase()] || COLORS.other}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                iconType="circle"
                formatter={(value, entry) => {
                  const item = data.find(d => d.name === value);
                  return `${value} - ${item?.percentage}%`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed breakdown table */}
        <div className="chart-summary">
          <h4>Breakdown:</h4>
          <div className="summary-grid">
            {data.map((item, index) => (
              <div key={index} className="summary-item">
                <div 
                  className="color-indicator" 
                  style={{ background: COLORS[item.name.toLowerCase()] || COLORS.other }}
                ></div>
                <div className="summary-info">
                  <span className="type-name">{item.name}</span>
                  <span className="type-size">{formatSize(item.value)}</span>
                  <span className="type-percentage">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTypeChart;