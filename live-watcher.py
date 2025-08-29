#!/usr/bin/env python3
"""
🎭 LIVE WEBSITE WATCHER 🎭
Real-time file monitoring with beautiful ASCII animations
"""

import os
import time
import hashlib
from datetime import datetime
import sys

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_animated_banner():
    """Print amazing animated banner"""
    banner_frames = [
        """
╔════════════════════════════════════════════════════════════════════════════╗
║  🎭 LIVE WEBSITE WATCHER                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  👀 Monitoring: europeansummercamps.com source files                      ║
║  🔄 Real-time change detection with visual effects                        ║
╚════════════════════════════════════════════════════════════════════════════╝
        """,
        """
╔════════════════════════════════════════════════════════════════════════════╗
║  🚀 LIVE WEBSITE WATCHER                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  👀 Monitoring: europeansummercamps.com source files                      ║
║  🔄 Real-time change detection with visual effects                        ║
╚════════════════════════════════════════════════════════════════════════════╝
        """,
        """
╔════════════════════════════════════════════════════════════════════════════╗
║  ⚡ LIVE WEBSITE WATCHER                                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  👀 Monitoring: europeansummercamps.com source files                      ║
║  🔄 Real-time change detection with visual effects                        ║
╚════════════════════════════════════════════════════════════════════════════╝
        """
    ]
    
    for frame in banner_frames:
        os.system('cls' if os.name == 'nt' else 'clear')
        print(Colors.OKCYAN + frame + Colors.ENDC)
        time.sleep(0.8)

def get_file_hash(filepath):
    """Get MD5 hash of file"""
    try:
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def get_file_stats(filepath):
    """Get file statistics"""
    try:
        stat = os.stat(filepath)
        return {
            'size': stat.st_size,
            'modified': stat.st_mtime,
            'hash': get_file_hash(filepath)
        }
    except:
        return None

def scan_project_files(base_path):
    """Scan all relevant project files"""
    important_extensions = {'.jsx', '.js', '.html', '.css', '.json', '.md'}
    important_files = {}
    
    for root, dirs, files in os.walk(base_path):
        # Skip node_modules and other irrelevant dirs
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build', '.vercel']]
        
        for file in files:
            if any(file.endswith(ext) for ext in important_extensions):
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, base_path)
                stats = get_file_stats(full_path)
                if stats:
                    important_files[relative_path] = stats
    
    return important_files

def create_file_type_icon(filename):
    """Return emoji based on file type"""
    if filename.endswith('.jsx'):
        return '⚛️'
    elif filename.endswith('.js'):
        return '📜'
    elif filename.endswith('.html'):
        return '🌐'
    elif filename.endswith('.css'):
        return '🎨'
    elif filename.endswith('.json'):
        return '📋'
    elif filename.endswith('.md'):
        return '📖'
    else:
        return '📄'

def display_file_changes(changes, file_states):
    """Display file changes with beautiful formatting"""
    if not changes:
        return
    
    print(f"\n{Colors.BOLD}🔥 DETECTED CHANGES:{Colors.ENDC}")
    print("=" * 60)
    
    for file_path, change_type in changes.items():
        icon = create_file_type_icon(file_path)
        current_time = datetime.now().strftime('%H:%M:%S')
        
        if change_type == 'modified':
            color = Colors.WARNING
            status = "📝 MODIFIED"
        elif change_type == 'new':
            color = Colors.OKGREEN
            status = "✨ NEW FILE"
        elif change_type == 'deleted':
            color = Colors.FAIL
            status = "🗑️  DELETED"
        
        print(f"{color}{icon} {file_path:<40} {status} at {current_time}{Colors.ENDC}")
        
        if change_type == 'modified' and file_path in file_states:
            old_size = file_states[file_path]['size']
            new_size = get_file_stats(file_path)['size'] if get_file_stats(file_path) else 0
            size_diff = new_size - old_size
            
            if size_diff > 0:
                print(f"   📈 Size increased by {size_diff} bytes")
            elif size_diff < 0:
                print(f"   📉 Size decreased by {abs(size_diff)} bytes")
            else:
                print(f"   📏 Size unchanged ({new_size} bytes)")

def create_live_stats_display(file_states):
    """Create live statistics display"""
    total_files = len(file_states)
    total_size = sum(stats['size'] for stats in file_states.values())
    
    # File type breakdown
    file_types = {}
    for file_path in file_states:
        ext = os.path.splitext(file_path)[1]
        file_types[ext] = file_types.get(ext, 0) + 1
    
    print(f"\n{Colors.OKCYAN}📊 LIVE PROJECT STATISTICS:{Colors.ENDC}")
    print(f"   📂 Total Files Monitored: {total_files}")
    print(f"   📦 Total Project Size: {total_size:,} bytes ({total_size/1024:.1f} KB)")
    
    print(f"\n   📋 File Type Breakdown:")
    for ext, count in sorted(file_types.items()):
        icon = create_file_type_icon(f"file{ext}")
        print(f"      {icon} {ext}: {count} files")

def main():
    """Main monitoring loop"""
    print_animated_banner()
    
    base_path = os.path.dirname(os.path.abspath(__file__))
    print(f"\n🎯 Monitoring path: {base_path}")
    print(f"🕒 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Initial scan
    print(f"\n🔍 Performing initial scan...")
    file_states = scan_project_files(base_path)
    
    print(f"\n{Colors.OKGREEN}✅ Initial scan complete!{Colors.ENDC}")
    create_live_stats_display(file_states)
    print(f"\n{Colors.BOLD}👀 Now watching for changes... (Press Ctrl+C to stop){Colors.ENDC}")
    
    scan_count = 0
    
    try:
        while True:
            time.sleep(2)  # Check every 2 seconds
            scan_count += 1
            
            # Rescan files
            current_states = scan_project_files(base_path)
            changes = {}
            
            # Detect changes
            for file_path, current_stats in current_states.items():
                if file_path not in file_states:
                    changes[file_path] = 'new'
                elif file_states[file_path]['hash'] != current_stats['hash']:
                    changes[file_path] = 'modified'
            
            # Detect deletions
            for file_path in file_states:
                if file_path not in current_states:
                    changes[file_path] = 'deleted'
            
            # Display changes
            if changes:
                # Clear screen for dramatic effect
                os.system('cls' if os.name == 'nt' else 'clear')
                print_animated_banner()
                display_file_changes(changes, file_states)
                create_live_stats_display(current_states)
                print(f"\n🔄 Scan #{scan_count} - {datetime.now().strftime('%H:%M:%S')}")
                print(f"👀 Still watching... (Press Ctrl+C to stop)")
            
            # Update file states
            file_states = current_states
            
    except KeyboardInterrupt:
        print(f"\n\n{Colors.OKGREEN}🛑 Monitoring stopped by user.{Colors.ENDC}")
        print(f"📊 Final Stats:")
        print(f"   🔍 Total Scans: {scan_count}")
        print(f"   📂 Files Monitored: {len(file_states)}")
        print(f"   🕒 Session Duration: {datetime.now().strftime('%H:%M:%S')}")
        print(f"\n{Colors.BOLD}🎉 Thanks for using Live Website Watcher!{Colors.ENDC}")

if __name__ == "__main__":
    main()