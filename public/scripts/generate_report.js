#!/usr/bin/env node

/**
 * Cloud Storage Optimizer - Storage Report Generator (Node.js)
 * ==============================================================
 * This script scans a local directory and generates a JSON report
 * that can be uploaded to the Cloud Storage Optimizer web app.
 * 
 * Usage:
 *     node generate_report.js
 * 
 * Requirements:
 *     - Node.js 14+
 *     - No external dependencies (uses only built-in modules)
 * 
 * Created for: https://your-app.com
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

// =======================================
// Configuration
// =======================================
const CHUNK_SIZE = 8192; // 8KB chunks for file reading
const MAX_FILE_SIZE_FOR_HASH = 100 * 1024 * 1024; // 100MB

// =======================================
// Helper Functions
// =======================================

/**
 * Calculate MD5 hash of a file
 */
function getFileHash(filepath) {
  try {
    const stats = fs.statSync(filepath);
    
    // Skip hashing for very large files
    if (stats.size > MAX_FILE_SIZE_FOR_HASH) {
      return `large_file_${stats.size}`;
    }
    
    const hash = crypto.createHash('md5');
    const data = fs.readFileSync(filepath);
    hash.update(data);
    return hash.digest('hex');
  } catch (error) {
    return `error_${error.message.substring(0, 20)}`;
  }
}

/**
 * Determine file type based on extension
 */
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  
  const typeMap = {
    // Images
    '.jpg': 'image', '.jpeg': 'image', '.png': 'image',
    '.gif': 'image', '.bmp': 'image', '.svg': 'image',
    '.heic': 'image', '.webp': 'image',
    
    // Videos
    '.mp4': 'video', '.avi': 'video', '.mov': 'video',
    '.mkv': 'video', '.flv': 'video', '.wmv': 'video',
    '.webm': 'video', '.m4v': 'video',
    
    // Documents
    '.pdf': 'document', '.docx': 'document', '.doc': 'document',
    '.txt': 'document', '.rtf': 'document', '.odt': 'document',
    '.xlsx': 'document', '.xls': 'document', '.pptx': 'document',
    
    // Archives/Backups
    '.zip': 'backup', '.tar': 'backup', '.gz': 'backup',
    '.rar': 'backup', '.7z': 'backup', '.bz2': 'backup',
    
    // Logs
    '.csv': 'log', '.log': 'log', '.json': 'log',
    
    // Code
    '.js': 'code', '.py': 'code', '.html': 'code',
    '.css': 'code', '.java': 'code', '.cpp': 'code',
    
    // Audio
    '.mp3': 'audio', '.wav': 'audio', '.flac': 'audio',
    '.m4a': 'audio', '.aac': 'audio'
  };
  
  return typeMap[ext] || 'other';
}

/**
 * Format bytes to human readable format
 */
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Recursively scan a directory and collect file metadata
 */
function scanDirectory(dirPath, showProgress = true) {
  const files = [];
  let totalSize = 0;
  let fileCount = 0;
  let skipped = 0;
  
  console.log(`\n🔍 Scanning directory: ${dirPath}`);
  console.log('='.repeat(70));
  
  function scanRecursive(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        // Skip hidden files/folders
        if (item.startsWith('.')) continue;
        
        const itemPath = path.join(currentPath, item);
        
        try {
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            // Recursively scan subdirectory
            scanRecursive(itemPath);
          } else if (stats.isFile()) {
            const fileData = {
              name: item,
              size: stats.size,
              lastModified: stats.mtime.toISOString(),
              type: getFileType(item),
              storageClass: 'standard',
              hash: getFileHash(itemPath)
            };
            
            files.push(fileData);
            totalSize += stats.size;
            fileCount++;
            
            // Show progress every 50 files
            if (showProgress && fileCount % 50 === 0) {
              console.log(`  📂 Found ${fileCount.toLocaleString()} files... (${formatSize(totalSize)})`);
            }
          }
        } catch (error) {
          skipped++;
          if (showProgress && skipped <= 5) {
            console.log(`  ⚠️  Skipping ${item}: ${error.message.substring(0, 50)}`);
          }
        }
      }
    } catch (error) {
      console.error(`\n❌ Error scanning ${currentPath}: ${error.message}`);
    }
  }
  
  scanRecursive(dirPath);
  
  if (skipped > 5) {
    console.log(`  ⚠️  ... and ${skipped - 5} more files skipped`);
  }
  
  return { files, totalSize };
}

/**
 * Prompt user for input
 */
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// =======================================
// Main Function
// =======================================

async function main() {
  // Print welcome banner
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      Cloud Storage Optimizer                              ║
║      Storage Report Generator (Node.js)                   ║
║                                                           ║
║      Scan your local storage and find optimization        ║
║      opportunities!                                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  // Get directory from user
  let directory;
  while (true) {
    console.log('\n📁 Enter the directory path you want to scan:');
    console.log('   Examples:');
    console.log('     Windows: C:\\Users\\YourName\\Documents');
    console.log('     Mac:     /Users/YourName/Documents');
    console.log('     Linux:   /home/yourname/documents');
    console.log();
    
    directory = await prompt('Path: ');
    directory = directory.replace(/['"]/g, ''); // Remove quotes
    
    if (!directory) {
      console.log('❌ Please enter a path');
      continue;
    }
    
    if (!fs.existsSync(directory)) {
      console.log(`❌ Path does not exist: ${directory}`);
      const retry = await prompt('Try again? (y/n): ');
      if (retry.toLowerCase() !== 'y') {
        console.log('Goodbye! 👋');
        process.exit(0);
      }
      continue;
    }
    
    const stats = fs.statSync(directory);
    if (!stats.isDirectory()) {
      console.log(`❌ Path is not a directory: ${directory}`);
      continue;
    }
    
    break;
  }
  
  // Scan the directory
  console.log('\n⏳ Starting scan... (this may take a while for large directories)');
  const { files, totalSize } = scanDirectory(directory, true);
  
  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('✅ Scan complete!');
  console.log(`   📊 Files found: ${files.length.toLocaleString()}`);
  console.log(`   💾 Total size: ${formatSize(totalSize)}`);
  
  // Ask for output filename
  console.log('\n💾 Save report as:');
  let outputFile = await prompt('   Filename (default: storage_report.json): ');
  if (!outputFile) {
    outputFile = 'storage_report.json';
  }
  if (!outputFile.endsWith('.json')) {
    outputFile += '.json';
  }
  
  // Create report
  const report = {
    files: files,
    metadata: {
      scannedPath: directory,
      scannedAt: new Date().toISOString(),
      totalFiles: files.length,
      totalSize: totalSize
    }
  };
  
  // Save to file
  try {
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2), 'utf-8');
    
    const fileStats = fs.statSync(outputFile);
    console.log('\n✅ Report saved successfully!');
    console.log(`   📄 File: ${path.resolve(outputFile)}`);
    console.log(`   📊 Size: ${formatSize(fileStats.size)}`);
    
  } catch (error) {
    console.error(`\n❌ Error saving file: ${error.message}`);
    process.exit(1);
  }
  
  // Next steps
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Next Steps:');
  console.log('   1. Go to your Cloud Storage Optimizer web app');
  console.log('   2. Click \'Upload JSON File\'');
  console.log(`   3. Select: ${outputFile}`);
  console.log('   4. Get your optimization recommendations!');
  console.log('\n' + '='.repeat(70));
  console.log('\nThank you for using Cloud Storage Optimizer! 💙\n');
}

// =======================================
// Entry Point
// =======================================

main().catch(error => {
  console.error(`\n❌ Unexpected error: ${error.message}`);
  process.exit(1);
});