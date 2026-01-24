import React, { useState, useEffect, useRef, useMemo } from 'react'
// import { useVirtualizer } from '@tanstack/react-virtual' // Prepared for virtual scrolling implementation
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import emailjs from '@emailjs/browser'

// Google Analytics 4 Configuration - Enterprise Implementation
const GA_MEASUREMENT_ID = 'G-3FMMGNJRLE'

// Initialize Google Analytics 4
const initializeGA4 = () => {
  // Load Google Analytics gtag script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize gtag function and configure GA4
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    // Enterprise configuration for summer camp discovery platform
    page_title: 'Camp Explorer Europe 2026',
    custom_map: {
      custom_parameter_1: 'camp_category',
      custom_parameter_2: 'country_filter'
    },
    // Enhanced e-commerce preparation for future monetization
    send_page_view: true,
    // Privacy-compliant configuration
    anonymize_ip: true,
    respect_dnt: true
  })

  // Track initial page view
  gtag('event', 'page_view', {
    page_title: 'Camp Explorer Europe 2026 - European Summer Camps Discovery',
    page_location: window.location.href,
    custom_parameter_1: 'homepage'
  })
}
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb.jsx'
import { MapPin, Calendar, Users, Star, Search, Menu, X, Filter, ChevronDown, Globe, Award, Shield, Heart, ArrowUp } from 'lucide-react'
import heroImage from './assets/european-summer-camps-lakeside-hero.png'
import heroLakesideAvif from './assets/hero-lakeside.avif'
import heroLakesideWebp from './assets/hero-lakeside.webp'
import heroLakesideCompressed from './assets/hero-lakeside-compressed.png'
import activitiesAvif from './assets/activities-collage.avif'
import activitiesWebp from './assets/activities-collage.webp'
import activitiesCompressed from './assets/activities-collage-compressed.png'
import mapCompressed from './assets/camps-map-compressed.png'
import './App.css'

// UTM Parameter Helper for Partner Analytics
const buildOutboundUrl = (baseUrl, camp) => {
  try {
    const url = new URL(baseUrl)
    url.searchParams.set('utm_source', 'europeansummercamps')
    url.searchParams.set('utm_medium', 'directory')
    url.searchParams.set('utm_campaign', camp.featured ? 'featured' : 'standard')
    url.searchParams.set('utm_content', camp.name.toLowerCase().replace(/\s+/g, '-'))
    return url.toString()
  } catch {
    // If URL parsing fails, return original
    return baseUrl
  }
}

// GA4 Outbound Click Tracking - All camps for business intelligence
const trackOutboundClick = (camp) => {
  if (window.gtag) {
    window.gtag('event', 'camp_booking_click', {
      camp_name: camp.name,
      camp_id: camp.id,
      camp_category: camp.category,
      camp_country: camp.country,
      is_featured: camp.featured || false,
      destination_url: camp.bookingUrl
    })
  }
}

// Handle outbound booking clicks with tracking
const handleBookingClick = (camp) => {
  trackOutboundClick(camp)
  const trackedUrl = buildOutboundUrl(camp.bookingUrl, camp)
  window.open(trackedUrl, '_blank')
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [_showFilters, _setShowFilters] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedCamps, setSelectedCamps] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [resourceSection, setResourceSection] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)

  // Contact Form State Management
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Smart Email Routing Based on Inquiry Type
  const getEmailRouting = (inquiryType) => {
    const routingMap = {
      'partnership': 'partnerships@europeansummercamps.com',
      'media-inquiry': 'media@europeansummercamps.com',
      'website-issue': 'info@europeansummercamps.com',
      'general-portal': 'info@europeansummercamps.com',
      'missing-camp': 'contact@europeansummercamps.com',
      'data-correction': 'contact@europeansummercamps.com',
      'other': 'hello@europeansummercamps.com'
    }
    return routingMap[inquiryType] || 'hello@europeansummercamps.com'
  }

  // Handle Contact Form Submission
  const handleContactFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingForm(true)

    const formData = new FormData(e.target)
    const inquiryType = formData.get('subject')
    const recipientEmail = getEmailRouting(inquiryType)

    const templateParams = {
      to_name: 'Camp Explorer Europe Team',
      to_email: recipientEmail,
      from_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
      from_email: formData.get('email'),
      reply_to: formData.get('email'),
      subject: `Contact Form: ${inquiryType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      child_age: formData.get('childAge') || 'Not specified',
      preferred_countries: formData.get('preferredCountries') || 'Not specified',
      message: formData.get('message'),
      inquiry_type: inquiryType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    try {
      // EmailJS sends directly to Cloudflare addresses - no Gmail SMTP needed
      const result = await emailjs.send(
        'service_vnise8u', // EmailJS service ID from dashboard
        'template_lm9wnse', // EmailJS template ID
        templateParams,
        'RLTeapLFs4m6Y18HQ' // EmailJS public key
      )

      console.log('Email sent successfully:', result.text)
      setFormSubmitted(true)
      setTimeout(() => {
        setShowContactForm(false)
        setFormSubmitted(false)
      }, 3000)

    } catch (error) {
      console.error('Email sending failed:', error)
      alert('Sorry, there was an error sending your message. Please try again or contact us directly.')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // GDPR Cookie Consent Management
  const [cookieConsent, setCookieConsent] = useState(null) // null = not decided, true = accepted, false = rejected
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Removed excessive legal disclaimer banner that was scaring users away

  // Mobile-optimized contact form: Proper scroll lock that prevents drift
  useEffect(() => {
    if (showContactForm) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [showContactForm])

  // Enterprise Marquee System - State of the Art
  const heroBadgeRef = useRef(null)

  // Camp directory data compiled from public sources
  const allCamps = [
    // Premium Alpine Experiences
    {
      id: 1,
      featured: true, // Demo featured listing - January 2026
      name: "Les Elfes International",
      location: "Verbier, Switzerland",
      country: "Switzerland",
      ages: "6-17 years",
      price: "From CHF 4,550", // Verified Jan 2026: was CHF 4,990
      priceRange: "premium",
      rating: 4.9,
      reviews: 847,
      image: heroImage,
      category: "premium",
      type: "Alpine Adventure",
      activities: ["Rock Climbing", "5 Languages", "Glacier Expeditions", "Cultural Tours"],
      dates: "June - August 2026", // 6 x 2-week sessions available
      highlights: ["38+ years experience", "10,000+ campers annually", "45+ activities offered", "Swiss Alps at 1,500m"],
      languages: ["English", "French", "German", "Spanish", "Mandarin"],
      specialFeatures: ["On-site Nurse & 24/7 Care", "Traditional Swiss Chalets", "European Travel Awards 2024"],
      established: 1987,
      capacity: 180, // Verbier campus capacity
      bookingUrl: "https://www.leselfes.com/summer-camps/",
      videoUrl: "https://www.youtube.com/watch?v=Z9--hHAq40g"
    },
    {
      id: 2,
      name: "La Garenne International",
      location: "Villars-sur-Ollon, Switzerland",
      country: "Switzerland",
      ages: "6-17 years",
      price: "CHF 6,980",
      priceRange: "luxury",
      rating: 4.9,
      reviews: 423,
      image: activitiesCompressed,
      category: "premium",
      type: "Luxury Boarding",
      activities: ["Academic Enrichment", "Professional Sports", "Cultural Immersion", "Leadership"],
      dates: "June 14-28, 2026",
      highlights: ["Luxury Alpine setting", "50+ nationalities", "Boarding school experience", "Premium facilities"],
      languages: ["English", "French"],
      specialFeatures: ["On-site Health Center", "Age-grouped Programs", "Academic Focus"],
      established: 1947,
      capacity: 80,
      bookingUrl: "https://www.la-garenne.ch/summer-camps"
    },
    {
      id: 3,
      name: "Camp Suisse",
      location: "Torgon, Swiss Alps, Switzerland",
      country: "Switzerland",
      ages: "7-17 years",
      price: "CHF 4,400", // Verified Jan 2026: was CHF 4,000
      priceRange: "premium",
      rating: 4.8,
      reviews: 356,
      image: mapCompressed,
      category: "premium",
      type: "Adventure Sports",
      activities: ["Multi-Sport", "Language Learning", "Leadership Training", "Environmental Ed"],
      dates: "June 21-July 5, 2026",
      highlights: ["40+ countries", "Bilingual environment", "Adventure focus", "Lake Geneva"],
      languages: ["French", "Spanish", "English", "German"],
      specialFeatures: ["Leadership Training", "Environmental Education", "Cultural Excursions"],
      established: 1982,
      capacity: 100,
      bookingUrl: "https://www.campsuisse.com/"
    },
    {
      id: 4,
      name: "Altitude Camps",
      location: "Verbier, Switzerland",
      country: "Switzerland",
      ages: "3-14 years",
      price: "CHF 975",
      priceRange: "mid",
      rating: 4.7,
      reviews: 234,
      image: heroImage,
      category: "family",
      type: "Family Programs",
      activities: ["English Immersion", "Mountain Adventure", "Family Programs", "Marmot Club"],
      dates: "June 30-July 14, 2026",
      highlights: ["Youngest accepted (3 years)", "Family accommodation", "English focus", "Day camps available"],
      languages: ["English", "French"],
      specialFeatures: ["Marmot Program (3-5 years)", "Family Cabins", "Day Camp Options"],
      established: 2008,
      capacity: 60,
      bookingUrl: "https://www.altitude-camps.com/"
    },
    // Academic & STEM Programs
    {
      id: 5,
      name: "Oxford Summer Courses",
      location: "Oxford, England",
      country: "United Kingdom",
      ages: "13-18 years",
      price: "From £6,995", // Verified Jan 2026: was £6,220, tiered pricing Plus/Superior/Premier
      priceRange: "luxury",
      rating: 4.9,
      reviews: 567,
      image: activitiesCompressed,
      category: "academic",
      type: "University Prep",
      activities: ["Medicine", "Engineering", "Business", "Creative Arts"],
      dates: "July 6-20, 2026 (2 weeks)",
      highlights: ["Oxford University colleges", "University preparation", "3 pricing tiers available", "Historic setting"],
      languages: ["English"],
      specialFeatures: ["College Accommodation", "University Application Guidance", "Airport Transfers Included"],
      established: 1985,
      capacity: 200,
      bookingUrl: "https://www.oxfordsummercourses.com/"
    },
    {
      id: 6,
      name: "Bede's Summer School",
      location: "East Sussex, England",
      country: "United Kingdom",
      ages: "6-20 years",
      price: "From £3,190", // Verified Jan 2026: was £1,575 (weekly rate), 2-week program £3,190-£4,490
      priceRange: "mid",
      rating: 4.8,
      reviews: 892,
      image: mapCompressed,
      category: "family",
      type: "Comprehensive Education",
      activities: ["English Classes", "Sports Specialties", "Arts & Crafts", "Cultural Excursions"],
      dates: "July 13-27, 2026 (2 weeks)",
      highlights: ["1,700+ students annually", "62 countries", "6 campus locations", "Multiple program tracks"],
      languages: ["English"],
      specialFeatures: ["Little Explorers (6-11)", "Specialist Tracks", "Airport Transfers Included"],
      established: 1993,
      capacity: 1700,
      bookingUrl: "https://www.bedessummerschool.org/"
    },
    // Language Immersion
    {
      id: 7,
      name: "Enforex Barcelona Beach",
      location: "Castelldefels, Barcelona, Spain",
      country: "Spain",
      ages: "5-14 years", // Verified Jan 2026: was 5-13
      price: "€1,295/week", // Verified Jan 2026: was €3,200 (multi-week total)
      priceRange: "mid",
      rating: 4.7,
      reviews: 445,
      image: heroImage,
      category: "language",
      type: "Spanish Immersion",
      activities: ["Spanish Classes", "Beach Sports", "Cultural Tours", "Water Activities"],
      dates: "June 29 - August 23, 2026",
      highlights: ["Beach location", "80% international campers", "UPC university campus", "1-4 week options"],
      languages: ["Spanish", "English"],
      specialFeatures: ["Beach Activities", "Cultural Exchange", "Full Board Included"],
      established: 1989,
      capacity: 180,
      bookingUrl: "https://www.enforex.com/summercamps/dates-prices.html"
    },
    {
      id: 8,
      name: "Alpine French School Day Camp",
      location: "Morzine, French Alps, France",
      country: "France",
      ages: "6-17 years",
      price: "€810/week", // Verified Jan 2026: Day camp only, was €1,845
      priceRange: "mid",
      rating: 4.6,
      reviews: 178,
      image: activitiesCompressed,
      category: "language",
      type: "Day Camp - French Immersion",
      activities: ["French Classes", "Alpine Hiking", "White Water Rafting", "Mountain Biking"],
      dates: "July 6 - August 14, 2026 (9am-4:30pm)",
      highlights: ["⚠️ DAY CAMP - No accommodation", "French Alps setting", "Parent/guardian must be in area", "Morning classes + afternoon adventures"],
      languages: ["French", "English"],
      specialFeatures: ["Day Program Only", "Family Accommodation Available Separately", "Native French Instructors"],
      established: 2001,
      capacity: 80,
      bookingUrl: "https://alpinefrenchschool.com/useful/junior-dates-and-prices/"
    },
    // Budget Excellence
    {
      id: 9,
      name: "EUROCAM Bohemia",
      location: "South Bohemia, Czech Republic",
      country: "Czech Republic",
      ages: "7-17 years",
      price: "€335",
      priceRange: "budget",
      rating: 4.8,
      reviews: 267,
      image: mapCompressed,
      category: "budget_excellence",
      type: "English Immersion",
      activities: ["English Classes", "River Activities", "Cave Exploration", "Cultural Games"],
      dates: "July 15-25, 2026",
      highlights: ["10-day program", "Bilingual leaders", "30+ years experience", "Exceptional value"],
      languages: ["English", "Czech"],
      specialFeatures: ["Bilingual Approach", "River Setting", "Cultural Immersion"],
      established: 1995,
      capacity: 120,
      bookingUrl: "https://www.euro-camp.eu/"
    },
    {
      id: 10,
      name: "Adventure Camp Bavaria",
      location: "Bayerischer Wald, Germany",
      country: "Germany",
      ages: "9-16 years",
      price: "€445",
      priceRange: "budget",
      rating: 4.6,
      reviews: 189,
      image: heroImage,
      category: "budget_excellence",
      type: "Outdoor Adventure",
      activities: ["Canoeing", "Rock Climbing", "German Culture", "Survival Skills"],
      dates: "July 22-29, 2026",
      highlights: ["Bavarian Forest", "Mountain lake", "German traditions", "Great value"],
      languages: ["German", "English"],
      specialFeatures: ["Traditional Crafts", "Castle Visits", "Folk Culture"],
      established: 2003,
      capacity: 90,
      bookingUrl: "https://www.campadventure.de/en/destinations/germany-adventure-camp-bayerischer-wald"
    },
    // Sports Specialty
    {
      id: 11,
      name: "AC Milan Academy Camp",
      location: "Milan, Italy",
      country: "Italy",
      ages: "8-16 years",
      price: "€1,440",
      priceRange: "mid",
      rating: 4.9,
      reviews: 312,
      image: activitiesCompressed,
      category: "sports",
      type: "Football Academy",
      activities: ["Professional Coaching", "Stadium Tours", "Technical Training", "Cultural Activities"],
      dates: "August 5-12, 2026",
      highlights: ["AC Milan coaches", "San Siro stadium", "Professional training", "Cultural immersion"],
      languages: ["English", "Italian"],
      specialFeatures: ["Professional Coaching", "Stadium Access", "Player Meetings"],
      established: 2010,
      capacity: 60,
      bookingUrl: "https://www.milancamp.com/en-us/"
    },
    // Unique Programs
    {
      id: 12,
      name: "Wildwind Youth Sailing Club",
      location: "Vassiliki, Greece",
      country: "Greece",
      ages: "7-17 years",
      price: "From £845", // Family package price - youth sailing included with parent holiday
      priceRange: "luxury",
      rating: 4.8,
      reviews: 89,
      image: mapCompressed,
      category: "family",
      type: "Family Sailing Resort",
      activities: ["Dinghy Sailing", "Catamaran Sailing", "Windsurfing", "SUP", "Beach Activities"],
      dates: "May-October 2026 (Mon-Fri sessions)",
      highlights: ["⚠️ FAMILY RESORT - Parents must book holiday", "Youth sailing while parents sail", "RYA-certified instructors", "Splash Club (beginners) & Youth Squad (intermediate)"],
      languages: ["English"],
      specialFeatures: ["Parents Required On-Site", "Kids Club 10am-5pm Daily", "Family Package Only"],
      established: 1987,
      capacity: 40,
      bookingUrl: "https://wildwind.co.uk/youth-sailing-holidays"
    },
    // REMOVED Jan 2026: ID 13 Camp Adventure - Not a summer camp (adventure park/attraction)
    {
      id: 14,
      name: "Adventure Treks Norway Expedition",
      location: "Nordfjord & Jotunheimen, Norway",
      country: "Norway",
      ages: "16-18 years",
      price: "$7,095", // Verified Jan 2026: was $7,295
      priceRange: "luxury",
      rating: 4.9,
      reviews: 134,
      image: heroImage,
      category: "unique",
      type: "Adventure Expedition",
      activities: ["Sea Kayaking", "Summit Hiking", "Via Ferrata", "Cultural Immersion"],
      dates: "June 29-July 14 & July 18-August 2, 2026",
      highlights: ["Galdhøpiggen summit", "16-day expedition", "High fitness required", "Viking history"],
      languages: ["English", "Norwegian"],
      specialFeatures: ["Norway's Highest Peak", "Advanced Outdoor Skills", "Cultural Experiences"],
      established: 2008,
      capacity: 16,
      bookingUrl: "https://www.adventuretreks.com/trip/norway/"
    },
    {
      id: 15,
      name: "Camp Bjøntegaard",
      location: "Rendalen, Norway",
      country: "Norway",
      ages: "12-18 years",
      price: "NOK 5,890",
      priceRange: "mid",
      rating: 4.9,
      reviews: 127,
      image: mapCompressed,
      category: "sports",
      type: "Olympic Sports Heritage",
      activities: ["Cross-Country Skiing", "Biathlon Training", "Nordic Walking", "Mountain Hiking"],
      dates: "July 12-26, 2026",
      highlights: ["1994 Olympic venues", "Professional Nordic coaches", "Fjord excursions", "Cultural immersion"],
      languages: ["Norwegian", "English", "Danish"],
      specialFeatures: ["Olympic Training Facilities", "Fjord Adventures", "Viking History Programs"],
      established: 1994,
      capacity: 45,
      bookingUrl: "http://sommerleir.no/"
    },
    // REMOVED Jan 2026: ID 16 Metsäkartano - Group/school bookings only, not individual family registration
    {
      id: 17,
      name: "Bold Earth Adventures - Iceland: Fire and Ice",
      location: "Reykjavik & Highlands, Iceland",
      country: "Iceland",
      ages: "14-18 years",
      price: "$5,988", // Verified Jan 2026: was €4,800, expedition camp (camping 11 nights + hostels 2 nights)
      priceRange: "luxury",
      rating: 4.8,
      reviews: 73,
      image: heroImage,
      category: "unique",
      type: "Expedition Adventure Camp",
      activities: ["Glacier Hiking", "Volcano Studies", "Geothermal Science", "Kayaking"],
      dates: "July 20-August 3, 2026 (14 days)",
      highlights: ["Expedition-style camping", "45+ years experience", "13 students + 2 leaders", "ACA-listed program"],
      languages: ["English"],
      specialFeatures: ["Tent Camping Provided", "No Fixed Facility - Traveling Program", "Wilderness First Aid Certified Leaders"],
      established: 1976,
      capacity: 13,
      bookingUrl: "https://www.boldearth.com/"
    },
    {
      id: 18,
      name: "Nordic Terrain Academy Day Camp",
      location: "Stavanger, Norway",
      country: "Norway",
      ages: "6-12 years",
      price: "NOK 5,700", // Verified Jan 2026: was NOK 3,500, DAY CAMP (8:30-15:30)
      priceRange: "mid",
      rating: 4.6,
      reviews: 87,
      image: activitiesCompressed,
      category: "academic",
      type: "Day Camp - Adventure Academics",
      activities: ["Kayaking", "Rock Climbing", "Hiking", "Surfing", "STEM Learning"],
      dates: "July 7-11 & July 14-18, 2026 (8:30-15:30 daily)",
      highlights: ["DAY CAMP - No overnight stay", "Academics meets adventure", "Lunch included", "International environment"],
      languages: ["Norwegian", "English"],
      specialFeatures: ["Day Program Only", "Daily Lunch Included", "Academic & Adventure Balance"],
      established: 2020,
      capacity: 15,
      bookingUrl: "https://nordicadventure.camp/stavanger/"
    },
    {
      id: 20,
      name: "Ranum Efterskole International Summer School",
      location: "Ranum, Denmark",
      country: "Denmark",
      ages: "14-17 years", // Verified Jan 2026: was 15-18
      price: "From DKK 5,995/week", // Verified Jan 2026: 1-5 week options (DKK 5,995-23,760)
      priceRange: "mid",
      rating: 4.7,
      reviews: 89,
      image: activitiesCompressed,
      category: "academic",
      type: "International School",
      activities: ["Danish Language", "Sports", "Arts", "Outdoor Activities", "Cultural Excursions"],
      dates: "July 5 - August 5, 2026",
      highlights: ["Authentic efterskole experience", "1-5 week flexible duration", "40+ countries represented", "Weekly excursions included"],
      languages: ["Danish", "English"],
      specialFeatures: ["Modular Subject Selection", "All-Inclusive Meals", "Airport Transport Included"],
      established: 1994,
      capacity: 45,
      bookingUrl: "https://www.ranumefterskole.dk/en/international-sommercamp/"
    },
    {
      id: 21,
      name: "Summer Camp Finland International",
      location: "Hyvinkää, Finland",
      country: "Finland",
      ages: "8-17 years",
      price: "From €180/day", // Verified Jan 2026: flexible 1-30 day programs, residential lakeside campsite
      priceRange: "mid",
      rating: 4.7,
      reviews: 142,
      image: activitiesCompressed,
      category: "academic",
      type: "International Adventure",
      activities: ["English Learning", "Cultural Exchange", "Sports", "Hiking", "Arts & Crafts"],
      dates: "July 14 - August 15, 2026",
      highlights: ["Residential lakeside campsite", "Flexible 1-30 day programs", "Shared twin rooms with bathrooms", "5 meals daily included"],
      languages: ["English", "Finnish"],
      specialFeatures: ["Customizable Duration", "24-Hour Supervision", "9 Hours Daily Activities"],
      established: 2015,
      capacity: 80,
      bookingUrl: "https://summercamp.fi/"
    },
    // REMOVED Jan 2026: ID 22 Piispala - Group bookings only (minimum 8 participants required)
    {
      id: 23,
      name: "Myhre Gård Riding Camp",
      location: "Beitostølen, Norway",
      country: "Norway",
      ages: "7-18 years",
      price: "NOK 6,950",
      priceRange: "premium",
      rating: 4.8,
      reviews: 89,
      image: activitiesCompressed,
      category: "sports",
      type: "Equestrian Sports",
      activities: ["Horse Riding", "Trail Rides", "Jumping", "Stable Care", "Mountain Hiking"],
      dates: "June 21-26 & June 28-July 3, 2026",
      highlights: ["17+ years experience", "Professional riding instruction", "Mountain location", "Field trips included"],
      languages: ["Norwegian", "English"],
      specialFeatures: ["9 Riding Sessions", "Competition Training", "Theory Lessons", "Mountain Trail Access"],
      established: 2007,
      capacity: 24,
      bookingUrl: "https://www.myhregard.com/riding-camp-norway/"
    },
    // Geographic Expansion - Budget Excellence
    {
      id: 24,
      name: "Warsaw Montessori Family Camp",
      location: "Bialka, Lublin Voivodeship",
      country: "Poland",
      ages: "6-16 years",
      price: "€640/week", // Verified Jan 2026: was €1,260 (2-week total), actual PLN 2,700/week
      priceRange: "budget",
      rating: 4.7,
      reviews: 85,
      image: mapCompressed,
      category: "budget_excellence",
      type: "Educational Farm Camp",
      activities: ["Farm Work", "Kayaking", "Swimming", "Survival Skills", "Arts & Crafts", "Cooking"],
      dates: "June 28 - August 8, 2026",
      highlights: ["Montessori philosophy", "Working farm experience", "Qualified teacher supervision", "30+ years education experience"],
      languages: ["English", "Polish"],
      specialFeatures: ["Animal Care", "Agricultural Activities", "Small Group Sizes", "24-hour Supervision"],
      established: null,
      capacity: 60,
      bookingUrl: "https://wmf.edu.pl/en/our-summer-camps-2025/"
    },
    {
      id: 25,
      name: "My Camp at Quinta da Broeira",
      location: "Cartaxo, Ribatejo",
      country: "Portugal",
      ages: "6-17 years",
      price: "€570/week", // Verified Jan 2026: was €1,140 (2-week total), actual €570/week
      priceRange: "budget",
      rating: 4.7,
      reviews: 95,
      image: heroImage,
      category: "budget_excellence",
      type: "Adventure Camp",
      activities: ["Swimming", "High Ropes", "Climbing", "Horse Riding", "Kayaking", "Water Sports"],
      dates: "June 23 - September 7, 2026",
      highlights: ["30+ years experience", "10-hectare adventure facility", "100+ activities", "Close to Lisbon"],
      languages: ["Portuguese", "English", "Spanish"],
      specialFeatures: ["2 Swimming Pools", "Climbing Tower", "Horse Facilities", "Full Board Included"],
      established: 1992,
      capacity: 450,
      bookingUrl: "https://www.mycamp.pt/"
    },
    // Geographic Expansion - Family Programs
    {
      id: 26,
      name: "Nationalpark Kalkalpen Family Camp",
      location: "Rossleithen, Upper Austria",
      country: "Austria",
      ages: "6+ years (families)",
      price: "From €145", // Verified Jan 2026: €145 child/€369 adult, 3-day program
      priceRange: "budget",
      rating: 4.6,
      reviews: 72,
      image: activitiesCompressed,
      category: "family",
      type: "Wilderness Family Camp",
      activities: ["Wilderness Survival", "Wildlife Tracking", "Campfire Cooking", "Night Adventures", "Nature Crafts", "Team Building"],
      dates: "August 14-16, 2026",
      highlights: ["National Park Ranger-led", "True wilderness immersion", "Multi-generational bonding", "Digital detox experience"],
      languages: ["German", "English", "Czech"],
      specialFeatures: ["Government National Park", "Dormitory Cabins", "Communal Cooking", "Alpine Setting 940m"],
      established: null,
      capacity: 33,
      bookingUrl: "https://en.kalkalpen.at/veranstaltung/familiencamp-abenteuer-wildnis"
    },
    // Budget Excellence Expansion - Austria
    {
      id: 27,
      name: "Auersperg-International Summer Camp",
      location: "Wildschönau, Tyrol",
      country: "Austria",
      ages: "8-15 years",
      price: "From €1,377/week", // Verified Jan 2026: 1-week €1,377, 2-week €2,940
      priceRange: "budget",
      rating: 4.7,
      reviews: 156,
      image: heroImage,
      category: "budget_excellence",
      type: "Alpine Language Camp",
      activities: ["Hiking", "German Language", "English Language", "Nature Exploration", "Alpine Adventures", "Cultural Activities"],
      dates: "June 29 - July 11, 2026 (1 or 2 week options)",
      highlights: ["Family-run since 2005", "Traditional Tyrolean farmhouse", "Bilingual instruction", "Early bird discount available"],
      languages: ["German", "English"],
      specialFeatures: ["Intimate family atmosphere", "Owners present at all times", "Alpine mountain setting"],
      established: 2005,
      capacity: 30,
      bookingUrl: "https://www.auersperg-summercamp.at/"
    },
    // Language Immersion Expansion - Poland
    {
      id: 28,
      name: "Jagiellonian University Explorers' Summer Camp",
      location: "Kraków, Lesser Poland",
      country: "Poland",
      ages: "12-16 years",
      price: "PLN 7,730",
      priceRange: "budget",
      rating: 4.8,
      reviews: 203,
      image: activitiesCompressed,
      category: "language",
      type: "Academic Language Immersion",
      activities: ["Polish Language Classes", "Museum Visits", "City Tours", "Dance Workshops", "Art Workshops", "Culinary Workshops", "Castle Excursions", "Wieliczka Salt Mine"],
      dates: "July 19 - August 1, 2026",
      highlights: ["Prestigious Jagiellonian University (founded 1364)", "30 hours intensive Polish instruction", "University dormitory accommodation", "Full board included"],
      languages: ["Polish", "English"],
      specialFeatures: ["Historic university setting", "Deep cultural immersion", "Southern Poland excursions"],
      established: 1364,
      capacity: 40,
      bookingUrl: "https://plschool.uj.edu.pl/en_GB/wakacyjny-kurs-jezyka-polskiego-dla-mlodziezy-online"
    },
    // Outdoor Adventures Expansion - Portugal
    {
      id: 29,
      name: "Village Camps Santa Cruz",
      location: "Santa Cruz, West Coast",
      country: "Portugal",
      ages: "10-17 years", // Verified Jan 2026: was 13-17
      price: "€3,500/week", // Verified Jan 2026: was €2,700
      priceRange: "mid",
      rating: 4.8,
      reviews: 412,
      image: mapCompressed,
      category: "sports",
      type: "Adventure & Surf Camp",
      activities: ["Expert Surf Instruction", "Mountain Biking", "Coastal Hiking", "Beach Olympics", "Dolphin Watching", "Cultural Excursions"],
      dates: "July 5-18, July 19-Aug 1, Aug 2-15, 2026",
      highlights: ["50+ years camp experience (since 1972)", "Atlantic coast location", "Modern exclusive residence", "World-class surf waves"],
      languages: ["English"],
      specialFeatures: ["Education Through Recreation™ philosophy", "International camp environment", "English + Adventure or Surf tracks"],
      established: 1972,
      capacity: 80,
      bookingUrl: "https://www.villagecamps.com/summer-camp-programmes-in-santa-cruz-portugal"
    },
    // NEW CAMPS ADDED January 2026 - Geographic Expansion
    // Hungary - NEW COUNTRY
    {
      id: 30,
      name: "Funside Balaton International Camp",
      location: "Balatongyörök, Lake Balaton",
      country: "Hungary",
      ages: "8-17 years",
      price: "€625/week", // Verified Jan 2026
      priceRange: "budget",
      rating: 4.8,
      reviews: 234,
      image: heroImage,
      category: "language",
      type: "Bilingual Adventure Camp",
      activities: ["English Classes", "Sailing", "Windsurfing", "Tennis", "Adventure Parks"],
      dates: "Summer 2026 (registration opens Feb 18, 2026)",
      highlights: ["18 years operating experience", "25-30 countries represented", "5:1 staff ratio", "Lake Balaton setting"],
      languages: ["English", "Hungarian"],
      specialFeatures: ["Bilingual English-Hungarian", "30+ Activities Available", "24/7 Medical Staff"],
      established: 2007,
      capacity: 120,
      bookingUrl: "https://funside.hu/en/pricing-balaton/"
    },
    // Romania - NEW COUNTRY
    {
      id: 31,
      name: "Camp Semenic Explorer",
      location: "Semenic-Caras Gorge National Park, Caras-Severin",
      country: "Romania",
      ages: "8-14 years",
      price: "$650", // Verified Jan 2026: 6-day program
      priceRange: "budget",
      rating: 4.7,
      reviews: 45,
      image: mapCompressed,
      category: "unique",
      type: "Wilderness Adventure Camp",
      activities: ["Hiking", "Archery", "Ziplining", "Mountain Biking", "Survival Skills"],
      dates: "July 3-8, 2026",
      highlights: ["UNESCO-protected National Park", "700m zipline experience", "1,400m mountain elevation", "Bilingual environment"],
      languages: ["Romanian", "English"],
      specialFeatures: ["Carpathian Mountain Setting", "Nature Education Focus", "Small Group Experience"],
      established: 2020,
      capacity: 24,
      bookingUrl: "https://www.romanianunitedfund.org/semenic_explorer25"
    },
    // Slovenia - NEW COUNTRY
    {
      id: 32,
      name: "Explorer International Kids' Camps",
      location: "Velenje, Slovenia",
      country: "Slovenia",
      ages: "6-17 years",
      price: "€845/week", // Verified Jan 2026
      priceRange: "mid",
      rating: 4.9,
      reviews: 312,
      image: activitiesCompressed,
      category: "unique",
      type: "Tech-Free Adventure Camp",
      activities: ["White Water Rafting", "Rock Climbing", "Kayaking", "Canyoning", "Mountain Biking"],
      dates: "Summer 2026 (multiple sessions)",
      highlights: ["Technology-free camp", "12+ hours daily in nature", "40+ nationalities", "4:1 staff ratio for young campers"],
      languages: ["English"],
      specialFeatures: ["90% Outdoor Time", "Lake Velenje Setting", "Age-Specific Programs"],
      established: 2015,
      capacity: 80,
      bookingUrl: "https://www.explorercamps.com/dates-and-prices/"
    },
    // Scotland (Highlands) - NEW REGION
    {
      id: 33,
      name: "Ridgway Adventure",
      location: "Ardmore, Sutherland, Scottish Highlands",
      country: "United Kingdom",
      ages: "11-17 years",
      price: "£950/week", // Verified Jan 2026
      priceRange: "mid",
      rating: 4.9,
      reviews: 178,
      image: heroImage,
      category: "unique",
      type: "Wilderness Expedition Camp",
      activities: ["Sea Kayaking", "Mountain Expeditions", "Rock Climbing", "Wild Camping", "Survival Skills"],
      dates: "Summer 2026 (1 & 2 week sessions)",
      highlights: ["Remote Scottish Highlands", "Cape Wrath expeditions", "50-year family heritage", "Duke of Edinburgh Award qualifying"],
      languages: ["English"],
      specialFeatures: ["Expedition-Style Programs", "Uninhabited Island Adventures", "Maximum 36 Participants"],
      established: 1969,
      capacity: 36,
      bookingUrl: "https://www.ridgway-adventure.co.uk/summer-camps/"
    },
    // Croatia - NEW COUNTRY
    {
      id: 34,
      name: "Camp California Croatia",
      location: "Pakostane, Dalmatia",
      country: "Croatia",
      ages: "7-16 years",
      price: "€1,095/week", // Verified Jan 2026
      priceRange: "mid",
      rating: 4.8,
      reviews: 456,
      image: mapCompressed,
      category: "unique",
      type: "American-Style Adventure Camp",
      activities: ["Sea Kayaking", "Rock Climbing", "Mountain Biking", "Snorkeling", "Challenge Course"],
      dates: "June-August 2026 (weekly sessions)",
      highlights: ["Europe's first American-style camp", "14,000+ alumni since 2003", "Adriatic coast location", "40+ countries represented"],
      languages: ["English"],
      specialFeatures: ["Bamboo Cabin Village", "Teen Adventure Expeditions", "Near Kornati National Park"],
      established: 2003,
      capacity: 120,
      bookingUrl: "https://campcalifornia.com/dates-prices/"
    },
    // UK (Devon) - Family Program Expansion
    {
      id: 35,
      name: "PGL Family Adventures Barton Hall",
      location: "Torquay, Devon",
      country: "United Kingdom",
      ages: "5-18 years",
      price: "From £139/person", // Verified Jan 2026: 2-4 night breaks
      priceRange: "budget",
      rating: 4.7,
      reviews: 523,
      image: activitiesCompressed,
      category: "family",
      type: "Family Adventure Resort",
      activities: ["Zip-wiring", "Abseiling", "Climbing", "Archery", "Canoeing", "Giant Swing"],
      dates: "Year-round (2-4 night breaks)",
      highlights: ["Parents and children together", "Under 5s stay FREE", "20+ on-site activities", "Heated outdoor pool"],
      languages: ["English"],
      specialFeatures: ["All-Inclusive Meals", "Evening Kids Club", "En-Suite Family Rooms"],
      established: 1957,
      capacity: 200,
      bookingUrl: "https://www.pgl.co.uk/en-gb/family-adventures/holidays"
    },
    // Ireland - NEW COUNTRY
    {
      id: 36,
      name: "Carlingford Adventure Centre",
      location: "Carlingford, County Louth",
      country: "Ireland",
      ages: "6-17 years",
      price: "From €240/person", // Verified Jan 2026: 3-5 day residential
      priceRange: "budget",
      rating: 4.8,
      reviews: 289,
      image: mapCompressed,
      category: "family",
      type: "Family Adventure Centre",
      activities: ["Kayaking", "Rock Climbing", "High Ropes", "Laser Combat", "Archery", "SUP"],
      dates: "Year-round (3-5 day programs)",
      highlights: ["30+ purpose-built activities", "Family residential programs", "Shore-side location", "3 or 5 day options"],
      languages: ["English"],
      specialFeatures: ["En-Suite Family Rooms", "Full Board Included", "24-Hour Reception"],
      established: 1998,
      capacity: 90,
      bookingUrl: "https://carlingfordadventure.com/book-now/"
    },
    // Sweden - NEW COUNTRY (January 2026)
    {
      id: 37,
      name: "Filmkollo",
      location: "Trollhättan, Västra Götaland",
      country: "Sweden",
      ages: "10-17 years",
      price: "SEK 7,600/week", // Verified Jan 2026
      priceRange: "mid",
      rating: 4.8,
      reviews: 156,
      image: heroImage,
      category: "academic",
      type: "Film Production Camp",
      activities: ["Film Production", "Screenwriting", "Special Effects Makeup", "Acting", "Voice Dubbing", "Night Filming"],
      dates: "Weeks 25-33: June 14 - August 15, 2026",
      highlights: ["Professional film studio (iFocus)", "Create your own film", "Film premiere with family streaming", "15+ years experience"],
      languages: ["Swedish", "English"],
      specialFeatures: ["3000 sqm Professional Studio", "All Equipment Provided", "No Experience Required"],
      established: 2010,
      capacity: 120,
      bookingUrl: "https://filmkollo.se/anmalan-2026/"
    },
    {
      id: 38,
      name: "Wild Camp Beckershof",
      location: "Katrineholm, Södermanland",
      country: "Sweden",
      ages: "10-16 years",
      price: "From SEK 10,900/week", // Verified Jan 2026
      priceRange: "mid",
      rating: 4.7,
      reviews: 198,
      image: activitiesCompressed,
      category: "unique",
      type: "Adventure Camp",
      activities: ["High Ropes", "Sailing", "Climbing Wall", "Archery", "Zipline", "Paintball", "Go-Kart"],
      dates: "Weeks 25-28: June 14 - July 12, 2026",
      highlights: ["Historic manor house setting", "17 years operating", "Leadership program for ages 14-16", "90 min from Stockholm"],
      languages: ["Swedish", "English"],
      specialFeatures: ["On-Site Chef", "Adventure Obstacle Course", "Leadership Development Track"],
      established: 2008,
      capacity: 80,
      bookingUrl: "https://www.wildcamp.se/"
    },
    // Denmark - Additional camps (January 2026)
    {
      id: 39,
      name: "Din Camp SportsCamp",
      location: "Kolding & Juelsminde, Jutland",
      country: "Denmark",
      ages: "7-15 years",
      price: "DKK 3,695", // Verified Jan 2026
      priceRange: "budget",
      rating: 4.7,
      reviews: 103,
      image: mapCompressed,
      category: "sports",
      type: "Multi-Sport Camp",
      activities: ["Dance", "Trampoline", "Football", "Water Sports", "Kayaking", "SUP"],
      dates: "Week 27: June 29 - July 4 & Week 31: July 27 - Aug 1, 2026",
      highlights: ["Authentic Danish efterskole experience", "14+ years operating", "94% 5-star Trustpilot reviews", "6 meals daily included"],
      languages: ["Danish", "English"],
      specialFeatures: ["Boarding School Dormitories", "REMA 1000 Partnership", "Multiple Sport Tracks"],
      established: 2010,
      capacity: 100,
      bookingUrl: "https://tilmelding.dincamp.dk/tilmelding"
    },
    {
      id: 40,
      name: "Nordisk Sommerlejr",
      location: "Hillerød, North Zealand",
      country: "Denmark",
      ages: "11-15 years",
      price: "DKK 3,000", // Verified Jan 2026 (DKK 2,500 for members)
      priceRange: "budget",
      rating: 4.6,
      reviews: 67,
      image: heroImage,
      category: "language",
      type: "Nordic Cultural Exchange Camp",
      activities: ["Nordic Languages", "Climbing", "Horseback Riding", "Archery", "Tivoli Visit", "Cultural Activities"],
      dates: "June 29 - July 3, 2026",
      highlights: ["Only Nordic cultural exchange camp", "Learn Swedish/Norwegian/Finnish", "Tivoli Gardens excursion", "Make Nordic friends"],
      languages: ["Danish", "Swedish", "Norwegian", "Finnish", "English"],
      specialFeatures: ["5 Nordic Languages", "Foreningen Norden NGO", "International Nordic Community"],
      established: 1990,
      capacity: 50,
      bookingUrl: "https://foreningen-norden.dk/aktiviteter/nordisk-sommerlejr-for-boern/"
    }
  ]

  // Multilingual search support for major European languages
  const getMultilingualSearchTerms = (term) => {
    const lowerTerm = term.toLowerCase()
    const translations = {
      // Country names in local languages
      'danmark': 'denmark',
      'norge': 'norway',
      'noreg': 'norway',
      'schweiz': 'switzerland',
      'suisse': 'switzerland',
      'svizzera': 'switzerland',
      'österreich': 'austria',
      'autriche': 'austria',
      'deutschland': 'germany',
      'allemagne': 'germany',
      'germania': 'germany',
      'frankreich': 'france',
      'francia': 'france',
      'spanien': 'spain',
      'espagne': 'spain',
      'spagna': 'spain',
      'italien': 'italy',
      'italie': 'italy',
      'niederlande': 'netherlands',
      'pays-bas': 'netherlands',
      'paesi bassi': 'netherlands',
      'schweden': 'sweden',
      'suède': 'sweden',
      'svezia': 'sweden',
      'finnland': 'finland',
      'finlande': 'finland',
      'finlandia': 'finland',
      'island': 'iceland',
      'islande': 'iceland',
      'islanda': 'iceland',
      // Swedish additions
      'sverige': 'sweden',
      'sommar': 'summer',
      'sommarläger': 'summer camp',
      'kollo': 'camp',
      'läger': 'camp',
      // Common search terms
      'sommer': 'summer',
      'été': 'summer',
      'verano': 'summer',
      'estate': 'summer',
      'lager': 'camp',
      'camp': 'camp',
      'campo': 'camp'
    }

    // Return both original term and translated terms
    const searchTerms = [lowerTerm]
    if (translations[lowerTerm]) {
      searchTerms.push(translations[lowerTerm])
    }

    // Also check if any translation maps TO the current term
    Object.entries(translations).forEach(([foreign, english]) => {
      if (english === lowerTerm) {
        searchTerms.push(foreign)
      }
    })

    return searchTerms
  }

  // Bleeding-edge performance optimization with useMemo
  const filteredCamps = useMemo(() => {
    return allCamps.filter(camp => {
      const matchesFilter = selectedFilter === 'all' || camp.category === selectedFilter
      const matchesCountry = selectedCountry === 'all' || camp.country === selectedCountry

      // Enhanced multilingual search
      if (!searchTerm) {
        return matchesFilter && matchesCountry
      }

      const searchTerms = getMultilingualSearchTerms(searchTerm)
      const matchesSearch = searchTerms.some(term =>
        camp.name.toLowerCase().includes(term) ||
        camp.location.toLowerCase().includes(term) ||
        camp.country.toLowerCase().includes(term)
      )

      return matchesFilter && matchesCountry && matchesSearch
    })
  }, [allCamps, selectedFilter, selectedCountry, searchTerm])

  const filterOptions = [
    { value: 'all', label: 'All Camps', count: allCamps.length },
    { value: 'premium', label: 'Premium Alpine', count: allCamps.filter(c => c.category === 'premium').length },
    { value: 'academic', label: 'Academic & STEM', count: allCamps.filter(c => c.category === 'academic').length },
    { value: 'language', label: 'Language Immersion', count: allCamps.filter(c => c.category === 'language').length },
    { value: 'sports', label: 'Sports Specialty', count: allCamps.filter(c => c.category === 'sports').length },
    { value: 'family', label: 'Family Programs', count: allCamps.filter(c => c.category === 'family').length },
    { value: 'budget_excellence', label: 'Budget Excellence', count: allCamps.filter(c => c.category === 'budget_excellence').length },
    { value: 'unique', label: 'Unique Experiences', count: allCamps.filter(c => c.category === 'unique').length }
  ]

  const stats = [
    { icon: Globe, label: "Countries", value: "21", description: "Across Europe" },
    { icon: Award, label: "Organizations", value: "36", description: "100+ verified camps" },
    { icon: Users, label: "Ages", value: "3-24", description: "Years covered" },
    { icon: Shield, label: "Directory", value: "100%", description: "Researched" }
  ]

  // Breadcrumb generation function
  const generateBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Home', href: '#home', current: false }]

    switch (activeSection) {
      case 'home':
        breadcrumbs[0].current = true
        break
      case 'discover':
        breadcrumbs.push({ name: 'Discover Camps', href: '#discover', current: true })
        break
      case 'compare':
        breadcrumbs.push({ name: 'Compare', href: '#compare', current: true })
        break
      case 'plan':
        breadcrumbs.push({ name: 'Plan Your Summer', href: '#plan', current: true })
        break
      case 'guide':
        breadcrumbs.push({ name: 'Guide', href: '#guide', current: true })
        break
      case 'about':
        breadcrumbs.push({ name: 'About', href: '#about', current: true })
        break
      case 'privacy':
        breadcrumbs.push({ name: 'Privacy', href: '#privacy', current: true })
        break
      default:
        breadcrumbs[0].current = true
    }

    return breadcrumbs
  }

  // Navigation handlers
  const handleNavigation = (section) => {
    setActiveSection(section)
    window.location.hash = section
    // Delay scroll to allow React to render the new section content first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  const handleCampSelection = (camp) => {
    const isSelected = selectedCamps.find(c => c.id === camp.id)
    if (isSelected) {
      setSelectedCamps(selectedCamps.filter(c => c.id !== camp.id))
    } else if (selectedCamps.length < 3) {
      setSelectedCamps([...selectedCamps, camp])
    }
  }

  // Footer navigation handlers
  const handleCountryFilter = (country) => {
    setSelectedCountry(country)
    setSelectedFilter('all') // Reset category filter when filtering by country
    setSearchTerm('') // Reset search
    setActiveSection('discover')
    window.location.hash = 'discover'
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryFilter = (category) => {
    setSelectedFilter(category)
    // Always reset country filter when filtering by category (including 'all')
    setSelectedCountry('all') 
    setSearchTerm('') // Reset search
    setActiveSection('discover')
    window.location.hash = 'discover'
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResourceLink = (resource) => {
    switch(resource) {
      case 'guide':
        setActiveSection('guide')
        window.location.hash = 'guide'
        break
      case 'compare':
        setActiveSection('compare')
        window.location.hash = 'compare'
        break
      case 'plan':
        setActiveSection('plan')
        window.location.hash = 'plan'
        break
      case 'impressum':
        setActiveSection('impressum')
        window.location.hash = 'impressum'
        // Scroll to impressum content after section loads
        setTimeout(() => {
          const element = document.getElementById('impressum-content')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        return // Don't execute the general scroll below
      case 'terms':
        setActiveSection('terms')
        window.location.hash = 'terms'
        // Scroll to terms content after section loads
        setTimeout(() => {
          const element = document.getElementById('terms-content')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        return // Don't execute the general scroll below
      default:
        setResourceSection(resource)
        setActiveSection('resources')
        window.location.hash = 'resources'
    }
    // Scroll to top for better UX (for all other links)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setActiveSection(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // GDPR Cookie Consent Check
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent')
    if (savedConsent === 'true') {
      setCookieConsent(true)
    } else if (savedConsent === 'false') {
      setCookieConsent(false)
    } else {
      // No consent stored, show banner after user shows engagement
      setTimeout(() => setShowCookieBanner(true), 5000)
    }
  }, [])

  // Google Analytics 4 Initialization - Enterprise Privacy Compliance
  useEffect(() => {
    if (cookieConsent === true && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      // Initialize GA4 only after explicit user consent and with valid tracking ID
      initializeGA4()

      // Track analytics acceptance event for business intelligence
      if (window.gtag) {
        window.gtag('event', 'analytics_consent_granted', {
          event_category: 'privacy',
          event_label: 'gdpr_compliance',
          custom_parameter_1: 'enterprise_analytics'
        })
      }
    }
  }, [cookieConsent])

  // Back-to-top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 🚀 ENTERPRISE MARQUEE INTELLIGENCE SYSTEM - STATE OF THE ART
  useEffect(() => {
    const initializeMarqueeSystem = () => {
      // Ensure DOM is fully ready
      const initWithDelay = () => {
        if (!heroBadgeRef.current) {
          return
        }

        const badge = heroBadgeRef.current
        const content = badge.querySelector('.marquee-content')

        if (!content) {
          return
        }


        // INTELLIGENT OVERFLOW DETECTION
        const checkOverflow = () => {
          // Only check on mobile/tablet viewports
          if (window.innerWidth >= 769) {
            // Desktop: Force disable and clean up
            badge.classList.remove('marquee-enabled', 'material-motion')
            return
          }

          // Temporarily disable marquee for measurement
          badge.classList.remove('marquee-enabled')

          // Wait for next frame to ensure layout is updated
          requestAnimationFrame(() => {
            const badgeWidth = badge.offsetWidth
            const contentWidth = content.scrollWidth
            const isOverflowing = contentWidth > badgeWidth - 40 // 40px buffer for padding/comfort


            if (isOverflowing) {
              // ACTIVATE MARQUEE - MOBILE ONLY
              badge.classList.add('marquee-enabled')

              // PLATFORM-NATIVE MOTION DETECTION
              const isAndroid = /Android/i.test(navigator.userAgent)
              if (isAndroid) {
                badge.classList.add('material-motion') // Material 3 Expressive spring physics
              }

              // ACCESSIBILITY & PERFORMANCE OPTIMIZATION
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              if (prefersReducedMotion) {
                badge.setAttribute('aria-label', 'Information banner - animation disabled for accessibility')
              }
            } else {
              badge.classList.remove('marquee-enabled', 'material-motion')
            }
          })
        }

        // BATTERY OPTIMIZATION - PAGE VISIBILITY API
        const handleVisibilityChange = () => {
          if (document.hidden) {
            // Pause animation when tab not visible
            badge.style.setProperty('animation-play-state', 'paused')
          } else {
            badge.style.removeProperty('animation-play-state')
          }
        }

        // RESPONSIVE INTELLIGENCE - RESIZE DETECTION
        const handleResize = debounce(checkOverflow, 150)

        // INTERSECTION OBSERVER - PERFORMANCE OPTIMIZATION
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              badge.style.removeProperty('animation-play-state')
            } else {
              badge.style.setProperty('animation-play-state', 'paused')
            }
          },
          { threshold: 0.1 }
        )

        // ACCESSIBILITY - MOTION PREFERENCE MONITORING
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const handleMotionChange = () => checkOverflow()

        // INITIALIZE SYSTEM
        checkOverflow()

        // ATTACH ENTERPRISE EVENT LISTENERS
        window.addEventListener('resize', handleResize)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        motionMediaQuery.addEventListener('change', handleMotionChange)
        observer.observe(badge)

        // CLEANUP FUNCTION - ENTERPRISE MEMORY MANAGEMENT
        return () => {
          window.removeEventListener('resize', handleResize)
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          motionMediaQuery.removeEventListener('change', handleMotionChange)
          observer.disconnect()
        }
      }

      // Call the initialization function with retry logic for section changes
      const tryInitialize = (attempts = 0) => {
        if (attempts < 5) {
          const badge = heroBadgeRef.current
          const content = badge?.querySelector('.marquee-content')

          if (badge && content && content.textContent.trim()) {
            initWithDelay()
          } else {
            // Retry with exponential backoff
            setTimeout(() => tryInitialize(attempts + 1), 100 + (attempts * 50))
          }
        }
      }

      // Start with immediate attempt, then retry if needed
      setTimeout(() => tryInitialize(), 50)
    }

    // DEBOUNCE UTILITY FOR PERFORMANCE
    function debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    // Only initialize marquee when on home section
    if (activeSection === 'home') {
      const cleanup = initializeMarqueeSystem()
      return cleanup
    }
  }, [activeSection]) // Re-run when section changes

  // Mobile menu auto-close on outside click - 2025 UX best practice
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-nav-container') && !event.target.closest('.mobile-button')) {
        setIsMenuOpen(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Cookie Consent Handlers
  const handleCookieAccept = () => {
    setCookieConsent(true)
    localStorage.setItem('cookieConsent', 'true')
    setShowCookieBanner(false)
  }

  const handleCookieReject = () => {
    setCookieConsent(false)
    localStorage.setItem('cookieConsent', 'false')
    setShowCookieBanner(false)
  }

  return (
    <div className="min-h-screen bg-white mobile-stable">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded">
        Skip to main content
      </a>

      {/* Removed scary legal disclaimer banner that was deterring users */}

      {/* Navigation */}
      <header className="sticky-header">
        <nav className="relative" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-baseline flex-wrap">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                <span className="inline">Camp Explorer</span>
                <span className="inline ml-1">Europe</span>
              </div>
              <span className="ml-2 text-base sm:text-lg md:text-xl text-orange-500 font-semibold">2026</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => handleNavigation('home')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'home' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}>Home</button>
                <button onClick={() => handleNavigation('discover')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'discover' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Discover Camps</button>
                <button onClick={() => handleNavigation('compare')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'compare' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Compare</button>
                <button onClick={() => handleNavigation('plan')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'plan' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Plan Your Summer</button>
                <button onClick={() => handleNavigation('guide')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'guide' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Guide</button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleNavigation('discover')}>Get Started</Button>
              </div>
            </div>

            {/* Mobile menu button - Enhanced 2025 iOS/Android best practices */}
            <div className="md:hidden flex items-center justify-center h-14">
              <Button
                variant="ghost"
                size="lg"
                className="touch-target mobile-button p-3 min-h-[52px] min-w-[52px] bg-gray-900/80 hover:bg-gray-800/90 border border-gray-700/50 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? (
                  <X className="h-7 w-7 text-white" strokeWidth={2.5} />
                ) : (
                  <Menu className="h-7 w-7 text-white" strokeWidth={2.5} />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced for iPhone 15 */}
        {isMenuOpen && (
          <div className="md:hidden mobile-nav-container absolute top-full left-0 right-0 bg-white border-t shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2 mobile-nav-enhanced">
              <button onClick={() => { handleNavigation('home'); setIsMenuOpen(false); }} className={`block px-6 py-4 rounded-lg text-lg font-medium w-full text-left touch-target transition-colors ${activeSection === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50'}`}>Home</button>
              <button onClick={() => { handleNavigation('discover'); setIsMenuOpen(false); }} className={`block px-6 py-4 rounded-lg text-lg font-medium w-full text-left touch-target transition-colors ${activeSection === 'discover' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Discover Camps</button>
              <button onClick={() => { handleNavigation('compare'); setIsMenuOpen(false); }} className={`block px-6 py-4 rounded-lg text-lg font-medium w-full text-left touch-target transition-colors ${activeSection === 'compare' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Compare</button>
              <button onClick={() => { handleNavigation('plan'); setIsMenuOpen(false); }} className={`block px-6 py-4 rounded-lg text-lg font-medium w-full text-left touch-target transition-colors ${activeSection === 'plan' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Plan Your Summer</button>
              <button onClick={() => { handleNavigation('guide'); setIsMenuOpen(false); }} className={`block px-6 py-4 rounded-lg text-lg font-medium w-full text-left touch-target transition-colors ${activeSection === 'guide' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Guide</button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-4 py-4 text-lg font-semibold touch-target" onClick={() => { handleNavigation('discover'); setIsMenuOpen(false); }}>Get Started</Button>
            </div>
          </div>
        )}
      </nav>
      </header>

      {/* Breadcrumb Navigation */}
      {activeSection !== 'home' && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                {generateBreadcrumbs().map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.name}>
                    <BreadcrumbItem>
                      {breadcrumb.current ? (
                        <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={breadcrumb.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNavigation(breadcrumb.href.replace('#', ''))
                          }}
                        >
                          {breadcrumb.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < generateBreadcrumbs().length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" role="main">
      {/* Conditional Section Rendering */}
      {activeSection === 'home' && (
        <>
        {/* Hero Section */}
      <section id="home" className="relative hero-full-height overflow-hidden">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet={heroLakesideAvif} type="image/avif" />
          <source srcSet={heroLakesideWebp} type="image/webp" />
          <img 
            src={heroLakesideCompressed} 
            alt="Children enjoying lakeside activities at European summer camp with Alpine mountain views"
            className="w-full h-full object-cover"
            width="1680" 
            height="720"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        
        <div className="hero-adaptive-grid relative z-10">
          <div className="hero-adaptive-content text-center text-white">
          <div>
            <div
              className="hero-fluid-badge bg-orange-500/90 text-white font-semibold inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium"
              ref={heroBadgeRef}
              role="marquee"
              aria-live="polite"
              aria-label="Camp information banner"
            >
              <span className="marquee-content">
                2026 Season NOW OPEN • 36 Verified Organizations • 21 Countries
              </span>
            </div>
          </div>
          
          <h1 className="hero-fluid-title font-bold">
            Europe's Most
            <span className="block text-orange-400">Comprehensive</span>
            <span className="block hero-fluid-subtitle">Summer Camp Guide</span>
          </h1>
          
          <p className="hero-fluid-text text-gray-200 max-w-3xl mx-auto px-4">
            From Swiss Alpine adventures to Spanish beach immersion, explore summer camp options for your child. Directory of camps with information compiled from official sources and public data.
          </p>

          <p className="hero-fluid-booking-notice text-sm text-orange-200 max-w-2xl mx-auto px-4 mt-4 bg-black/20 rounded-lg py-2">
            <span className="inline-flex items-start">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              Peak booking season: Many popular programs fill by March 2026
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-fluid-spacing">
            <Button
              className="btn-primary text-lg"
              onClick={() => handleNavigation('discover')}
            >
              Explore Camps
            </Button>
            <Button
              className="btn-hero-secondary text-lg"
              onClick={() => handleNavigation('guide')}
            >
              Camp Guide
            </Button>
          </div>

          {/* Verification Badge */}
          <div className="flex justify-center items-start gap-2 text-white/90 text-sm max-w-md mx-auto px-4 mb-4">
            <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Camps verified for 2026 season | Updated January 2026</span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm sm:text-base text-gray-300">{stat.label}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.description}</div>
                </div>
              )
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-gray-900">
              Find Your Perfect Camp
            </h2>
            <p className="section-subtitle text-gray-600 max-w-2xl mx-auto">
              Filter by type, budget, age, or location to discover camps that match your family's needs
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search camps, locations, or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg touch-target"
                autoComplete="off"
                autoCapitalize="none"
              />
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                onClick={() => handleCategoryFilter(option.value)}
                className={`${
                  selectedFilter === option.value 
                    ? "bg-blue-600 text-white" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } px-4 py-2`}
              >
                {option.label} ({option.count})
              </Button>
            ))}
          </div>
          
          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredCamps.length}</span> camps
              {selectedFilter !== 'all' && (
                <span> in <span className="font-semibold">{filterOptions.find(f => f.value === selectedFilter)?.label}</span></span>
              )}
              {searchTerm && (
                <span> matching "<span className="font-semibold">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>
      </section>
      {/* Enhanced Camps Grid */}
      <section id="discover" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Sort featured camps first, then by ID */}
            {[...filteredCamps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map((camp) => (
              <Card key={camp.id} className={`camp-card overflow-hidden group flex flex-col ${
                camp.featured
                  ? 'border-[3px] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-4 ring-amber-100'
                  : 'border-0 shadow-lg'
              }`}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={camp.image}
                    alt={`${camp.name} - ${camp.type} summer camp in ${camp.location} for ages ${camp.ages}`}
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                      camp.image === mapCompressed ? 'object-contain bg-sky-50' : 'object-cover'
                    }`}
                    title={`${camp.name} - European Summer Camp ${camp.ages}`}
                    loading="lazy"
                  />
                  {/* Featured Camp Badge - Prominent gold ribbon */}
                  {camp.featured && (
                    <div className="absolute top-0 left-0 z-10">
                      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white text-sm font-bold px-4 py-2 shadow-lg flex items-center gap-1.5 rounded-br-lg">
                        <Star className="w-4 h-4 fill-white" />
                        <span>FEATURED</span>
                      </div>
                    </div>
                  )}
                  <div className={`absolute ${camp.featured ? 'top-10' : 'top-4'} left-4`}>
                    <Badge className={`${
                      camp.priceRange === 'luxury' ? 'bg-purple-500' :
                      camp.priceRange === 'premium' ? 'bg-blue-500' :
                      camp.priceRange === 'mid' ? 'bg-green-500' : 'bg-orange-500'
                    } text-white px-3 py-1`}>
                      {camp.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {camp.rating}
                    </Badge>
                    <Button
                      size="sm"
                      variant={selectedCamps.find(c => c.id === camp.id) ? "default" : "outline"}
                      className="h-8 px-2"
                      onClick={(e) => { e.stopPropagation(); handleCampSelection(camp); }}
                    >
                      {selectedCamps.find(c => c.id === camp.id) ? '✓' : '+'}
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/70 text-white backdrop-blur-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {camp.dates}
                    </Badge>
                  </div>
                  {/* 2026 Availability Badge for High-Demand Camps */}
                  {(camp.priceRange === 'luxury' || camp.priceRange === 'premium' || camp.rating >= 4.8) && (
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs animate-pulse">
                        2026 Open
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="card-title text-gray-900 group-hover:text-blue-600 transition-colors">
                        {camp.name}
                      </CardTitle>
                      <CardDescription className="body-text flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {camp.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="camp-price">{camp.price}</div>
                      <div className="camp-price-label">per 2 weeks</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="space-y-4 flex-grow">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Ages {camp.ages}
                      </span>
                      <span className="text-gray-600 flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {camp.capacity} max
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {camp.activities.slice(0, 3).map((activity, index) => (
                        <Badge key={index} variant="secondary" className="badge-responsive">
                          {activity}
                        </Badge>
                      ))}
                      {camp.activities.length > 3 && (
                        <Badge variant="secondary" className="badge-responsive">
                          +{camp.activities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Languages:</div>
                      <div className="flex flex-wrap gap-1">
                        {camp.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="badge-responsive">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Highlights:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {camp.highlights.slice(0, camp.featured ? 3 : 2).map((highlight, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="camp-info-section">
                      <div className="flex items-center justify-between">
                        <div className="trust-indicator">
                          <Award className="w-4 h-4" />
                          <span>Est. {camp.established}</span>
                        </div>
                        <div className="trust-indicator">
                          <Heart className="w-4 h-4" />
                          <span>{camp.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      className="w-full btn-secondary"
                      onClick={() => handleBookingClick(camp)}
                      aria-label={`View details and book ${camp.name}`}
                    >
                      View Details & Book
                    </Button>
                    {camp.videoUrl && (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm h-9"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.gtag) {
                            window.gtag('event', 'video_click', {
                              camp_name: camp.name,
                              camp_id: camp.id
                            })
                          }
                          window.open(camp.videoUrl, '_blank')
                        }}
                        aria-label={`Watch ${camp.name} video`}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch Camp Video
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCamps.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No camps found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find more camps.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      {/* Why Choose European Camps Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why European Summer Camps?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Europe offers unparalleled opportunities for cultural immersion, language learning, and personal growth in some of the world's most beautiful settings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Diversity</h3>
              <p className="text-gray-600">Experience 21 countries and meet children from 75+ nationalities</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">World-Class Standards</h3>
              <p className="text-gray-600">Rigorous safety protocols and internationally accredited programs</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Stunning Locations</h3>
              <p className="text-gray-600">From Swiss Alps to Mediterranean coasts, unforgettable settings</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Language Immersion</h3>
              <p className="text-gray-600">Natural language learning in authentic cultural environments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Adventures That Transform
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From Alpine climbing to Mediterranean sailing, language immersion to cultural exploration, 
                our camps offer diverse activities that inspire growth, confidence, and lifelong friendships.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Adventure Sports</h3>
                    <p className="text-gray-600">Rock climbing, glacier expeditions, white water rafting, and mountain biking in Europe's most spectacular settings.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Language Mastery</h3>
                    <p className="text-gray-600">Immersive programs in English, French, German, Spanish, and Italian with native-speaking instructors.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cultural Exchange</h3>
                    <p className="text-gray-600">Meet friends from 75+ countries and experience authentic European culture through local traditions and excursions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Growth</h3>
                    <p className="text-gray-600">Build confidence, independence, and leadership skills through challenging activities and international friendships.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <picture>
                <source srcSet={activitiesAvif} type="image/avif" />
                <source srcSet={activitiesWebp} type="image/webp" />
                <img 
                  src={activitiesCompressed} 
                  alt="European summer camp activities collage showing children engaged in outdoor adventures, sports, arts and cultural activities across beautiful European locations" 
                  className="rounded-lg shadow-2xl"
                  title="European Summer Camp Activities - Adventure, Sports, Arts & Culture"
                  loading="lazy"
                  width="800"
                  height="600"
                  style={{aspectRatio: '4/3'}}
                />
              </picture>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Plan the Perfect Summer 2026?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Browse our directory to research camp options for your family.
            Many camps offer their own booking incentives - check directly with camps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
              onClick={() => handleNavigation('discover')}
            >
              Start Your Search
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
              onClick={() => handleNavigation('guide')}
            >
              Complete Guide
            </Button>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Discover Section */}
      {activeSection === 'discover' && (
        <>
        {/* Search and Filter Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find Your Perfect Camp
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Filter by type, budget, age, or location to discover camps that match your family's needs
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search camps, locations, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg touch-target"
                  autoComplete="off"
                  autoCapitalize="none"
                />
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedFilter === option.value ? "default" : "outline"}
                  onClick={() => handleCategoryFilter(option.value)}
                  className={`${
                    selectedFilter === option.value 
                      ? "bg-blue-600 text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } px-4 py-2`}
                >
                  {option.label} ({option.count})
                </Button>
              ))}
            </div>
            
            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredCamps.length}</span> camps
                {selectedFilter !== 'all' && (
                  <span> in <span className="font-semibold">{filterOptions.find(f => f.value === selectedFilter)?.label}</span></span>
                )}
                {searchTerm && (
                  <span> matching "<span className="font-semibold">{searchTerm}</span>"</span>
                )}
              </p>
              {selectedCamps.length > 0 && (
                <div className="mt-4">
                  <Button 
                    onClick={() => handleNavigation('compare')} 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Compare {selectedCamps.length} Camp{selectedCamps.length > 1 ? 's' : ''}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Enhanced Camps Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sort featured camps first */}
              {[...filteredCamps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map((camp) => (
                <Card key={camp.id} className={`camp-card overflow-hidden group flex flex-col ${
                  camp.featured
                    ? 'border-[3px] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-4 ring-amber-100'
                    : 'border-0 shadow-lg'
                }`}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={camp.image}
                      alt={`${camp.name} - ${camp.type} summer camp in ${camp.location} for ages ${camp.ages}`}
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                        camp.image === mapCompressed ? 'object-contain bg-sky-50' : 'object-cover'
                      }`}
                      title={`${camp.name} - European Summer Camp ${camp.ages}`}
                      loading="lazy"
                    />
                    {/* Featured Camp Badge */}
                    {camp.featured && (
                      <div className="absolute top-0 left-0 z-10">
                        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white text-sm font-bold px-4 py-2 shadow-lg flex items-center gap-1.5 rounded-br-lg">
                          <Star className="w-4 h-4 fill-white" />
                          <span>FEATURED</span>
                        </div>
                      </div>
                    )}
                    <div className={`absolute ${camp.featured ? 'top-10' : 'top-4'} left-4`}>
                      <Badge className={`${
                        camp.priceRange === 'luxury' ? 'bg-purple-500' :
                        camp.priceRange === 'premium' ? 'bg-blue-500' :
                        camp.priceRange === 'mid' ? 'bg-green-500' : 'bg-orange-500'
                      } text-white px-3 py-1`}>
                        {camp.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {camp.rating}
                      </Badge>
                      <Button
                        size="sm"
                        variant={selectedCamps.find(c => c.id === camp.id) ? "default" : "outline"}
                        className="h-8 px-2"
                        onClick={(e) => { e.stopPropagation(); handleCampSelection(camp); }}
                      >
                        {selectedCamps.find(c => c.id === camp.id) ? '✓' : '+'}
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-black/70 text-white backdrop-blur-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {camp.dates}
                      </Badge>
                    </div>
                    {/* 2026 Availability Badge for High-Demand Camps */}
                    {(camp.priceRange === 'luxury' || camp.priceRange === 'premium' || camp.rating >= 4.8) && (
                      <div className="absolute bottom-4 right-4">
                        <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs animate-pulse">
                          2026 Open
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                          {camp.name}
                        </CardTitle>
                        <CardDescription className="flex items-center text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {camp.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{camp.price}</div>
                        <div className="text-xs text-gray-500">per 2 weeks</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <div className="space-y-4 flex-grow">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Ages {camp.ages}
                        </span>
                        <span className="text-gray-600 flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {camp.capacity} max
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {camp.activities.slice(0, 3).map((activity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                        {camp.activities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{camp.activities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">Languages:</div>
                        <div className="flex flex-wrap gap-1">
                          {camp.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">Highlights:</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {camp.highlights.slice(0, camp.featured ? 3 : 2).map((highlight, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center text-sm text-gray-500">
                          <Award className="w-4 h-4 mr-1" />
                          Est. {camp.established}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart className="w-4 h-4 mr-1" />
                          {camp.reviews} reviews
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleBookingClick(camp)}
                        aria-label={`View details and book ${camp.name}`}
                      >
                        View Details & Book
                      </Button>
                      {camp.videoUrl && (
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm h-9"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.gtag) {
                              window.gtag('event', 'video_click', {
                                camp_name: camp.name,
                                camp_id: camp.id
                              })
                            }
                            window.open(camp.videoUrl, '_blank')
                          }}
                          aria-label={`Watch ${camp.name} video`}
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Watch Camp Video
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCamps.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No camps found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find more camps.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
        </>
      )}

      {/* Compare Section */}
      {activeSection === 'compare' && (
        <section className="py-20 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Compare Summer Camps
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Compare up to 3 camps side by side to find the perfect match for your child
              </p>
            </div>

            {selectedCamps.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No camps selected</h3>
                <p className="text-gray-600 mb-4">
                  Go back to Discover Camps and select camps using the '+' button to compare them
                </p>
                <Button 
                  onClick={() => handleNavigation('discover')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Discover Camps
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-center mb-8">
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                    Comparing {selectedCamps.length} camp{selectedCamps.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedCamps.map((camp) => (
                    <Card key={camp.id} className="relative border-2 border-blue-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => handleCampSelection(camp)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="p-6">
                        <img 
                          src={camp.image} 
                          alt={`${camp.name} - ${camp.type} summer camp in ${camp.location} for ages ${camp.ages}`}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                          title={`${camp.name} - European Summer Camp ${camp.ages}`}
                          loading="lazy"
                        />
                        
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{camp.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {camp.location}
                        </p>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-blue-600">{camp.price}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ages:</span>
                            <span className="font-semibold">{camp.ages}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <span className="font-semibold flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {camp.rating}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Capacity:</span>
                            <span className="font-semibold">{camp.capacity}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold">{camp.type}</span>
                          </div>

                          <div>
                            <span className="text-gray-600 block mb-2">Languages:</span>
                            <div className="flex flex-wrap gap-1">
                              {camp.languages.map((lang, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-600 block mb-2">Activities:</span>
                            <div className="flex flex-wrap gap-1">
                              {camp.activities.slice(0, 4).map((activity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                              {camp.activities.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{camp.activities.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                            onClick={() => handleBookingClick(camp)}
                          >
                            Book Now
                          </Button>
                          {camp.videoUrl && (
                            <Button
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm h-9 mt-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.gtag) {
                                  window.gtag('event', 'video_click', {
                                    camp_name: camp.name,
                                    camp_id: camp.id
                                  })
                                }
                                window.open(camp.videoUrl, '_blank')
                              }}
                              aria-label={`Watch ${camp.name} video`}
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              Watch Camp Video
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center pt-8">
                  <Button 
                    onClick={() => handleNavigation('discover')}
                    variant="outline"
                    className="mr-4"
                  >
                    Add More Camps
                  </Button>
                  <Button 
                    onClick={() => setSelectedCamps([])}
                    variant="outline"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Plan Your Summer Section */}
      {activeSection === 'plan' && (
        <section className="py-20 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Plan Your Perfect Summer 2026
              </h2>
              <p className="text-xl text-gray-600">
                General booking timeline information based on typical camp patterns
              </p>
            </div>

            <div className="space-y-8">
              {/* Timeline */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Timeline</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">September - October 2025</h4>
                      <p className="text-gray-600">Research and shortlist camps. Some camps may offer early booking incentives.</p>
                      <ul className="mt-2 text-sm text-gray-500">
                        <li>• Browse camp options</li>
                        <li>• Compare programs and prices</li>
                        <li>• Contact camps for detailed information</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">November - December 2025</h4>
                      <p className="text-gray-600">Secure your preferred camps with deposits</p>
                      <ul className="mt-2 text-sm text-gray-500">
                        <li>• Submit applications</li>
                        <li>• Pay deposits to secure spots</li>
                        <li>• Check individual camps for booking incentives</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">January - March 2026</h4>
                      <p className="text-gray-600">Complete documentation and preparations</p>
                      <ul className="mt-2 text-sm text-gray-500">
                        <li>• Arrange travel and visas</li>
                        <li>• Complete health and insurance forms</li>
                        <li>• Final payment due</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">April - May 2026</h4>
                      <p className="text-gray-600">Final preparations and packing</p>
                      <ul className="mt-2 text-sm text-gray-500">
                        <li>• Receive detailed information packets</li>
                        <li>• Prepare clothing and equipment lists</li>
                        <li>• Attend parent information sessions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Budget Planner */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Budget Planning</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Average Costs by Category</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget Excellence</span>
                        <span className="font-semibold">€330 - €400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mid-Range Programs</span>
                        <span className="font-semibold">€1,500 - €3,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium Alpine</span>
                        <span className="font-semibold">CHF 4,000 - 5,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Luxury Experiences</span>
                        <span className="font-semibold">CHF 6,000+</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Additional Costs</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel to/from camp</span>
                        <span>€200 - €800</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pocket money</span>
                        <span>€100 - €300</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Optional activities</span>
                        <span>€50 - €200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipment/clothing</span>
                        <span>€100 - €400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel insurance</span>
                        <span>€30 - €100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Items */}
              <Card className="p-6 bg-blue-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Take these steps to begin your summer camp journey
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => handleNavigation('discover')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Browse All Camps
                  </Button>
                  <Button 
                    onClick={() => handleNavigation('compare')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Compare Selected Camps
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Guide Section */}
      {activeSection === 'guide' && (
        <section className="py-12 bg-white min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center mb-16">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <div className="text-xl">📚</div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Comprehensive Guide to 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">
                  European Kids Summer Camps 2026
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                European summer camps in 2026 offer children unparalleled opportunities to learn, play, and grow in some of the world's most stunning locations. From Alpine adventure bases to Mediterranean beach retreats, there are options tailored to every age (3-24) and interest.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">36 Verified Organizations</Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">21 Countries</Badge>
                <Badge className="bg-orange-100 text-orange-800 px-4 py-2 text-sm">Expert Recommendations</Badge>
                <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">€330-CHF 7,000 Range</Badge>
              </div>
            </div>

            {/* Introduction & Why Europe */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Why Choose Europe?</h3>
                </div>
                
                <div className="prose text-gray-600 mb-6">
                  <p>European camps blend language immersion, cultural diversity, and world-class instruction in safe, beautiful environments. Campers often come from dozens of countries, forming international friendships while exploring Alpine peaks, medieval castles, or sunny coastlines.</p>
                  
                  <p>Europe's rich history and multilingual context mean that a camp day might include learning survival skills in the mountains, practicing French at a château, or sailing past ancient islands – experiences hard to replicate elsewhere.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Benefits</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• High safety standards & low staff ratios</li>
                    <li>• 75+ nationalities represented</li>
                    <li>• Natural language immersion</li>
                    <li>• Historic & stunning locations</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Cost Range Guide</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3">Budget Categories</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>🏆 Luxury (CHF 6,000+)</span>
                        <span className="font-semibold text-green-800">Premium facilities</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>💎 Premium (€3,000-6,000)</span>
                        <span className="font-semibold text-green-800">High-end programs</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>🎯 Mid-Range (€1,500-3,500)</span>
                        <span className="font-semibold text-green-800">Excellent value</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span>💰 Budget (€330-800)</span>
                        <span className="font-semibold text-green-800">Outstanding bargains</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Additional Costs</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Travel to/from camp: €200-800</li>
                      <li>• Travel insurance: €30-100</li>
                      <li>• Pocket money: €100-300</li>
                      <li>• Equipment/gear: €75-400</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Age Groups Overview */}
            <Card className="p-8 mb-16 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-orange-50">
              <h2 className="section-title text-gray-900 text-center">Camps by Age Group</h2>
              <p className="section-subtitle text-center text-gray-600">Each age group has different needs and readiness levels for camp experiences</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">3-6</span>
                    </div>
                    <h4 className="font-bold text-lg">Early Childhood</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Day camps or parent-child programs focused on play-based learning</p>
                  <div className="text-xs text-gray-500">
                    <div>• Arts & crafts, outdoor play</div>
                    <div>• High staff-to-child ratios</div>
                    <div>• Gentle language introduction</div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold text-sm">7-10</span>
                    </div>
                    <h4 className="font-bold text-lg">Primary School</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Ready for short overnight camps and bigger adventures</p>
                  <div className="text-xs text-gray-500">
                    <div>• Multi-activity programs</div>
                    <div>• Language immersion starts</div>
                    <div>• Building confidence</div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-orange-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 font-bold text-sm">11-14</span>
                    </div>
                    <h4 className="font-bold text-lg">Early Teens</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Ready for specialized programs and increased independence</p>
                  <div className="text-xs text-gray-500">
                    <div>• Academic enrichment</div>
                    <div>• Adventure expeditions</div>
                    <div>• Cultural immersion</div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-purple-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-bold text-sm">15-16</span>
                    </div>
                    <h4 className="font-bold text-lg">Older Teens</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Pre-college academics, leadership, and portfolio-building</p>
                  <div className="text-xs text-gray-500">
                    <div>• Career exploration</div>
                    <div>• Leadership training</div>
                    <div>• University preparation</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Country Breakdown */}
            <Card className="p-8 mb-16 border-0 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Countries & Camp Types</h3>
                <p className="text-lg text-gray-600">Explore camps across 21 European countries, each offering unique experiences</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-lg border border-red-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🇨🇭</span>
                    <h4 className="font-bold text-lg">Switzerland</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Premium Alpine experiences with world-class facilities. Home to Les Elfes International and Camp Suisse.</p>
                  <div className="text-xs text-gray-500">
                    <div>• CHF 975 - 6,980</div>
                    <div>• Ages 3-17</div>
                    <div>• Multilingual programs</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🇬🇧</span>
                    <h4 className="font-bold text-lg">United Kingdom</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Academic excellence and comprehensive family programs. Oxford Summer Courses and Bede's Summer School.</p>
                  <div className="text-xs text-gray-500">
                    <div>• £1,575 - 6,220</div>
                    <div>• Ages 6-20</div>
                    <div>• Historic locations</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-lg border border-yellow-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🇪🇸</span>
                    <h4 className="font-bold text-lg">Spain</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Spanish immersion with beach activities. Enforex camps blend language learning with Mediterranean fun.</p>
                  <div className="text-xs text-gray-500">
                    <div>• €1,200 - 3,800</div>
                    <div>• Ages 5-17</div>
                    <div>• 50% local integration</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🇫🇷</span>
                    <h4 className="font-bold text-lg">France</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">French language immersion in châteaux and Alps. Alpine French School and château programs.</p>
                  <div className="text-xs text-gray-500">
                    <div>• €1,200 - 4,500</div>
                    <div>• Ages 8-18</div>
                    <div>• Historic settings</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🇨🇿</span>
                    <h4 className="font-bold text-lg">Czech Republic</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Exceptional value programs. EUROCAM Bohemia offers 10-day adventures for incredible prices.</p>
                  <div className="text-xs text-gray-500">
                    <div>• €335 (10 days!)</div>
                    <div>• Ages 7-17</div>
                    <div>• Bilingual environment</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🇮🇹</span>
                    <h4 className="font-bold text-lg">Italy</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Arts, sports academies, and cultural immersion. AC Milan camps and Renaissance art programs.</p>
                  <div className="text-xs text-gray-500">
                    <div>• €1,200 - 2,800</div>
                    <div>• Ages 8-16</div>
                    <div>• Cultural heritage focus</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Plus camps in Germany, Austria, Netherlands, Belgium, Denmark, Sweden, Norway, and Greece!</p>
                <Button 
                  onClick={() => handleNavigation('discover')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Explore All Countries
                </Button>
              </div>
            </Card>

            {/* Camp Types */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Camp Types & Specialties</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">Academic & Language</h5>
                      <p className="text-sm">University prep, language immersion, STEM programs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">Adventure & Nature</h5>
                      <p className="text-sm">Alpine trekking, sailing, outdoor leadership</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">Arts & Performance</h5>
                      <p className="text-sm">Theater, music, visual arts, portfolio building</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">Sports Specialty</h5>
                      <p className="text-sm">Football academies, tennis, equestrian, motorsports</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Booking Timeline 2026</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-3">Critical Dates</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span><strong>Sept-Oct 2025:</strong> Research camps & check for offers</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span><strong>Nov-Jan 2026:</strong> Prime booking period</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                        <span><strong>Feb 2026:</strong> Final call for most camps</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                        <span><strong>After May:</strong> Very limited options</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Typical Booking Patterns</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Save 10-20% on camp fees</li>
                      <li>• First choice of dates & activities</li>
                      <li>• Payment plan options</li>
                      <li>• Better accommodation selection</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Safety & Standards */}
            <Card className="p-8 mb-16 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Safety & Standards</h3>
                <p className="text-lg text-gray-600">Information about camp safety practices compiled from public sources</p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-600" />
                      Accreditations
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Swiss Jeunesse+Sport certification</li>
                      <li>• UK BAPA membership</li>
                      <li>• EU youth camp licensing</li>
                      <li>• International insurance coverage</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Staff Standards
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 1:5 to 1:8 staff-to-camper ratios</li>
                      <li>• Background checks required</li>
                      <li>• First aid & CPR certified</li>
                      <li>• Multilingual capabilities</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      Medical Care
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• On-site medical staff</li>
                      <li>• 24/7 emergency protocols</li>
                      <li>• Hospital partnerships</li>
                      <li>• Comprehensive insurance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Featured Camp Examples */}
            <Card className="p-8 mb-16 border-0 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Camp Examples</h3>
                <p className="text-lg text-gray-600">Standout programs across different categories and price ranges</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-blue-500 text-white px-3 py-1 mr-3">Premium</Badge>
                    <h4 className="font-bold text-lg">Les Elfes International</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Switzerland's gold-standard Alpine camp with 37+ years experience. 25,000+ alumni from 75+ countries.</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><strong>Ages:</strong> 6-17</div>
                    <div><strong>Price:</strong> CHF 4,990</div>
                    <div><strong>Languages:</strong> 5+ languages</div>
                    <div><strong>Special:</strong> 24/7 medical center</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-green-500 text-white px-3 py-1 mr-3">Budget</Badge>
                    <h4 className="font-bold text-lg">EUROCAM Bohemia</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Czech Republic's hidden gem offering incredible value. 30+ years experience with bilingual programming.</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><strong>Ages:</strong> 7-17</div>
                    <div><strong>Price:</strong> €335 (10 days!)</div>
                    <div><strong>Languages:</strong> English/Czech</div>
                    <div><strong>Special:</strong> River activities, caves</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-orange-500 text-white px-3 py-1 mr-3">Academic</Badge>
                    <h4 className="font-bold text-lg">Oxford Summer Courses</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">University preparation in Oxford's historic colleges. Medicine, engineering, and business programs.</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><strong>Ages:</strong> 13-18</div>
                    <div><strong>Price:</strong> £6,220</div>
                    <div><strong>Languages:</strong> English</div>
                    <div><strong>Special:</strong> College accommodation</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-purple-500 text-white px-3 py-1 mr-3">Sports</Badge>
                    <h4 className="font-bold text-lg">AC Milan Academy</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Train with official AC Milan coaches at professional facilities. San Siro stadium tours included.</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><strong>Ages:</strong> 8-16</div>
                    <div><strong>Price:</strong> €1,440</div>
                    <div><strong>Languages:</strong> English/Italian</div>
                    <div><strong>Special:</strong> Pro coaching, stadium access</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Call to Action */}
            <Card className="p-8 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Camp?</h3>
              <p className="text-blue-100 mb-8 text-lg">
                Use our directory to explore 23+ verified camp organizations offering 100+ programs, compare options, and research your child's potential European summer adventure for 2026.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
                  onClick={() => handleNavigation('discover')}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Discover All Camps
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                  onClick={() => handleNavigation('compare')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Compare Favorites
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                  onClick={() => handleNavigation('plan')}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Plan Timeline
                </Button>
              </div>
            </Card>

            {/* Final Message */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                This directory compiles information from public sources including camp websites and publicly available data. Information accuracy depends on source reliability and may change. Please verify details directly with camps. 
                <strong className="text-gray-800"> Start early, plan ahead, and give your child the gift of an unforgettable European summer adventure!</strong>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      {activeSection === 'resources' && (
        <section className="py-12 bg-white min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {resourceSection === 'booking-timeline' && (
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Timeline & Tips</h1>
                  <p className="text-xl text-gray-600">Your complete guide to securing the perfect camp spot for 2026</p>
                </div>
                
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Critical Booking Dates for 2026</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-bold text-green-800">September - October 2025</h3>
                        <p className="text-gray-600">Research camps and check their websites for any booking offers. Many camps release new brochures in fall.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-bold text-blue-800">November 2025 - January 2026</h3>
                        <p className="text-gray-600">Common booking period. Popular camps may fill during this time. Contact camps directly about availability.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-bold text-orange-800">February 2026</h3>
                        <p className="text-gray-600">Many international camps approach capacity. Check with individual camps for current availability.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-bold text-red-800">March - May 2026</h3>
                        <p className="text-gray-600">Late booking phase. Limited availability, mostly day camps or less popular sessions.</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Booking Strategy Tips</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Book multiple camps initially, narrow down later</li>
                      <li>• Ask about sibling discounts and multi-session deals</li>
                      <li>• Understand cancellation policies before paying</li>
                      <li>• Consider travel insurance for international camps</li>
                      <li>• Communicate special needs during booking</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Payment Planning</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Deposits typically 25-50% of total cost</li>
                      <li>• Payment plans available for early bookers</li>
                      <li>• Watch currency exchange rates for savings</li>
                      <li>• Budget for extras: travel, gear, pocket money</li>
                      <li>• Ask about scholarship or financial aid options</li>
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {resourceSection === 'safety-standards' && (
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Standards Guide</h1>
                  <p className="text-xl text-gray-600">Understanding European camp safety protocols and accreditations</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                  <Card className="p-6">
                    <Shield className="w-12 h-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Accreditations</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Swiss Jeunesse+Sport certification</li>
                      <li>• UK BAPA (British Activity Providers Association)</li>
                      <li>• EU youth camp licensing requirements</li>
                      <li>• International liability insurance</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-6">
                    <Users className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Staff Standards</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 1:5 to 1:8 staff-to-camper ratios</li>
                      <li>• Criminal background checks required</li>
                      <li>• First aid and CPR certifications</li>
                      <li>• Ongoing safety training programs</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-6">
                    <Heart className="w-12 h-12 text-red-600 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Medical Care</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• On-site medical staff or nurse</li>
                      <li>• 24/7 emergency response protocols</li>
                      <li>• Partnerships with local hospitals</li>
                      <li>• Comprehensive medical insurance</li>
                    </ul>
                  </Card>
                </div>

                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">What Parents Should Ask</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-3">Safety Questions</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• What are your staff-to-camper ratios?</li>
                        <li>• How do you screen and train staff?</li>
                        <li>• What medical facilities are available?</li>
                        <li>• How do you handle emergencies?</li>
                        <li>• What insurance coverage is provided?</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3">Activity Safety</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Are activity instructors certified?</li>
                        <li>• What safety equipment is provided?</li>
                        <li>• How do you assess weather conditions?</li>
                        <li>• What are your water safety protocols?</li>
                        <li>• How do you handle dietary restrictions?</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {resourceSection === 'budget-calculator' && (
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Budget Planning Calculator</h1>
                  <p className="text-xl text-gray-600">Plan your complete camp investment with our comprehensive cost guide</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Cost Categories</h2>
                    <div className="space-y-6">
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-bold text-green-800">Budget Camps</h3>
                        <p className="text-gray-600">€330 - €800</p>
                        <p className="text-sm text-gray-500">Day camps, municipal programs, Eastern Europe</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-bold text-blue-800">Mid-Range Camps</h3>
                        <p className="text-gray-600">€1,500 - €3,500</p>
                        <p className="text-sm text-gray-500">Quality residential programs, language immersion</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-bold text-orange-800">Premium Camps</h3>
                        <p className="text-gray-600">€3,000 - €6,000</p>
                        <p className="text-sm text-gray-500">High-end facilities, specialized programs</p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h3 className="font-bold text-red-800">Luxury Camps</h3>
                        <p className="text-gray-600">CHF 6,000+</p>
                        <p className="text-sm text-gray-500">Swiss Alps, exclusive programs, top facilities</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Additional Costs</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Travel to/from camp</span>
                        <span className="text-gray-600">€200-€800</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Travel insurance</span>
                        <span className="text-gray-600">€30-€100</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Pocket money</span>
                        <span className="text-gray-600">€100-€300</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Equipment/gear</span>
                        <span className="text-gray-600">€75-€400</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Optional activities</span>
                        <span className="text-gray-600">€50-€200</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2">
                        <span>Typical Additional Costs</span>
                        <span>€455-€1,800</span>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-2">Money-Saving Tips</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Book early for 10-20% discounts</li>
                        <li>• Look for sibling discounts</li>
                        <li>• Consider shoulder season dates</li>
                        <li>• Factor in currency exchange timing</li>
                        <li>• Ask about payment plans</li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {resourceSection === 'parent-reviews' && (
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Parent Reviews & Testimonials</h1>
                  <p className="text-xl text-gray-600">Real experiences from families who've sent their children to European camps</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Star className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Sarah M., Munich</h3>
                        <p className="text-sm text-gray-600">Platform User</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"This site saved me weeks of research! Instead of visiting dozens of camp websites individually, I could compare programs side-by-side and filter by exactly what we needed. The verified information gave me confidence that I wasn't missing any red flags."</p>
                    <div className="flex text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Marcus K., Amsterdam</h3>
                        <p className="text-sm text-gray-600">Platform User</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"The detailed filtering system helped us narrow down from 100+ camps to our top 5 in minutes. Having all the essential information - ages, pricing, activities - in one place made comparing options so much easier than jumping between different websites."</p>
                    <div className="flex text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <Star className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Elena R., London</h3>
                        <p className="text-sm text-gray-600">Platform User</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"As a working parent, I appreciated having all the camp information organized and verified in one place. The search filters meant I didn't have to waste time looking at camps that wouldn't fit our budget or age requirements."</p>
                    <div className="flex text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </Card>

                </div>

                <Card className="p-8 mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-center">What Parents Love Most</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Cultural Growth</h3>
                      <p className="text-gray-600">Children return with broader perspectives and international friendships</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Independence</h3>
                      <p className="text-gray-600">Kids develop self-confidence and problem-solving skills</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Quality Programs</h3>
                      <p className="text-gray-600">Professional staff and well-organized activities</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {resourceSection === 'early-bird' && (
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Information</h1>
                  <p className="text-xl text-gray-600">General information about camp booking</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">How to Book Camps</h2>
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-bold text-blue-800">Contact Camps Directly</h3>
                        <p className="text-gray-600">Visit camp websites for current information</p>
                        <p className="text-sm text-gray-500">Each camp has its own booking process</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-bold text-green-800">Verify All Details</h3>
                        <p className="text-gray-600">Confirm dates, prices, and availability</p>
                        <p className="text-sm text-gray-500">Information may change - always verify</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-bold text-orange-800">Ask About Offers</h3>
                        <p className="text-gray-600">Some camps may have booking incentives</p>
                        <p className="text-sm text-gray-500">Policies vary by individual camp</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-bold text-purple-800">Understand Terms</h3>
                        <p className="text-gray-600">Review cancellation and refund policies</p>
                        <p className="text-sm text-gray-500">Each camp has different conditions</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Important Considerations</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Research Thoroughly</h5>
                          <p className="text-sm text-gray-600">Compare multiple camps before deciding</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Check References</h5>
                          <p className="text-sm text-gray-600">Look for reviews from multiple sources</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Understand Policies</h5>
                          <p className="text-sm text-gray-600">Know cancellation and refund terms</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Verify Information</h5>
                          <p className="text-sm text-gray-600">Confirm all details directly with camps</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-3">📋 Important Notice</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>All pricing, dates, and availability shown in our directory are subject to change.</p>
                        <p>We compile information from public sources but cannot guarantee accuracy.</p>
                        <p className="font-semibold">Always verify current information directly with camps before booking.</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-8 mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">Booking Timeline 2026</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-green-800">Now - October 2025</h3>
                        <p className="text-green-700">Best discounts available, full selection of dates and programs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-800">November 2025 - January 2026</h3>
                        <p className="text-blue-700">Good discounts still available, popular sessions filling up</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                      <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-orange-800">February - March 2026</h3>
                        <p className="text-orange-700">Limited discounts, premium camps mostly full</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {resourceSection === 'age-recommendations' && (
              <div>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Age-Appropriate Recommendations</h1>
                  <p className="text-xl text-gray-600">Find the perfect camp match for your child's developmental stage</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">3-6</span>
                      </div>
                      <h3 className="text-xl font-bold">Early Childhood</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Day camps or parent-child programs focused on play-based learning and gentle introduction to group activities.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• High staff-to-child ratios (1:3 to 1:4)</li>
                      <li>• Short program durations (half-day preferred)</li>
                      <li>• Focus on arts, crafts, and outdoor play</li>
                      <li>• Gentle language exposure through games</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">7-10</span>
                      </div>
                      <h3 className="text-xl font-bold">Primary School</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Ready for overnight camps and bigger adventures. Perfect age for first international camp experience.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Can handle 1-2 week residential programs</li>
                      <li>• Multi-activity camps work best</li>
                      <li>• Language immersion becomes effective</li>
                      <li>• Building independence and confidence</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-bold">11-14</span>
                      </div>
                      <h3 className="text-xl font-bold">Early Teens</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Ready for specialized programs and increased independence. Can handle more challenging activities.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Academic enrichment programs</li>
                      <li>• Adventure expeditions and leadership</li>
                      <li>• Cultural immersion experiences</li>
                      <li>• Sports specialty training</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold">15-16</span>
                      </div>
                      <h3 className="text-xl font-bold">Older Teens</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Pre-college preparation, career exploration, and leadership development opportunities.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• University preparation programs</li>
                      <li>• Career exploration and internships</li>
                      <li>• Portfolio building for arts students</li>
                      <li>• Leadership training and CIT programs</li>
                    </ul>
                  </Card>
                </div>

                <Card className="p-8 mt-8">
                  <h2 className="text-2xl font-bold mb-6">Choosing by Personality Type</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-green-800">For Outgoing Children</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Large camps with lots of activities</li>
                        <li>• Performance and arts programs</li>
                        <li>• Sports camps with team elements</li>
                        <li>• Leadership opportunities</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-blue-800">For Quieter Children</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Smaller, intimate camp settings</li>
                        <li>• Academic or STEM-focused programs</li>
                        <li>• Nature and outdoor exploration</li>
                        <li>• Arts and creative programs</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {!resourceSection && (
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
                <p className="text-xl text-gray-600 mb-8">Select a resource from the footer to view detailed information</p>
                <Button onClick={() => handleNavigation('guide')} className="bg-blue-600 hover:bg-blue-700">
                  View Complete Guide Instead
                </Button>
              </div>
            )}

            <div className="mt-12 text-center">
              <Button onClick={() => handleNavigation('home')} variant="outline">
                ← Back to Home
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Privacy Policy Section */}
      {activeSection === 'privacy' && (
        <section className="py-12 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-xl text-gray-600">How we protect your privacy while helping you find the perfect camp</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Cookie Usage</h2>
                <p className="mb-4">We use two types of cookies:</p>
                <ul className="mb-4">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly (search, navigation, filters)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand which camps are most popular to improve your experience (Google Analytics & Vercel Analytics)</li>
                </ul>
                <p>You can choose to accept or decline analytics cookies at any time.</p>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Data We Collect</h2>
                <p className="mb-4">We only collect:</p>
                <ul className="mb-4">
                  <li>Anonymous usage statistics (which camps you view, search terms)</li>
                  <li>Technical information (browser type, device type for optimization)</li>
                  <li>Your cookie preferences</li>
                </ul>
                <p><strong>We never collect:</strong> Personal information, email addresses, or any identifying data.</p>
              </Card>
              
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="mb-4">
                  <li>Accept or decline analytics cookies</li>
                  <li>Change your cookie preferences at any time</li>
                  <li>Browse our site with essential cookies only</li>
                </ul>
                <p><strong>For questions about privacy, contact us at:</strong><br/>contact@europeansummercamps.com</p>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button onClick={() => handleNavigation('home')} className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16" role="contentinfo" aria-label="Site footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Camp Explorer Europe</h3>
              <p className="text-gray-400 mb-4">
                European summer camp directory featuring 36 verified organizations offering 100+ programs across 21 countries. Information compiled from public sources to help parents research camp options.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Top Destinations</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Switzerland')}
                    aria-label="Filter camps in Switzerland"
                  >
                    🇨🇭 Switzerland (Premium Alpine)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('United Kingdom')}
                    aria-label="Filter camps in United Kingdom"
                  >
                    🇬🇧 United Kingdom (Academic)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Spain')}
                    aria-label="Filter camps in Spain"
                  >
                    🇪🇸 Spain (Language Immersion)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('France')}
                    aria-label="Filter camps in France"
                  >
                    🇫🇷 France (Cultural Heritage)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Austria')}
                    aria-label="Filter camps in Austria"
                  >
                    🇦🇹 Austria (Adventure Sports)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Italy')}
                    aria-label="Filter camps in Italy"
                  >
                    🇮🇹 Italy (Sports & Culture)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Germany')}
                    aria-label="Filter camps in Germany"
                  >
                    🇩🇪 Germany (Budget Excellence)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Czech Republic')}
                    aria-label="Filter camps in Czech Republic"
                  >
                    🇨🇿 Czech Republic (Hidden Gems)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Croatia')}
                    aria-label="Filter camps in Croatia"
                  >
                    🇭🇷 Croatia (Mediterranean Adventure)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Norway')}
                    aria-label="Filter camps in Norway"
                  >
                    🇳🇴 Norway (Adventure Capital)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Denmark')}
                    aria-label="Filter camps in Denmark"
                  >
                    🇩🇰 Denmark (Adventure Sports)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Finland')}
                    aria-label="Filter camps in Finland"
                  >
                    🇫🇮 Finland (STEM Excellence)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Sweden')}
                    aria-label="Filter camps in Sweden"
                  >
                    🇸🇪 Sweden (Film & Adventure)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Iceland')}
                    aria-label="Filter camps in Iceland"
                  >
                    🇮🇸 Iceland (Unique Geology)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Greece')}
                    aria-label="Filter camps in Greece"
                  >
                    🇬🇷 Greece (Sailing & Water Sports)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Poland')}
                    aria-label="Filter camps in Poland"
                  >
                    🇵🇱 Poland (Academic Excellence)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Portugal')}
                    aria-label="Filter camps in Portugal"
                  >
                    🇵🇹 Portugal (Beach & Adventure)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Ireland')}
                    aria-label="Filter camps in Ireland"
                  >
                    🇮🇪 Ireland (Adventure Activities)
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCountryFilter('Hungary')}
                    aria-label="Filter camps in Hungary"
                  >
                    🇭🇺 Hungary (Lake Balaton)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Camp Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('premium')}
                    aria-label="Filter premium category camps"
                  >
                    Premium Alpine Experiences
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('academic')}
                    aria-label="Filter academic category camps"
                  >
                    Academic & STEM Programs
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('language')}
                    aria-label="Filter language category camps"
                  >
                    Language Immersion Camps
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('sports')}
                    aria-label="Filter sports category camps"
                  >
                    Sports Specialty Training
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('family')}
                    aria-label="Filter family category camps"
                  >
                    Family-Friendly Programs
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('budget_excellence')}
                    aria-label="Filter budget excellence category camps"
                  >
                    Budget Excellence
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('unique')}
                    aria-label="Filter unique experience camps"
                  >
                    Unique Experiences
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('local')}
                    aria-label="Filter local category camps"
                  >
                    Local & Municipal Gems
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('guide')}
                    aria-label="View complete camp guide 2026"
                  >
                    Complete Camp Guide 2026
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('booking-timeline')}
                    aria-label="View booking timeline and tips"
                  >
                    Booking Timeline & Tips
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('safety-standards')}
                    aria-label="View safety standards guide"
                  >
                    Safety Standards Guide
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('parent-reviews')}
                    aria-label="View parent reviews and testimonials"
                  >
                    Parent Reviews & Testimonials
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('early-bird')}
                    aria-label="View early bird discounts"
                  >
                    Booking Information
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('compare')}
                    aria-label="View camp comparison tool"
                  >
                    Camp Comparison Tool
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('age-recommendations')}
                    aria-label="View age-appropriate recommendations"
                  >
                    Age-Appropriate Recommendations
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('budget-calculator')}
                    aria-label="View budget planning calculator"
                  >
                    Budget Planning Calculator
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('impressum')}
                    aria-label="View legal notice and contact information"
                  >
                    Legal Notice (Impressum)
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleResourceLink('terms')}
                    aria-label="View terms and conditions"
                  >
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div>
                <h5 className="font-semibold mb-2">2026 Camp Season</h5>
                <p className="text-sm text-gray-400">Browse camps and contact them directly for current availability and offers.</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center space-x-8 text-sm text-gray-400">
                  <div>
                    <div className="text-2xl font-bold text-white">36</div>
                    <div>Organizations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">21</div>
                    <div>Countries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">€330+</div>
                    <div>Starting Price</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <h5
                  className="font-semibold mb-2 cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => setShowContactForm(true)}
                >
                  Contact & Support
                </h5>
                <p className="text-sm text-gray-400">Expert guidance for finding your perfect camp match</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2026 Camp Explorer Europe. Directory of European summer camps. Information compiled from public sources.</p>
            <p className="mt-2 text-sm">Directory featuring 36 verified organizations • Information from camp websites • Independent resource portal</p>
            <div className="mt-3 space-x-3 text-xs text-gray-500">
              <button 
                onClick={() => handleResourceLink('impressum')} 
                className="hover:text-gray-300 underline transition-colors"
                aria-label="View legal notice"
              >
                Legal Notice
              </button>
              <span>•</span>
              <button 
                onClick={() => handleResourceLink('terms')} 
                className="hover:text-gray-300 underline transition-colors"
                aria-label="View terms and conditions"
              >
                Terms
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveSection('privacy')}
                className="hover:text-gray-300 underline transition-colors"
                aria-label="View privacy policy"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveSection('about')}
                className="hover:text-gray-300 underline transition-colors"
                aria-label="Learn about Camp Explorer Europe"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </footer>
      </main>
      
      {/* GDPR-Compliant Cookie Banner - UX Optimized */}
      {showCookieBanner && (
        <div className="fixed top-14 sm:top-16 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg z-50 border-b-2 border-blue-600" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 id="cookie-title" className="font-semibold text-lg mb-2 flex items-center">
                <span className="mr-2">🍪</span>
                Help Us Improve Your Camp Discovery Experience
              </h3>
              <p id="cookie-description" className="text-blue-100 text-sm leading-relaxed">
                We use essential cookies to make our site work perfectly, plus analytics (Google Analytics & Vercel Analytics) to understand which camps families love most. 
                This helps us show you the most relevant options first! 
                <button 
                  onClick={() => setActiveSection('privacy')} 
                  className="underline text-white hover:text-blue-200 ml-1 font-medium"
                  aria-label="View our privacy policy"
                >
                  Learn more
                </button>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
              <Button 
                onClick={handleCookieReject}
                variant="outline"
                className="bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700 hover:border-blue-200 hover:text-white"
                aria-label="Use essential cookies only"
              >
                Essential Only
              </Button>
              <Button 
                onClick={handleCookieAccept}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
                aria-label="Accept all cookies to help us improve your experience"
              >
                Accept & Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Impressum (Legal Notice) Section - EU Legal Requirement */}
      {activeSection === 'impressum' && (
        <section id="impressum-content" className="py-12 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Notice (Impressum)</h1>
              <p className="text-xl text-gray-600">Legal information and contact details as required by EU law</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Website Owner & Responsible Party</h2>
                <div className="mb-4">
                  <p><strong>Business Name:</strong><br/>ResourceHub</p>
                  <p><strong>CVR Number:</strong><br/>46200462</p>
                  <p><strong>Country:</strong><br/>Denmark</p>
                  <p><strong>Email:</strong><br/>contact@europeansummercamps.com</p>
                  <p><strong>Website:</strong><br/>www.europeansummercamps.com</p>
                </div>
                <h3 className="text-xl font-semibold mb-3">Responsible for Content</h3>
                <div className="mb-4">
                  <p><strong>Organization:</strong><br/>ResourceHub (CVR: 46200462)</p>
                  <p><strong>Contact:</strong><br/>contact@europeansummercamps.com</p>
                </div>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Nature of Business</h2>
                <p className="mb-4">Camp Explorer Europe is an informational directory portal providing:</p>
                <ul className="mb-4">
                  <li>Comprehensive information about European summer camps</li>
                  <li>Independent research and camp comparisons</li>
                  <li>Links to official camp websites for direct booking</li>
                  <li>Educational content about summer camp selection</li>
                </ul>
                <p><strong>Important:</strong> We are not a booking agent or travel agency. All bookings are made directly with individual camp providers through their official websites.</p>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Liability for Content</h2>
                <p className="mb-4">The content of our pages has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. Camp information, pricing, and availability are subject to change by individual camp providers.</p>
                <p className="mb-4">As a service provider, we are liable for our own content on these pages according to general laws. However, we are not under obligation to monitor transmitted or stored third-party information or to investigate circumstances indicating illegal activity.</p>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Liability for Links</h2>
                <p className="mb-4">Our offer contains links to external third-party websites. We have no influence on the content of these websites, therefore we cannot assume liability for this external content. The respective provider or operator of the linked pages is always responsible for the content of the linked pages.</p>
                <p>The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a violation of law.</p>
              </Card>
              
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Copyright</h2>
                <p className="mb-4">The content and works on these pages created by the site operators are subject to copyright law. Duplication, processing, distribution, and any form of commercialization of such material beyond the scope of copyright law requires written consent from the author or creator.</p>
                <p>Insofar as the content on this site was not created by the operator, third-party copyrights are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon notification of violations, we will remove such content immediately.</p>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button onClick={() => handleNavigation('home')} className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Terms & Conditions Section - EU Electronic Commerce Requirement */}
      {activeSection === 'terms' && (
        <section id="terms-content" className="py-12 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
              <p className="text-xl text-gray-600">Terms of use for Camp Explorer Europe website</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">1. Nature of Service</h2>
                <p className="mb-4">Camp Explorer Europe is an informational directory portal. We provide:</p>
                <ul className="mb-4">
                  <li>Independent research and information about European summer camps</li>
                  <li>Comparative data to help families make informed decisions</li>
                  <li>Links to official camp websites for direct contact and booking</li>
                </ul>
                <p><strong>We are NOT:</strong> A booking agent, travel agency, or camp operator. We do not handle bookings, payments, or camp operations.</p>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">2. Information Accuracy</h2>
                <p className="mb-4">While we strive to provide accurate and up-to-date information:</p>
                <ul className="mb-4">
                  <li>Camp details, pricing, and availability may change without notice</li>
                  <li>Information is compiled from publicly available sources and camp websites</li>
                  <li>We recommend verifying all details directly with camp providers</li>
                  <li>We are not responsible for inaccuracies in third-party information</li>
                </ul>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
                <p className="mb-4">By using this website, you agree to:</p>
                <ul className="mb-4">
                  <li>Use the website for legitimate camp research purposes only</li>
                  <li>Not attempt to scrape, copy, or republish our content without permission</li>
                  <li>Respect intellectual property rights of camp providers and website content</li>
                  <li>Verify all information independently before making booking decisions</li>
                </ul>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
                <p className="mb-4">Camp Explorer Europe shall not be liable for:</p>
                <ul className="mb-4">
                  <li>Any direct or indirect damages arising from use of this website</li>
                  <li>Problems with camp bookings, services, or experiences</li>
                  <li>Inaccurate information provided by third-party camp operators</li>
                  <li>Technical issues, website downtime, or data loss</li>
                </ul>
                <p>All camp bookings and experiences are subject to the terms and conditions of individual camp providers.</p>
              </Card>
              
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">5. Privacy & Cookies</h2>
                <p className="mb-4">Our privacy practices are detailed in our Privacy Policy. By using this website, you consent to our cookie policy as described in the privacy section.</p>
              </Card>
              
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
                <p className="mb-4">We reserve the right to modify these terms at any time. Changes will be posted on this page. Continued use of the website constitutes acceptance of updated terms.</p>
                <p><strong>Last Updated:</strong> September 11, 2025</p>
                <p><strong>Contact:</strong><br/>contact@europeansummercamps.com</p>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button onClick={() => handleNavigation('home')} className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About Section - E-E-A-T Authority Building */}
      {activeSection === 'about' && (
        <section className="py-12 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Camp Explorer Europe</h1>
              <p className="text-xl text-gray-600">A comprehensive information directory for European summer camp research since 2025</p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Mission & Expertise */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Camp Explorer Europe is an information directory that compiles publicly available data about European summer camps. We organize camp information from websites and public sources to help parents research summer camp options across Europe.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Our directory includes 36 verified organizations offering 100+ programs across 21 countries, from Alpine programs in Switzerland to Nordic camps in Scandinavia. We compile information from camp websites and public sources to help parents research options.
                </p>
              </div>

              {/* Research Methodology & Authority */}
              <div className="mb-12 bg-gray-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Research Process</h2>
                <p className="text-lg text-gray-700 mb-6">
                  We gather information about camps from their official websites, public reviews, and available documentation. This information is presented for research purposes - parents should verify all details directly with camps.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Verification Standards</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Licensed operation and regulatory compliance</li>
                      <li>• Staff qualification and background verification</li>
                      <li>• Safety information as published by camps</li>
                      <li>• Insurance coverage and liability assessment</li>
                      <li>• Information about facilities and activities from camp materials</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Assessment</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Educational program structure and outcomes</li>
                      <li>• Age-appropriate activity development</li>
                      <li>• Multilingual support and cultural integration</li>
                      <li>• Nutrition and dietary accommodation standards</li>
                      <li>• Parent communication and feedback systems</li>
                    </ul>
                  </div>
                </div>

                <p className="text-lg text-gray-700">
                  We compile comprehensive information from camp websites, promotional materials, and published reviews to help parents make informed decisions about European summer camp options.
                </p>
              </div>

              {/* Team Expertise */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Expertise</h2>
                <p className="text-lg text-gray-700 mb-6">
                  We compile camp information to help parents research options. Choosing a summer camp is an important decision - we encourage thorough research and direct communication with camps about their specific programs, safety measures, and suitability for your child.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Areas of Specialization</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                    <div>
                      <strong>Geographic Expertise:</strong><br />
                      21 European countries, Nordic specialization, Alpine programs
                    </div>
                    <div>
                      <strong>Program Types:</strong><br />
                      Academic enrichment, language immersion, sports academies, outdoor adventures
                    </div>
                    <div>
                      <strong>Age Specialization:</strong><br />
                      Children (6-10), tweens (11-14), teenagers (15-18), family programs
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-700">
                  We research publicly available information about European camps and youth programs to keep our directory current. All safety standards and certifications mentioned are as reported by the camps themselves.
                </p>
              </div>

              {/* Commitment & Trust */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment to You</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Camp Explorer Europe operates as an independent information portal. We do not handle bookings, process payments, or receive commissions from camps. This independence ensures our recommendations remain unbiased and focused solely on quality and fit for your family.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-6 h-6 text-green-600 mr-3" />
                      Transparency Promise
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• All information sources clearly identified</li>
                      <li>• Regular content updates and accuracy checks</li>
                      <li>• Open about limitations and scope</li>
                      <li>• No hidden partnerships or paid placements</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-6 h-6 text-orange-600 mr-3" />
                      Important Disclaimer
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Information compiled from camp websites and public sources</li>
                      <li>• Please research individual camps to ensure they meet your family's needs</li>
                      <li>• We help parents discover options and provide helpful guidance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* European Focus & Cultural Understanding */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Europe for Summer Camps?</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Europe offers unparalleled opportunities for youth development through its rich cultural diversity, stunning natural environments, and centuries-old tradition of educational excellence. From the Swiss Alps to Nordic fjords, from ancient castles to modern innovation centers, European camps provide experiences impossible to replicate elsewhere.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Cultural Immersion</h4>
                    <p className="text-gray-600">Experience 21 countries, 25+ languages, and countless cultural traditions</p>
                  </div>
                  <div className="text-center p-4">
                    <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Educational Excellence</h4>
                    <p className="text-gray-600">World-class academic programs and innovative learning approaches</p>
                  </div>
                  <div className="text-center p-4">
                    <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Natural Beauty</h4>
                    <p className="text-gray-600">From Alpine peaks to Nordic wilderness, inspiring natural settings</p>
                  </div>
                </div>
              </div>

              {/* Contact & Transparency */}
              <div className="bg-gray-900 text-white p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-lg text-gray-300 mb-6">
                  Have questions about our methodology, need clarification on camp information, or want to suggest improvements to our directory? We welcome communication from parents, camp professionals, and industry experts.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">For Parents</h3>
                    <p className="text-gray-300 mb-4">
                      While we don't provide personalized camp recommendations, our comprehensive directory and filtering tools help you find programs matching your specific criteria.
                    </p>
                    <Button
                      onClick={() => {
                        setActiveSection('home')
                        setShowContactForm(true)
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Contact Our Team
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">For Camp Professionals</h3>
                    <p className="text-gray-300 mb-4">
                      Camp operators interested in consideration for inclusion should review our basic inclusion criteria for legitimate European youth programs.
                    </p>
                    <Button
                      onClick={() => {
                        setActiveSection('home')
                        setShowContactForm(true)
                      }}
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-gray-900"
                    >
                      Partnership Inquiries
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button onClick={() => setActiveSection('home')} className="bg-blue-600 hover:bg-blue-700">
                Return to Camp Directory
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setShowContactForm(false)}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 mx-4 sm:mx-auto sm:my-12 pb-safe">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Contact Portal Support</h2>
                  <p className="text-blue-100">Report issues, suggest camps, or provide feedback</p>
                </div>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-white hover:text-blue-200 transition-colors p-2"
                  aria-label="Close contact form"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 contact-modal-container">
              <form className="space-y-6" onSubmit={handleContactFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    How can we help you? *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Choose a topic...</option>
                    <option value="website-issue">Report a website issue or broken link</option>
                    <option value="partnership">Partnership Inquiries</option>
                    <option value="media-inquiry">Media or press inquiry</option>
                    <option value="general-portal">General portal feedback</option>
                    <option value="missing-camp">Suggest a camp to add</option>
                    <option value="data-correction">Report incorrect camp information</option>
                    <option value="other">Other inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Age (if applicable)
                  </label>
                  <input
                    type="number"
                    id="childAge"
                    name="childAge"
                    min="3"
                    max="18"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Age of child attending camp"
                  />
                </div>

                <div>
                  <label htmlFor="preferredCountries" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Countries/Regions
                  </label>
                  <input
                    type="text"
                    id="preferredCountries"
                    name="preferredCountries"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Switzerland, Nordic countries, anywhere in Europe"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us more about what you're looking for *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Please describe your specific needs, interests, or questions. The more details you provide, the better we can help you find the perfect camp match!"
                    required
                  ></textarea>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy-agreement"
                    className="mt-1 w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="privacy-agreement" className="text-sm text-gray-600">
                    I understand this is an information portal that provides links to camp websites.
                    I agree that my inquiry will be processed according to our Privacy Policy.
                    We do not handle bookings or provide personalized recommendations.
                    See our <button type="button" className="text-blue-600 hover:text-blue-800 underline" onClick={() => {setShowContactForm(false); setActiveSection('privacy')}}>Privacy Policy</button> for details.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmittingForm}
                    className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
                      formSubmitted
                        ? 'bg-green-600 hover:bg-green-600 text-white'
                        : isSubmittingForm
                        ? 'bg-gray-400 hover:bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
                    }`}
                  >
                    {formSubmitted
                      ? '✓ Message Sent!'
                      : isSubmittingForm
                      ? 'Sending...'
                      : 'Send Message'
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About Our Portal</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">We are an information directory listing European summer camps based on publicly available information.</p>
                    <p><strong>What we provide:</strong> Camp information, website links, and category organization</p>
                    <p><strong>What we don't handle:</strong> Bookings, personalized recommendations, or camp consultations</p>
                    <p className="italic">For specific camp inquiries, please visit the camp's official website directly.</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Portal maintenance inquiries are reviewed regularly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button - Mobile Optimized */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 mobile-button touch-target"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Conditional Analytics - Only load if consent given */}
      {cookieConsent === true && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </div>
  )
}

export default App

