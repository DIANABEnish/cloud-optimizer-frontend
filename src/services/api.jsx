import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API URL:', API_URL);
console.log('🔍 Environment:', import.meta.env.VITE_API_URL);

//this function sends files for analysis
export const analyzeFiles = async (filesData) => {
  try {
    const response = await axios.post(`${API_URL}/analyze`, {
      files: filesData
    })
    return response.data
  } catch (error) {
    console.error('Error analyzing files:', error)
     
    //in case of error from server
    if (error.response) {
      throw new Error(error.response.data.error || 'Server error')
    }
    
    //cannot connect to server
    throw new Error('Cannot connect to server. Make sure backend is running');
  }
}

export const getSampleData = () => {
  return {
    files: [
      {
        name: "backup_2023.zip",
        size: 524288000,
        lastModified: "2023-03-15T10:30:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "abc123def456"
      },
      {
        name: "logs_old.csv",
        size: 262144000,
        lastModified: "2022-08-20T14:20:00Z",
        type: "log",
        storageClass: "standard",
        hash: "xyz789ghi012"
      },
      {
        name: "photo_vacation.jpg",
        size: 5242880,
        lastModified: "2024-10-01T08:15:00Z",
        type: "image",
        storageClass: "standard",
        hash: "img999aaa111"
      },
      {
        name: "backup_2023_copy.zip",
        size: 524288000,
        lastModified: "2023-03-20T11:00:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "abc123def456"
      }
    ]
  };
};
```

### 2️⃣ עדכני את המשתנה ב-Netlify:

**מחקי את המשתנה הישן והוסיפי חדש:**
```
Key: VITE_API_URL
Value: https://your-backend-name.onrender.com/api
```

⚠️ **חשוב:** השם חייב להתחיל ב-`VITE_` ולא `REACT_APP_`!

### 3️⃣ צור `.env.production` בפרונטאנד:
```
VITE_API_URL=https://your-backend-name.onrender.com/api
