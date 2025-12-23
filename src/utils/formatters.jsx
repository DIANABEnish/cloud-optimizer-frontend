// Convert bytes to readable format (KB, MB, GB)
export const formatSize = (bytes) =>{
  if(!bytes || bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k))

  return `${(bytes / Math.pow(k,i)).toFixed(2)} ${sizes[i]}`
}

//Date
export const formatDate = (dateString) =>{
  if(!dateString) return 'N/A'

  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

//price
export const formatPrice = (amount) => {
  // Handle null/undefined
  if (amount === null || amount === undefined) return '-';
  
  // Zero
  if (amount === 0) return '$0';
  
  // Very small amounts (< $0.0001) = "less than a penny"
  if (amount > 0 && amount < 0.0001) {
    return '<$0.01';
  }
  
  // Small amounts ($0.0001 - $0.01) = 2 decimals (rounds to $0.00 or $0.01)
  if (amount < 0.01) {
    return `$${amount.toFixed(2)}`;
  }
  
  // Regular amounts ($0.01 - $999.99) = 2 decimals
  if (amount < 1000) {
    return `$${amount.toFixed(2)}`;
  }
  
  // Large amounts ($1000+) = no decimals
  return `$${Math.round(amount).toLocaleString()}`;
};

//percentage calculator
export const calculatePercentage = (part,total)=>{
  if(!total || total ===0) return 0
  return Math.round((part/total)*100)
}