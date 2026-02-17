import React from "react";
import { 
  HardDrive, 
  FolderOpen, 
  Clock, 
  Copy, 
  Package, 
  DollarSign 
} from "lucide-react";
import { formatSize, formatPrice } from '../../utils/formatters'
import './SummaryCards.scss';

// displays key metrics about storage analysis
const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Storage',
      value: formatSize(summary.totalSize),
      icon: <HardDrive />,
      color: 'blue'
    },
    {
      title: 'Total Files',
      value: summary.totalFiles,
      icon: <FolderOpen />,
      color: 'purple'
    },
    {
      title: 'Old Files',
      value: summary.oldFiles,
      icon: <Clock />,
      color: 'orange',
      subtitle: 'Not accessed in 6+ months'
    },
    {
      title: 'Duplicates',
      value: summary.duplicates,
      icon: <Copy />,
      color: 'red'
    },
    {
      title: 'Space Savings',
      value: formatSize(summary.spaceSavings || 0),
      icon: <Package />,
      color: 'teal',
      subtitle: 'Can be freed up'
    },
    {
      title: 'Potential Savings',
      value: `${formatPrice(summary.estimatedSavings)}/mo`,
      icon: <DollarSign />,
      color: 'green',
      highlight: true
    }
  ]

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className={`summary-card ${card.color} ${card.highlight ? 'highlight' : ''}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <h3 className="card-title">{card.title}</h3>
            <p className="card-value">{card.value}</p>
            {card.subtitle && <p className="card-subtitle">{card.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards