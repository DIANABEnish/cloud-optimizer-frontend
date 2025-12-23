#!/usr/bin/env python3
"""
Cloud Storage Optimizer - Storage Report Generator (Python)
==============================================================
This script scans a local directory and generates a JSON report
that can be uploaded to the Cloud Storage Optimizer web app.

Usage:
    python generate_report.py

Requirements:
    - Python 3.6+
    - No external dependencies (uses only built-in modules)

Created for: https://your-app.com
"""

import os
import json
import hashlib
from datetime import datetime
from pathlib import Path
import sys

# =======================================
# Configuration
# =======================================
CHUNK_SIZE = 8192  # For reading files in chunks (8KB)
MAX_FILE_SIZE_FOR_HASH = 100 * 1024 * 1024  # 100MB - don't hash files larger than this

# =======================================
# Helper Functions
# =======================================

def get_file_hash(filepath):
    """
    Calculate MD5 hash of a file.
    For large files (>100MB), we skip hashing to save time.
    """
    try:
        file_size = os.path.getsize(filepath)
        
        # Skip hashing for very large files
        if file_size > MAX_FILE_SIZE_FOR_HASH:
            return f"large_file_{file_size}"
        
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            while chunk := f.read(CHUNK_SIZE):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        return f"error_{str(e)[:20]}"

def get_file_type(filename):
    """
    Determine file type based on extension.
    """
    ext = Path(filename).suffix.lower()
    
    type_map = {
        # Images
        '.jpg': 'image', '.jpeg': 'image', '.png': 'image', 
        '.gif': 'image', '.bmp': 'image', '.svg': 'image',
        '.heic': 'image', '.webp': 'image',
        
        # Videos
        '.mp4': 'video', '.avi': 'video', '.mov': 'video', 
        '.mkv': 'video', '.flv': 'video', '.wmv': 'video',
        '.webm': 'video', '.m4v': 'video',
        
        # Documents
        '.pdf': 'document', '.docx': 'document', '.doc': 'document',
        '.txt': 'document', '.rtf': 'document', '.odt': 'document',
        '.xlsx': 'document', '.xls': 'document', '.pptx': 'document',
        
        # Archives/Backups
        '.zip': 'backup', '.tar': 'backup', '.gz': 'backup',
        '.rar': 'backup', '.7z': 'backup', '.bz2': 'backup',
        
        # Logs
        '.csv': 'log', '.log': 'log', '.json': 'log',
        
        # Code
        '.py': 'code', '.js': 'code', '.html': 'code',
        '.css': 'code', '.java': 'code', '.cpp': 'code',
        
        # Audio
        '.mp3': 'audio', '.wav': 'audio', '.flac': 'audio',
        '.m4a': 'audio', '.aac': 'audio'
    }
    
    return type_map.get(ext, 'other')

def format_size(bytes_size):
    """Format bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f} PB"

def scan_directory(path, show_progress=True):
    """
    Scan a directory and collect metadata for all files.
    
    Returns:
        tuple: (list of file data, total size in bytes)
    """
    files = []
    total_size = 0
    file_count = 0
    skipped = 0
    
    print(f"\n🔍 Scanning directory: {path}")
    print("=" * 70)
    
    try:
        for root, dirs, filenames in os.walk(path):
            # Skip hidden directories (starting with .)
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for filename in filenames:
                # Skip hidden files
                if filename.startswith('.'):
                    continue
                
                try:
                    filepath = os.path.join(root, filename)
                    stat = os.stat(filepath)
                    
                    file_data = {
                        'name': filename,
                        'size': stat.st_size,
                        'lastModified': datetime.fromtimestamp(stat.st_mtime).isoformat() + 'Z',
                        'type': get_file_type(filename),
                        'storageClass': 'standard',
                        'hash': get_file_hash(filepath)
                    }
                    
                    files.append(file_data)
                    total_size += stat.st_size
                    file_count += 1
                    
                    # Show progress every 50 files
                    if show_progress and file_count % 50 == 0:
                        print(f"  📂 Found {file_count} files... ({format_size(total_size)})")
                        
                except Exception as e:
                    skipped += 1
                    if show_progress and skipped <= 5:  # Show first 5 errors only
                        print(f"  ⚠️  Skipping {filename}: {str(e)[:50]}")
        
        if skipped > 5:
            print(f"  ⚠️  ... and {skipped - 5} more files skipped")
                    
    except Exception as e:
        print(f"\n❌ Error scanning directory: {e}")
        sys.exit(1)
    
    return files, total_size

# =======================================
# Main Function
# =======================================

def main():
    """Main function - runs the storage report generator"""
    
    # Print welcome banner
    print("""
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      Cloud Storage Optimizer                              ║
║      Storage Report Generator (Python)                    ║
║                                                           ║
║      Scan your local storage and find optimization        ║
║      opportunities!                                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    """)
    
    # Get directory from user
    while True:
        print("\n📁 Enter the directory path you want to scan:")
        print("   Examples:")
        print("     Windows: C:\\Users\\YourName\\Documents")
        print("     Mac:     /Users/YourName/Documents")
        print("     Linux:   /home/yourname/documents")
        print()
        
        directory = input("Path: ").strip().strip('"').strip("'")
        
        if not directory:
            print("❌ Please enter a path")
            continue
            
        if not os.path.exists(directory):
            print(f"❌ Path does not exist: {directory}")
            retry = input("Try again? (y/n): ").lower()
            if retry != 'y':
                print("Goodbye! 👋")
                sys.exit(0)
            continue
            
        if not os.path.isdir(directory):
            print(f"❌ Path is not a directory: {directory}")
            continue
            
        break
    
    # Scan the directory
    print("\n⏳ Starting scan... (this may take a while for large directories)")
    files_data, total_size = scan_directory(directory, show_progress=True)
    
    # Print summary
    print("\n" + "=" * 70)
    print("✅ Scan complete!")
    print(f"   📊 Files found: {len(files_data):,}")
    print(f"   💾 Total size: {format_size(total_size)}")
    
    # Ask for output filename
    print("\n💾 Save report as:")
    output_file = input("   Filename (default: storage_report.json): ").strip()
    if not output_file:
        output_file = 'storage_report.json'
    if not output_file.endswith('.json'):
        output_file += '.json'
    
    # Create report
    report = {
        'files': files_data,
        'metadata': {
            'scannedPath': directory,
            'scannedAt': datetime.now().isoformat() + 'Z',
            'totalFiles': len(files_data),
            'totalSize': total_size
        }
    }
    
    # Save to file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        file_size = os.path.getsize(output_file)
        print(f"\n✅ Report saved successfully!")
        print(f"   📄 File: {os.path.abspath(output_file)}")
        print(f"   📊 Size: {format_size(file_size)}")
        
    except Exception as e:
        print(f"\n❌ Error saving file: {e}")
        sys.exit(1)
    
    # Next steps
    print("\n" + "=" * 70)
    print("🚀 Next Steps:")
    print(f"   1. Go to your Cloud Storage Optimizer web app")
    print(f"   2. Click 'Upload JSON File'")
    print(f"   3. Select: {output_file}")
    print(f"   4. Get your optimization recommendations!")
    print("\n" + "=" * 70)
    print("\nThank you for using Cloud Storage Optimizer! 💙")
    print()

# =======================================
# Entry Point
# =======================================

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Cancelled by user. Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)