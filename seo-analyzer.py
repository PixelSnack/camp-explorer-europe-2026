#!/usr/bin/env python3
"""
🎨 ADVANCED SEO PERFORMANCE ANALYZER 🎨
3D Visualization of europeansummercamps.com SEO metrics
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import re
import sys

def print_animated_header():
    """Animated ASCII header"""
    frames = [
        """
╔════════════════════════════════════════════════════════════════════════════════╗
║  🎯 SEO PERFORMANCE ANALYZER                                                  ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  Analyzing: europeansummercamps.com                                           ║
╚════════════════════════════════════════════════════════════════════════════════╝
        """,
        """
╔════════════════════════════════════════════════════════════════════════════════╗
║  🚀 SEO PERFORMANCE ANALYZER                                                  ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  Analyzing: europeansummercamps.com                                           ║
╚════════════════════════════════════════════════════════════════════════════════╝
        """,
        """
╔════════════════════════════════════════════════════════════════════════════════╗
║  ⚡ SEO PERFORMANCE ANALYZER                                                  ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  Analyzing: europeansummercamps.com                                           ║
╚════════════════════════════════════════════════════════════════════════════════╝
        """
    ]
    
    for frame in frames:
        print("\033[2J\033[H", end="")  # Clear screen and move cursor to top
        print("\033[96m" + frame + "\033[0m")
        time.sleep(0.5)

def analyze_seo_metrics():
    """Analyze comprehensive SEO metrics"""
    url = "https://www.europeansummercamps.com"
    
    print("\n🔍 Fetching website data...")
    
    try:
        response = requests.get(url, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract SEO data
        title = soup.find('title')
        meta_desc = soup.find('meta', {'name': 'description'})
        meta_keywords = soup.find('meta', {'name': 'keywords'})
        canonical = soup.find('link', {'rel': 'canonical'})
        
        # Structured data analysis
        structured_data = soup.find_all('script', {'type': 'application/ld+json'})
        
        # Header analysis
        h1_tags = soup.find_all('h1')
        h2_tags = soup.find_all('h2')
        h3_tags = soup.find_all('h3')
        
        # Image analysis
        images = soup.find_all('img')
        images_with_alt = [img for img in images if img.get('alt')]
        
        # Link analysis
        internal_links = len([link for link in soup.find_all('a', href=True) 
                             if 'europeansummercamps.com' in str(link.get('href')) or link.get('href', '').startswith('/')])
        external_links = len([link for link in soup.find_all('a', href=True) 
                             if link.get('href', '').startswith('http') and 'europeansummercamps.com' not in str(link.get('href'))])
        
        return {
            'title': {
                'content': title.get_text() if title else None,
                'length': len(title.get_text()) if title else 0,
                'score': calculate_title_score(title.get_text() if title else "")
            },
            'meta_description': {
                'content': meta_desc.get('content') if meta_desc else None,
                'length': len(meta_desc.get('content')) if meta_desc else 0,
                'score': calculate_meta_desc_score(meta_desc.get('content') if meta_desc else "")
            },
            'keywords': meta_keywords.get('content') if meta_keywords else None,
            'canonical': canonical.get('href') if canonical else None,
            'structured_data': {
                'count': len(structured_data),
                'types': extract_schema_types(structured_data)
            },
            'headers': {
                'h1_count': len(h1_tags),
                'h2_count': len(h2_tags),
                'h3_count': len(h3_tags),
                'h1_text': [h1.get_text()[:50] + "..." for h1 in h1_tags[:3]]
            },
            'images': {
                'total': len(images),
                'with_alt': len(images_with_alt),
                'alt_ratio': round((len(images_with_alt) / len(images)) * 100, 1) if images else 0
            },
            'links': {
                'internal': internal_links,
                'external': external_links
            },
            'page_size': len(response.content),
            'load_time': response.elapsed.total_seconds() * 1000
        }
        
    except Exception as e:
        return {'error': str(e)}

def calculate_title_score(title):
    """Calculate title SEO score"""
    if not title:
        return 0
    
    score = 0
    length = len(title)
    
    # Length score (optimal 50-60 chars)
    if 50 <= length <= 60:
        score += 30
    elif 30 <= length <= 70:
        score += 20
    else:
        score += 10
    
    # Keyword presence
    keywords = ['european', 'summer', 'camps', 'camp', 'europe', '2026']
    found_keywords = sum(1 for keyword in keywords if keyword.lower() in title.lower())
    score += found_keywords * 10
    
    # Brand presence
    if 'camp explorer' in title.lower():
        score += 10
    
    return min(score, 100)

def calculate_meta_desc_score(desc):
    """Calculate meta description SEO score"""
    if not desc:
        return 0
    
    score = 0
    length = len(desc)
    
    # Length score (optimal 150-160 chars)
    if 150 <= length <= 160:
        score += 30
    elif 120 <= length <= 170:
        score += 20
    else:
        score += 10
    
    # Keyword presence
    keywords = ['european', 'summer', 'camps', 'verified', 'guide']
    found_keywords = sum(1 for keyword in keywords if keyword.lower() in desc.lower())
    score += found_keywords * 10
    
    # Call to action
    cta_words = ['discover', 'compare', 'find', 'book', 'explore']
    if any(word in desc.lower() for word in cta_words):
        score += 15
    
    return min(score, 100)

def extract_schema_types(structured_data):
    """Extract schema.org types from structured data"""
    types = []
    for script in structured_data:
        try:
            data = json.loads(script.string)
            if isinstance(data, dict):
                if '@type' in data:
                    types.append(data['@type'])
                elif '@graph' in data:
                    for item in data['@graph']:
                        if '@type' in item:
                            types.append(item['@type'])
        except:
            continue
    return list(set(types))

def create_score_visualization(score, label):
    """Create visual score bar"""
    max_width = 30
    filled = int((score / 100) * max_width)
    
    if score >= 80:
        color = "\033[92m"  # Green
        emoji = "🟢"
    elif score >= 60:
        color = "\033[93m"  # Yellow
        emoji = "🟡"
    else:
        color = "\033[91m"  # Red
        emoji = "🔴"
    
    bar = "█" * filled + "░" * (max_width - filled)
    return f"{emoji} {label:<20} {color}{bar}\033[0m {score}/100"

def display_seo_analysis(data):
    """Display comprehensive SEO analysis"""
    print("\n" + "="*80)
    print("📊 COMPREHENSIVE SEO ANALYSIS REPORT")
    print("="*80)
    
    if 'error' in data:
        print(f"❌ Error: {data['error']}")
        return
    
    # Overall scores
    title_score = data['title']['score']
    meta_score = data['meta_description']['score']
    
    # Technical scores
    schema_score = min((data['structured_data']['count'] * 25), 100)
    image_score = data['images']['alt_ratio']
    
    overall_score = (title_score + meta_score + schema_score + image_score) / 4
    
    print(f"\n🎯 OVERALL SEO SCORE: {overall_score:.1f}/100")
    print(f"   {create_score_bar(overall_score)}")
    
    print(f"\n📝 ON-PAGE SEO:")
    print(f"   {create_score_visualization(title_score, 'Title Tag')}")
    print(f"   {create_score_visualization(meta_score, 'Meta Description')}")
    print(f"   {create_score_visualization(schema_score, 'Structured Data')}")
    print(f"   {create_score_visualization(image_score, 'Image Alt Tags')}")
    
    print(f"\n📊 TECHNICAL DETAILS:")
    print(f"   📄 Page Title: {data['title']['content']}")
    print(f"   📏 Title Length: {data['title']['length']} chars")
    print(f"   📝 Meta Description Length: {data['meta_description']['length']} chars")
    print(f"   🔗 Canonical URL: {'✅ Present' if data['canonical'] else '❌ Missing'}")
    
    print(f"\n🏗️  STRUCTURED DATA:")
    print(f"   📦 Schema Count: {data['structured_data']['count']}")
    print(f"   🏷️  Schema Types: {', '.join(data['structured_data']['types'])}")
    
    print(f"\n📰 CONTENT STRUCTURE:")
    print(f"   H1 Tags: {data['headers']['h1_count']}")
    print(f"   H2 Tags: {data['headers']['h2_count']}")
    print(f"   H3 Tags: {data['headers']['h3_count']}")
    
    print(f"\n🖼️  IMAGES & LINKS:")
    print(f"   🖼️  Total Images: {data['images']['total']}")
    print(f"   🏷️  Images with Alt: {data['images']['with_alt']} ({data['images']['alt_ratio']}%)")
    print(f"   🔗 Internal Links: {data['links']['internal']}")
    print(f"   🌐 External Links: {data['links']['external']}")
    
    print(f"\n⚡ PERFORMANCE:")
    print(f"   📦 Page Size: {data['page_size']:,} bytes ({data['page_size']/1024:.1f} KB)")
    print(f"   ⏱️  Load Time: {data['load_time']:.2f}ms")
    
    # SEO recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    recommendations = []
    
    if title_score < 80:
        recommendations.append("🔧 Optimize title length (50-60 chars ideal)")
    if meta_score < 80:
        recommendations.append("🔧 Improve meta description (150-160 chars, include CTA)")
    if data['images']['alt_ratio'] < 90:
        recommendations.append("🔧 Add alt text to more images")
    if data['structured_data']['count'] < 3:
        recommendations.append("🔧 Add more structured data schemas")
    
    if recommendations:
        for rec in recommendations:
            print(f"   {rec}")
    else:
        print("   🎉 Excellent SEO implementation! No major issues found.")

def create_score_bar(score):
    """Create overall score visualization"""
    if score >= 90:
        return "🚀 EXCELLENT"
    elif score >= 80:
        return "✅ VERY GOOD"
    elif score >= 70:
        return "👍 GOOD"
    elif score >= 60:
        return "⚠️  NEEDS WORK"
    else:
        return "❌ POOR"

def main():
    """Main analysis function"""
    print_animated_header()
    
    print("\n🔄 Starting comprehensive SEO analysis...")
    time.sleep(1)
    
    data = analyze_seo_metrics()
    display_seo_analysis(data)
    
    print(f"\n🎨 Analysis completed at {datetime.now().strftime('%H:%M:%S')}")
    print(f"🌐 Analyzed: https://www.europeansummercamps.com")

if __name__ == "__main__":
    main()