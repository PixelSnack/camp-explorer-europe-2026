#!/usr/bin/env python3
"""
🚀 LIVE WEBSITE PERFORMANCE MONITOR 🚀
Real-time monitoring dashboard for europeansummercamps.com
"""

import requests
import time
import json
from datetime import datetime
import sys
import os

# Cool ASCII art header
def print_header():
    header = """
╔══════════════════════════════════════════════════════════════════════════════╗
║  🚀 LIVE PERFORMANCE MONITOR - europeansummercamps.com                      ║
║  ────────────────────────────────────────────────────────────────────────  ║
║  Real-time website monitoring with beautiful visualizations                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """
    print("\033[96m" + header + "\033[0m")

def get_site_metrics():
    """Fetch real-time metrics from your live site"""
    url = "https://www.europeansummercamps.com"
    
    try:
        # Time the request
        start_time = time.time()
        response = requests.get(url, timeout=10)
        load_time = (time.time() - start_time) * 1000  # Convert to ms
        
        # Get response details
        status_code = response.status_code
        content_size = len(response.content)
        headers = dict(response.headers)
        
        # Check for performance headers
        server_timing = headers.get('server-timing', 'N/A')
        cache_control = headers.get('cache-control', 'N/A')
        content_encoding = headers.get('content-encoding', 'N/A')
        
        return {
            'timestamp': datetime.now().strftime('%H:%M:%S'),
            'status': status_code,
            'load_time': round(load_time, 2),
            'size_kb': round(content_size / 1024, 2),
            'server': headers.get('server', 'Unknown'),
            'cache_control': cache_control,
            'encoding': content_encoding,
            'success': status_code == 200
        }
    except Exception as e:
        return {
            'timestamp': datetime.now().strftime('%H:%M:%S'),
            'status': 'ERROR',
            'load_time': 0,
            'size_kb': 0,
            'error': str(e),
            'success': False
        }

def create_load_time_bar(load_time):
    """Create a visual bar chart for load time"""
    # Scale: 0-500ms = green, 500-1000ms = yellow, 1000+ = red
    max_width = 50
    
    if load_time < 500:
        color = "\033[92m"  # Green
        status = "🚀 FAST"
    elif load_time < 1000:
        color = "\033[93m"  # Yellow
        status = "⚡ GOOD"
    else:
        color = "\033[91m"  # Red
        status = "🐌 SLOW"
    
    # Calculate bar width (max 2000ms scale)
    width = min(int((load_time / 2000) * max_width), max_width)
    bar = "█" * width + "░" * (max_width - width)
    
    return f"{color}{bar}\033[0m {status} ({load_time}ms)"

def display_metrics(metrics_history):
    """Display beautiful real-time dashboard"""
    # Clear screen
    os.system('cls' if os.name == 'nt' else 'clear')
    
    print_header()
    
    if not metrics_history:
        print("\n📊 Waiting for data...")
        return
    
    latest = metrics_history[-1]
    
    # Status indicator
    if latest['success']:
        status_icon = "\033[92m🟢 ONLINE\033[0m"
    else:
        status_icon = "\033[91m🔴 OFFLINE\033[0m"
    
    print(f"\n🌐 Site Status: {status_icon}")
    print(f"🕒 Last Check: {latest['timestamp']}")
    print(f"📡 Response Code: {latest['status']}")
    print(f"📦 Page Size: {latest['size_kb']} KB")
    print(f"🖥️  Server: {latest.get('server', 'Unknown')}")
    
    print(f"\n⚡ Load Time Analysis:")
    print(f"   {create_load_time_bar(latest['load_time'])}")
    
    # Performance trend (last 10 checks)
    if len(metrics_history) > 1:
        recent = metrics_history[-10:]
        avg_load_time = sum(m['load_time'] for m in recent if m['success']) / len([m for m in recent if m['success']])
        
        print(f"\n📈 Performance Trends (Last {len(recent)} checks):")
        print(f"   Average Load Time: {round(avg_load_time, 2)}ms")
        
        # Mini trend visualization
        print(f"   Trend: ", end="")
        for metric in recent:
            if metric['success']:
                if metric['load_time'] < 500:
                    print("\033[92m●\033[0m", end="")  # Green dot
                elif metric['load_time'] < 1000:
                    print("\033[93m●\033[0m", end="")  # Yellow dot
                else:
                    print("\033[91m●\033[0m", end="")  # Red dot
            else:
                print("\033[90m×\033[0m", end="")  # Gray X
        print()
    
    # Real-time updates info
    print(f"\n🔄 Monitoring every 5 seconds... Press Ctrl+C to stop")
    print(f"📊 Total Checks: {len(metrics_history)}")

def main():
    """Main monitoring loop"""
    metrics_history = []
    
    try:
        while True:
            # Fetch new metrics
            metrics = get_site_metrics()
            metrics_history.append(metrics)
            
            # Display dashboard
            display_metrics(metrics_history)
            
            # Wait 5 seconds
            time.sleep(5)
            
    except KeyboardInterrupt:
        print(f"\n\n🛑 Monitoring stopped.")
        print(f"📊 Final Report:")
        
        if metrics_history:
            successful_checks = [m for m in metrics_history if m['success']]
            if successful_checks:
                avg_load = sum(m['load_time'] for m in successful_checks) / len(successful_checks)
                print(f"   ✅ Successful Checks: {len(successful_checks)}/{len(metrics_history)}")
                print(f"   ⚡ Average Load Time: {round(avg_load, 2)}ms")
                print(f"   📈 Best Load Time: {round(min(m['load_time'] for m in successful_checks), 2)}ms")
                print(f"   📉 Worst Load Time: {round(max(m['load_time'] for m in successful_checks), 2)}ms")
        
        print(f"\n🎉 Thanks for using the Performance Monitor!")

if __name__ == "__main__":
    main()