import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';



console.log('🌐 API URL:', API_URL); // For debugging
console.log(import.meta.env.VITE_API_URL);


//this function sends files for analysis
export const analyzeFiles = async (filesData) =>{
  try{
    const response = await axios.post(`${API_URL}/analyze`, {
      files: filesData
    })
    return response.data
  }catch (error){
    console.error('Error analyzing files:', error)
     
    //in case of error from server
      if (error.response) {
      throw new Error(error.response.data.error || 'Server error')
    }
    
    //cannot conect to server
     throw new Error('Cannot connect to server. Make sure backend is running on port 5000');
  
  }
}


export const getSampleData = () => {
  return {
    files: [
      // ===== BACKUPS =====
      {
        name: "backup_2023.zip",
        size: 524288000,        // 500MB - ישן
        lastModified: "2023-03-15T10:30:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "abc123def456"
      },
      {
        name: "backup_2023_copy.zip",
        size: 524288000,        // 500MB - כפול + ישן
        lastModified: "2023-03-20T11:00:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "abc123def456"
      },
      {
        name: "backup_full_jan2022.zip",
        size: 1073741824,       // 1GB - ישן
        lastModified: "2022-01-10T09:00:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "bkp001jan2022"
      },
      {
        name: "backup_full_jan2022_v2.zip",
        size: 1073741824,       // 1GB - כפול + ישן
        lastModified: "2022-01-12T14:00:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "bkp001jan2022"
      },
      {
        name: "system_backup_2021.tar.gz",
        size: 2147483648,       // 2GB - ישן מאוד
        lastModified: "2021-11-05T03:00:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "sys2021backup99"
      },
      {
        name: "backup_weekly_jan2026.zip",
        size: 629145600,        // 600MB - פעיל! (חודש וחצי)
        lastModified: "2026-01-06T02:00:00Z",
        type: "backup",
        storageClass: "standard",
        hash: "bkp2026jan06"
      },

      // ===== VIDEOS =====
      {
        name: "product_demo_v1.mp4",
        size: 734003200,        // 700MB - ישן
        lastModified: "2022-06-10T15:00:00Z",
        type: "video",
        storageClass: "standard",
        hash: "vid001demo2022"
      },
      {
        name: "product_demo_v1_backup.mp4",
        size: 734003200,        // 700MB - כפול + ישן
        lastModified: "2022-06-11T10:00:00Z",
        type: "video",
        storageClass: "standard",
        hash: "vid001demo2022"
      },
      {
        name: "team_meeting_rec_march2022.mp4",
        size: 943718400,        // 900MB - ישן
        lastModified: "2022-03-22T17:30:00Z",
        type: "video",
        storageClass: "standard",
        hash: "vid002meet0322"
      },
      {
        name: "onboarding_video_2021.mp4",
        size: 524288000,        // 500MB - ישן מאוד
        lastModified: "2021-09-01T11:00:00Z",
        type: "video",
        storageClass: "standard",
        hash: "vid003onb2021"
      },
      {
        name: "product_demo_v3_final.mp4",
        size: 838860800,        // 800MB - פעיל! (ספטמבר 2025)
        lastModified: "2025-09-18T13:00:00Z",
        type: "video",
        storageClass: "standard",
        hash: "vid005demov3"
      },
      {
        name: "team_offsite_nov2025.mp4",
        size: 1258291200,       // 1.2GB - פעיל! (נובמבר 2025)
        lastModified: "2025-11-02T18:00:00Z",
        type: "video",
        storageClass: "standard",
        hash: "vid006offsit25"
      },

      // ===== IMAGES =====
      {
        name: "team_photo_2022.jpg",
        size: 8388608,          // 8MB - ישן
        lastModified: "2022-07-14T12:00:00Z",
        type: "image",
        storageClass: "standard",
        hash: "img001team2022"
      },
      {
        name: "team_photo_2022_copy.jpg",
        size: 8388608,          // 8MB - כפול + ישן
        lastModified: "2022-07-15T09:00:00Z",
        type: "image",
        storageClass: "standard",
        hash: "img001team2022"
      },
      {
        name: "office_photos_batch_2021.zip",
        size: 314572800,        // 300MB - ישן מאוד
        lastModified: "2021-12-20T16:00:00Z",
        type: "image",
        storageClass: "standard",
        hash: "img002offzip21"
      },
      {
        name: "product_screenshots_v5.zip",
        size: 62914560,         // 60MB - פעיל! (דצמבר 2025)
        lastModified: "2025-12-10T10:30:00Z",
        type: "image",
        storageClass: "standard",
        hash: "img004screens5"
      },
      {
        name: "marketing_assets_Q4_2025.zip",
        size: 157286400,        // 150MB - פעיל! (אוקטובר 2025)
        lastModified: "2025-10-05T09:00:00Z",
        type: "image",
        storageClass: "standard",
        hash: "img005mktQ425"
      },

      // ===== LOGS =====
      {
        name: "error_logs_2021.log",
        size: 157286400,        // 150MB - ישן מאוד
        lastModified: "2021-10-30T23:59:00Z",
        type: "log",
        storageClass: "standard",
        hash: "log001err2021"
      },
      {
        name: "access_logs_Q2_2022.log",
        size: 209715200,        // 200MB - ישן
        lastModified: "2022-06-30T23:59:00Z",
        type: "log",
        storageClass: "standard",
        hash: "log002acc2022"
      },
      {
        name: "debug_logs_archive.zip",
        size: 419430400,        // 400MB - ישן
        lastModified: "2022-02-14T08:00:00Z",
        type: "log",
        storageClass: "standard",
        hash: "log003debzip"
      },
      {
        name: "app_logs_jan2026.log",
        size: 31457280,         // 30MB - פעיל! (ינואר 2026)
        lastModified: "2026-01-31T23:59:00Z",
        type: "log",
        storageClass: "standard",
        hash: "log004jan2026"
      },

      // ===== DOCUMENTS =====
      {
        name: "budget_2022_final.xlsx",
        size: 4194304,          // 4MB - ישן
        lastModified: "2022-12-31T17:00:00Z",
        type: "document",
        storageClass: "standard",
        hash: "doc003bud2022"
      },
      {
        name: "Q3_2025_report.pdf",
        size: 5242880,          // 5MB - פעיל! (ספטמבר 2025)
        lastModified: "2025-09-30T16:00:00Z",
        type: "document",
        storageClass: "standard",
        hash: "doc004q32025"
      },
      {
        name: "product_roadmap_2026.docx",
        size: 3145728,          // 3MB - פעיל! (ינואר 2026)
        lastModified: "2026-01-20T14:00:00Z",
        type: "document",
        storageClass: "standard",
        hash: "doc005road26"
      },

      // ===== CODE =====
      {
        name: "legacy_codebase_v1.zip",
        size: 367001600,        // 350MB - ישן מאוד
        lastModified: "2021-05-20T10:00:00Z",
        type: "code",
        storageClass: "standard",
        hash: "cod001legv12021"
      },
      {
        name: "legacy_codebase_v1_backup.zip",
        size: 367001600,        // 350MB - כפול + ישן
        lastModified: "2021-05-21T11:00:00Z",
        type: "code",
        storageClass: "standard",
        hash: "cod001legv12021"
      },
      {
        name: "frontend_build_dec2025.zip",
        size: 52428800,         // 50MB - פעיל! (דצמבר 2025)
        lastModified: "2025-12-28T11:00:00Z",
        type: "code",
        storageClass: "standard",
        hash: "cod002febd25"
      }
    ]
  };
};
