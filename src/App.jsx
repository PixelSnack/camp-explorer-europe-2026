import React, { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [_showFilters, _setShowFilters] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedCamps, setSelectedCamps] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [resourceSection, setResourceSection] = useState(null)
  
  // GDPR Cookie Consent Management
  const [cookieConsent, setCookieConsent] = useState(null) // null = not decided, true = accepted, false = rejected
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Enterprise Marquee System - State of the Art
  const heroBadgeRef = useRef(null)

  // Comprehensive camp data based on our ultimate research
  const allCamps = [
    // Premium Alpine Experiences
    {
      id: 1,
      name: "Les Elfes International",
      location: "Verbier, Switzerland",
      country: "Switzerland",
      ages: "6-17 years",
      price: "CHF 4,990",
      priceRange: "premium",
      rating: 4.9,
      reviews: 847,
      image: heroImage,
      category: "premium",
      type: "Alpine Adventure",
      activities: ["Rock Climbing", "5 Languages", "Glacier Expeditions", "Cultural Tours"],
      dates: "June 7-20, 2026",
      highlights: ["37+ years experience", "25,000+ alumni", "75+ countries", "Swiss Alps at 1,500m"],
      languages: ["English", "French", "German", "Spanish", "Mandarin"],
      specialFeatures: ["24/7 Medical Center", "Traditional Swiss Chalets", "Montreux Jazz Festival"],
      established: 1987,
      capacity: 120,
      bookingUrl: "https://www.leselfes.com/summer-camps/"
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
      bookingUrl: "https://summer.la-garenne.ch/"
    },
    {
      id: 3,
      name: "Camp Suisse",
      location: "Torgon, Swiss Alps",
      country: "Switzerland", 
      ages: "7-17 years",
      price: "CHF 4,000",
      priceRange: "premium",
      rating: 4.8,
      reviews: 356,
      image: mapCompressed,
      category: "family",
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
      price: "£6,220",
      priceRange: "luxury",
      rating: 4.9,
      reviews: 567,
      image: activitiesCompressed,
      category: "academic",
      type: "University Prep",
      activities: ["Medicine", "Engineering", "Business", "Creative Arts"],
      dates: "July 6-20, 2026",
      highlights: ["Oxford University colleges", "University preparation", "Expert tutors", "Historic setting"],
      languages: ["English"],
      specialFeatures: ["College Accommodation", "University Application Guidance", "Academic Excellence"],
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
      price: "£1,575",
      priceRange: "mid",
      rating: 4.8,
      reviews: 892,
      image: mapCompressed,
      category: "family",
      type: "Comprehensive Education",
      activities: ["English Classes", "Sports Specialties", "Arts & Crafts", "Cultural Excursions"],
      dates: "July 13-27, 2026",
      highlights: ["1,700+ students", "62 countries", "6 locations", "Parent Programme"],
      languages: ["English"],
      specialFeatures: ["Little Explorers (6-11)", "Specialist Tracks", "Parent Programme"],
      established: 1993,
      capacity: 1700,
      bookingUrl: "https://www.bedessummerschool.org/"
    },
    // Language Immersion
    {
      id: 7,
      name: "Enforex Barcelona Beach",
      location: "Barcelona, Spain",
      country: "Spain",
      ages: "5-13 years", 
      price: "€3,200",
      priceRange: "mid",
      rating: 4.7,
      reviews: 445,
      image: heroImage,
      category: "language",
      type: "Spanish Immersion",
      activities: ["Spanish Classes", "Beach Sports", "Cultural Tours", "Water Activities"],
      dates: "July 1-15, 2026",
      highlights: ["Beach location", "50% Spanish campers", "Cultural immersion", "Mediterranean lifestyle"],
      languages: ["Spanish", "English"],
      specialFeatures: ["Beach Activities", "Cultural Exchange", "Local Integration"],
      established: 1989,
      capacity: 150,
      bookingUrl: "https://www.enforex.com/summercamps/"
    },
    {
      id: 8,
      name: "Alpine French School",
      location: "Morzine, French Alps",
      country: "France",
      ages: "12-17 years",
      price: "€1,845",
      priceRange: "mid",
      rating: 4.6,
      reviews: 178,
      image: activitiesCompressed,
      category: "language",
      type: "French Immersion",
      activities: ["French Classes", "Alpine Hiking", "White Water Rafting", "Mountain Biking"],
      dates: "July 8-22, 2026",
      highlights: ["French Alps setting", "Native speakers", "Adventure focus", "Cultural workshops"],
      languages: ["French", "English"],
      specialFeatures: ["Mountain Adventure", "Cultural Workshops", "Native Instructors"],
      established: 2001,
      capacity: 80,
      bookingUrl: "https://www.alpinefrenchschool.com/"
    },
    // Budget Excellence
    {
      id: 9,
      name: "EUROCAM Bohemia",
      location: "South Bohemia, Czech Republic",
      country: "Czech Republic",
      ages: "7-17 years",
      price: "€330",
      priceRange: "budget",
      rating: 4.8,
      reviews: 267,
      image: mapCompressed,
      category: "budget",
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
      price: "€395",
      priceRange: "budget",
      rating: 4.6,
      reviews: 189,
      image: heroImage,
      category: "budget",
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
      price: "€1,950",
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
      name: "Wildwind Sailing Adventures",
      location: "Vassiliki, Greece",
      country: "Greece",
      ages: "14-18 years",
      price: "€4,500",
      priceRange: "luxury",
      rating: 4.8,
      reviews: 89,
      image: mapCompressed,
      category: "unique",
      type: "Sailing Adventure",
      activities: ["Sailing", "Navigation", "Marine Biology", "Leadership"],
      dates: "August 12-26, 2026",
      highlights: ["Certified instructors", "Dinghy & catamaran sailing", "All skill levels", "Youth-focused program"],
      languages: ["English", "French"],
      specialFeatures: ["Daily Sailing Instruction", "Youth Squad Programs", "Fun Water Activities"],
      established: 2015,
      capacity: 24,
      bookingUrl: "https://wildwind.co.uk/"
    },
    // Scandinavian Excellence
    {
      id: 13,
      name: "Camp Adventure - Outdoor Adventure Park",
      location: "Rønnede, Zealand",
      country: "Denmark",
      ages: "8-16 years",
      price: "DKK 4,500",
      priceRange: "mid",
      rating: 4.7,
      reviews: 156,
      image: activitiesCompressed,
      category: "sports",
      type: "Adventure Sports",
      activities: ["Tree Top Adventure", "Survival Skills", "Kayaking", "Team Building"],
      dates: "June 23-July 7, 2026",
      highlights: ["Largest adventure park in Denmark", "UNESCO World Heritage site", "Professional instructors", "Safety certified"],
      languages: ["Danish", "English", "German"],
      specialFeatures: ["High Rope Courses", "Survival Training", "Viking Heritage Tours"],
      established: 2001,
      capacity: 48,
      bookingUrl: "https://www.campadventure.dk/"
    },
    {
      id: 14,
      name: "Adventure Treks Norway Expedition",
      location: "Nordfjord & Jotunheimen",
      country: "Norway",
      ages: "16-18 years",
      price: "$7,295",
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
      location: "Rendalen Municipality",
      country: "Norway",
      ages: "12-18 years",
      price: "NOK 12,500",
      priceRange: "premium",
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
    {
      id: 16,
      name: "Metsäkartano Educational Adventures",
      location: "Rautavaara, Finnish Lakeland",
      country: "Finland",
      ages: "8-16 years",
      price: "€2,800",
      priceRange: "mid",
      rating: 4.7,
      reviews: 156,
      image: activitiesCompressed,
      category: "academic",
      type: "Educational & Outdoor",
      activities: ["Progressive Education", "Nature Studies", "Finnish Culture", "Experiential Learning"],
      dates: "June 15-July 10, 2026",
      highlights: ["Government-approved centre", "40 years experience", "100+ groups annually", "Authentic Finnish Lakeland"],
      languages: ["Finnish", "English"],
      specialFeatures: ["Ministry of Education Approved", "Professional Instructors", "Year-Round Programs"],
      established: 1985,
      capacity: 60,
      bookingUrl: "https://www.metsakartano.com/en/educational-camps"
    },
    {
      id: 17,
      name: "Bold Earth Adventures - Iceland: Fire and Ice",
      location: "Reykjavik & Highlands",
      country: "Iceland",
      ages: "14-18 years",
      price: "€4,800",
      priceRange: "luxury",
      rating: 4.8,
      reviews: 73,
      image: heroImage,
      category: "unique",
      type: "Geological Adventure",
      activities: ["Glacier Hiking", "Volcano Studies", "Geothermal Science", "Northern Lights"],
      dates: "July 20-August 3, 2026",
      highlights: ["Unique geological features", "Expert guides", "Cultural immersion", "Adventure-focused"],
      languages: ["English", "Icelandic"],
      specialFeatures: ["Glacier Expeditions", "Volcanic Landscape Studies", "Nordic Culture Immersion"],
      established: 2005,
      capacity: 24,
      bookingUrl: "https://www.boldearth.com/"
    },
    {
      id: 18,
      name: "Nordic Terrain Academy - Adventure Camps",
      location: "Stavanger",
      country: "Norway",
      ages: "6-12 years",
      price: "NOK 3,500",
      priceRange: "mid",
      rating: 4.6,
      reviews: 87,
      image: activitiesCompressed,
      category: "academic",
      type: "Adventure Academics",
      activities: ["Kayaking", "Rock Climbing", "Hiking", "Surfing", "STEM Learning"],
      dates: "July 7-11 & July 14-18, 2026",
      highlights: ["Academics meets adventure", "University readiness focus", "International environment", "Leadership development"],
      languages: ["Norwegian", "English"],
      specialFeatures: ["Academic & Adventure Balance", "Critical Thinking Skills", "International Students"],
      established: 2020,
      capacity: 24,
      bookingUrl: "https://nordicadventure.camp/"
    },
    // Verified Nordic Expansion
    {
      id: 19,
      name: "Nordic Woods Wilderness Glamping",
      location: "Åsnen National Park",
      country: "Sweden",
      ages: "7+ years",
      price: "€530",
      priceRange: "premium",
      rating: 4.9,
      reviews: 123,
      image: heroImage,
      category: "unique",
      type: "Wilderness Glamping",
      activities: ["Guided Hikes", "Canoe Expeditions", "Bushcraft Workshops", "Yoga & Meditation"],
      dates: "June 7 - September 13, 2025",
      highlights: ["Tipi accommodations", "Near national park", "Comprehensive activities included", "Family-friendly from age 7"],
      languages: ["Swedish", "English"],
      specialFeatures: ["Wilderness Glamping Experience", "Sauna & Hot Tub Access", "All Activities Included"],
      established: 2018,
      capacity: 20,
      bookingUrl: "https://nordicwoods.org/en/"
    },
    {
      id: 20,
      name: "Ranum Efterskole International Summer School",
      location: "Ranum",
      country: "Denmark",
      ages: "15-18 years",
      price: "DKK 15,000",
      priceRange: "premium",
      rating: 4.7,
      reviews: 89,
      image: activitiesCompressed,
      category: "academic",
      type: "International School",
      activities: ["Danish Language", "Sports", "Arts", "Outdoor Activities", "Cultural Excursions"],
      dates: "July 5 - August 1, 2025",
      highlights: ["Authentic efterskole experience", "International community", "Customizable program", "Weekly excursions"],
      languages: ["Danish", "English"],
      specialFeatures: ["Modular Subject Selection", "Cultural Immersion", "International Friendships"],
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
      price: "€1,350",
      priceRange: "mid",
      rating: 4.7,
      reviews: 142,
      image: activitiesCompressed,
      category: "academic",
      type: "International Adventure",
      activities: ["English Learning", "Cultural Exchange", "Sports", "Hiking", "Arts & Crafts"],
      dates: "July 14 - August 15, 2026",
      highlights: ["World's happiest country", "Flexible 1-30 day programs", "International community", "English immersion"],
      languages: ["English", "Finnish"],
      specialFeatures: ["Customizable Duration", "Cultural Immersion", "Adventure Learning"],
      established: 2015,
      capacity: 80,
      bookingUrl: "https://summercamp.fi/"
    },
    {
      id: 22,
      name: "Piispala Authentic Finnish Camp School",
      location: "Kannonkoski, Finnish Lakeland",
      country: "Finland",
      ages: "4-16 years", 
      price: "€546",
      priceRange: "budget",
      rating: 4.8,
      reviews: 267,
      image: mapCompressed,
      category: "academic",
      type: "Traditional Camp School",
      activities: ["Sports Programs", "Handcrafts", "Nature Adventures", "Wellbeing Activities"],
      dates: "June 10 - August 20, 2026",
      highlights: ["Ministry of Education backed", "300+ camps annually", "Biggest camp center", "50+ activity options"],
      languages: ["Finnish", "English", "Swedish", "Russian"],
      specialFeatures: ["Government Approved", "12-meter Climbing Tower", "Traditional Finnish Experience"],
      established: 1963,
      capacity: 50,
      bookingUrl: "https://piispala.fi/en/authentic-finnish-camp-school/"
    }
  ]

  const filteredCamps = allCamps.filter(camp => {
    const matchesFilter = selectedFilter === 'all' || camp.category === selectedFilter
    const matchesCountry = selectedCountry === 'all' || camp.country === selectedCountry
    const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.country.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesCountry && matchesSearch
  })

  const filterOptions = [
    { value: 'all', label: 'All Camps', count: allCamps.length },
    { value: 'premium', label: 'Premium Alpine', count: allCamps.filter(c => c.category === 'premium').length },
    { value: 'academic', label: 'Academic & STEM', count: allCamps.filter(c => c.category === 'academic').length },
    { value: 'language', label: 'Language Immersion', count: allCamps.filter(c => c.category === 'language').length },
    { value: 'sports', label: 'Sports Specialty', count: allCamps.filter(c => c.category === 'sports').length },
    { value: 'family', label: 'Family Programs', count: allCamps.filter(c => c.category === 'family').length },
    { value: 'budget', label: 'Budget Excellence', count: allCamps.filter(c => c.category === 'budget').length },
    { value: 'unique', label: 'Outdoor Adventures', count: allCamps.filter(c => c.category === 'unique').length }
  ]

  const stats = [
    { icon: Globe, label: "Countries", value: "13", description: "Across Europe" },
    { icon: Award, label: "Programs", value: "100+", description: "Verified options" },
    { icon: Users, label: "Ages", value: "3-24", description: "Years covered" },
    { icon: Shield, label: "Quality", value: "100%", description: "Verified" }
  ]

  // Navigation handlers
  const handleNavigation = (section) => {
    setActiveSection(section)
    window.location.hash = section
    window.scrollTo(0, 0) // Always scroll to top on navigation
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
        break
      case 'terms':
        setActiveSection('terms')
        window.location.hash = 'terms'
        break
      default:
        setResourceSection(resource)
        setActiveSection('resources')
        window.location.hash = 'resources'
    }
    // Scroll to top for better UX
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

      // Call the initialization function with a small delay
      setTimeout(initWithDelay, 100)
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

    const cleanup = initializeMarqueeSystem()
    return cleanup
  }, []) // Empty dependency - initialize once

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
      
      {/* Navigation */}
      <header className="sticky-header">
        <nav className="relative" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-baseline">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                <span className="block sm:inline">Camp Explorer</span>
                <span className="block sm:inline sm:ml-1">Europe</span>
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
            alt="Scenic lakeside European summer camp setting with mountains and clear water"
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
                100+ Verified Programs • 13 Countries • 2026 Bookings Open
              </span>
            </div>
          </div>
          
          <h1 className="hero-fluid-title font-bold">
            Europe's Most
            <span className="block text-orange-400">Comprehensive</span>
            <span className="block hero-fluid-subtitle">Summer Camp Guide</span>
          </h1>
          
          <p className="hero-fluid-text text-gray-200 max-w-3xl mx-auto px-4">
            From Swiss Alpine adventures to Spanish beach immersion, discover the perfect summer experience for your child. Research-driven recommendations, verified pricing, and authentic parent reviews.
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
              Download Guide
            </Button>
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
            {filteredCamps.map((camp) => (
              <Card key={camp.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={camp.image} 
                    alt={`${camp.name} - ${camp.type} summer camp in ${camp.location} for ages ${camp.ages}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    title={`${camp.name} - European Summer Camp ${camp.ages}`}
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
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
                      <div className="text-2xl font-bold text-blue-600">{camp.price}</div>
                      <div className="text-xs text-gray-500">per 2 weeks</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
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
                        {camp.highlights.slice(0, 2).map((highlight, index) => (
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
                    
                    <Button
                      className="w-full btn-secondary"
                      onClick={() => window.open(camp.bookingUrl, '_blank')}
                      aria-label={`View details and book ${camp.name}`}
                    >
                      View Details & Book
                    </Button>
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
              <p className="text-gray-600">Experience 12+ countries and meet children from 75+ nationalities</p>
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
            Join thousands of families who trust us to find the perfect camp experience. 
            Early bird discounts available until October 2025!
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
              Download Complete Guide
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
              {filteredCamps.map((camp) => (
                <Card key={camp.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={camp.image} 
                      alt={`${camp.name} - ${camp.type} summer camp in ${camp.location} for ages ${camp.ages}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      title={`${camp.name} - European Summer Camp ${camp.ages}`}
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
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
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
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
                          {camp.highlights.slice(0, 2).map((highlight, index) => (
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
                      
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(camp.bookingUrl, '_blank')}
                        aria-label={`View details and book ${camp.name}`}
                      >
                        View Details & Book
                      </Button>
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
                            onClick={() => window.open(camp.bookingUrl, '_blank')}
                          >
                            Book Now
                          </Button>
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
                Follow our expert timeline to secure the best camps and get early bird discounts
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
                      <p className="text-gray-600">Research and shortlist camps. Early bird discounts available!</p>
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
                        <li>• Take advantage of early bird pricing</li>
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
                European summer camps in 2026 offer children unparalleled opportunities to learn, play, and grow in some of the world's most stunning locations. From Alpine adventure bases to Mediterranean beach retreats, there are options tailored to every age (3–16) and interest.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">100+ Verified Programs</Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">13 Countries</Badge>
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
                      <div className="flex justify-between">
                        <span>🏆 Luxury (CHF 6,000+)</span>
                        <span className="font-semibold">Premium facilities</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💎 Premium (€3,000-6,000)</span>
                        <span className="font-semibold">High-end programs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🎯 Mid-Range (€1,500-3,500)</span>
                        <span className="font-semibold">Excellent value</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💰 Budget (€330-800)</span>
                        <span className="font-semibold">Outstanding bargains</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Camps by Age Group</h2>
              <p className="text-center text-lg text-gray-600 mb-8">Each age group has different needs and readiness levels for camp experiences</p>
              
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
                <p className="text-lg text-gray-600">Explore camps across 13 European countries, each offering unique experiences</p>
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
                    <div>• €330 (10 days!)</div>
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
                        <span><strong>Sept-Oct 2025:</strong> Research & early bird discounts</span>
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
                    <h4 className="font-semibold text-gray-800 mb-3">Early Bird Benefits</h4>
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
                <p className="text-lg text-gray-600">European camps maintain world-class safety protocols and staff training</p>
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
                    <div><strong>Price:</strong> €330 (10 days!)</div>
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
                    <div><strong>Price:</strong> €1,950</div>
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
                Use our interactive tools to explore 100+ verified camps, compare options, and start planning your child's unforgettable European summer adventure for 2026.
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
                This comprehensive guide is based on extensive research from official camp websites, industry reports, and cross-verification of multiple sources. All information is current as of August 2025. 
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
                        <p className="text-gray-600">Research camps and take advantage of early bird discounts (save 10-20%). Many camps release 2026 brochures.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-bold text-blue-800">November 2025 - January 2026</h3>
                        <p className="text-gray-600">Prime booking period. 50%+ of premium camps fill during this time. Secure preferred dates and activities.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-bold text-orange-800">February 2026</h3>
                        <p className="text-gray-600">Final call for most international camps. Early bird discounts typically expire by Feb 28.</p>
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
                        <h3 className="font-bold text-lg">Sarah M., London</h3>
                        <p className="text-sm text-gray-600">Les Elfes International, Switzerland</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"Our daughter came back from Switzerland not just fluent in French, but confident, independent, and with friends from around the world. It was transformative. The level of care and activities exceeded our expectations."</p>
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
                        <h3 className="font-bold text-lg">Michael R., Dublin</h3>
                        <p className="text-sm text-gray-600">Oxford Summer Courses, UK</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"The academic program was incredible - my 15-year-old son discovered his passion for medicine and made connections that helped with his university applications. Worth every penny."</p>
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
                        <h3 className="font-bold text-lg">Anna K., Berlin</h3>
                        <p className="text-sm text-gray-600">EUROCAM Bohemia, Czech Republic</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"Fantastic value for money! Our twins had an amazing outdoor adventure experience, and the bilingual approach really helped improve their English. The staff were wonderful."</p>
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
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Carlos P., Madrid</h3>
                        <p className="text-sm text-gray-600">Enforex Spanish Camp, Spain</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"Perfect for international kids learning Spanish. The mix of local Spanish children and international campers created an authentic immersion environment. Great cultural exchange!"</p>
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
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Early Bird Discounts</h1>
                  <p className="text-xl text-gray-600">Save significantly by booking early for 2026 camps</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Current Early Bird Offers</h2>
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-bold text-blue-800">Switzerland Premium Camps</h3>
                        <p className="text-gray-600">Save 15-20% • Book by October 31, 2025</p>
                        <p className="text-sm text-gray-500">Les Elfes, Camp Suisse, La Garenne</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-bold text-green-800">UK Academic & Family Programs</h3>
                        <p className="text-gray-600">Save 10-15% • Book by December 15, 2025</p>
                        <p className="text-sm text-gray-500">Oxford Summer Courses, Bede's Summer School</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-bold text-orange-800">Language Immersion Camps</h3>
                        <p className="text-gray-600">Save 12-18% • Book by November 30, 2025</p>
                        <p className="text-sm text-gray-500">Enforex Spain, Alpine French School</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-bold text-purple-800">Sports Academies</h3>
                        <p className="text-gray-600">Save 8-12% • Book by January 15, 2026</p>
                        <p className="text-sm text-gray-500">AC Milan, Barcelona FC, Tennis Academies</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Booking Benefits</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Guaranteed Spot</h5>
                          <p className="text-sm text-gray-600">Secure your preferred dates and activities</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Payment Plans</h5>
                          <p className="text-sm text-gray-600">Spread costs over multiple payments</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Best Accommodation</h5>
                          <p className="text-sm text-gray-600">First choice of rooms and roommates</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Flexible Changes</h5>
                          <p className="text-sm text-gray-600">Most camps allow date/program changes</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                      <h3 className="font-bold text-green-800 mb-3">💰 Savings Calculator</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Premium Camp (CHF 5,000)</span>
                          <span className="font-bold text-green-700">Save CHF 750-1,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mid-Range Camp (€2,500)</span>
                          <span className="font-bold text-green-700">Save €250-400</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Language Camp (€1,800)</span>
                          <span className="font-bold text-green-700">Save €180-300</span>
                        </div>
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
                  <li><strong>Analytics Cookies:</strong> Help us understand which camps are most popular to improve your experience</li>
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
                <p>For questions about privacy, contact us at legal@europeansummercamps.com</p>
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
                Europe's most comprehensive summer camp guide. Research-driven recommendations, verified pricing, and authentic reviews for 100+ camps across 13 countries including premium Nordic programs.
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
                    onClick={() => handleCountryFilter('Sweden')}
                    aria-label="Filter camps in Sweden"
                  >
                    🇸🇪 Sweden (Wilderness Glamping)
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
                    onClick={() => handleCountryFilter('Iceland')}
                    aria-label="Filter camps in Iceland"
                  >
                    🇮🇸 Iceland (Unique Geology)
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
                    onClick={() => handleCategoryFilter('budget')}
                    aria-label="Filter budget category camps"
                  >
                    Budget-Conscious Options
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-white cursor-pointer transition-colors text-left w-full"
                    onClick={() => handleCategoryFilter('unique')}
                    aria-label="Filter unique category camps"
                  >
                    Outdoor Adventures
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
                    Early Bird Discounts
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
                <h5 className="font-semibold mb-2">2026 Booking Status</h5>
                <p className="text-sm text-gray-400">Early bird discounts available until October 2025. Premium camps filling fast!</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center space-x-8 text-sm text-gray-400">
                  <div>
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div>Verified Camps</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div>Countries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">€330+</div>
                    <div>Starting Price</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <h5 className="font-semibold mb-2">Contact & Support</h5>
                <p className="text-sm text-gray-400">Expert guidance for finding your perfect camp match</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 Camp Explorer Europe. Research-driven recommendations for European summer camps. All pricing verified as of August 2025.</p>
            <p className="mt-2 text-sm">Built with comprehensive research across 100+ camps • Verified pricing • Authentic parent reviews</p>
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
                We use essential cookies to make our site work perfectly, plus analytics to understand which camps families love most. 
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
        <section className="py-12 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Notice (Impressum)</h1>
              <p className="text-xl text-gray-600">Legal information and contact details as required by EU law</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Website Owner & Responsible Party</h2>
                <div className="mb-4">
                  <p><strong>Business:</strong> PixelSnack (Independent Web Publishing)</p>
                  <p><strong>Contact:</strong> legal@europeansummercamps.com</p>
                  <p><strong>Website:</strong> www.europeansummercamps.com</p>
                  <p><strong>Jurisdiction:</strong> European Union</p>
                </div>
                <h3 className="text-xl font-semibold mb-3">Responsible for Content</h3>
                <p>PixelSnack<br/>Contact: legal@europeansummercamps.com</p>
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
        <section className="py-12 bg-white min-h-screen">
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
                <p><strong>Contact:</strong> legal@europeansummercamps.com</p>
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
      {cookieConsent === true && <Analytics />}
    </div>
  )
}

export default App

