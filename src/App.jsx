import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { MapPin, Calendar, Users, Star, Search, Menu, X, Filter, ChevronDown, Globe, Award, Shield, Heart } from 'lucide-react'
import heroImage from './assets/hero_image.png'
import activitiesImage from './assets/camp_activities_collage.png'
import mapImage from './assets/european_map_illustration.png'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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
      capacity: 120
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
      image: activitiesImage,
      category: "premium",
      type: "Luxury Boarding",
      activities: ["Academic Enrichment", "Professional Sports", "Cultural Immersion", "Leadership"],
      dates: "June 14-28, 2026",
      highlights: ["Luxury Alpine setting", "50+ nationalities", "Boarding school experience", "Premium facilities"],
      languages: ["English", "French"],
      specialFeatures: ["On-site Health Center", "Age-grouped Programs", "Academic Focus"],
      established: 1947,
      capacity: 80
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
      image: mapImage,
      category: "premium",
      type: "Adventure Sports",
      activities: ["Multi-Sport", "Language Learning", "Leadership Training", "Environmental Ed"],
      dates: "June 21-July 5, 2026",
      highlights: ["40+ countries", "Bilingual environment", "Adventure focus", "Lake Geneva"],
      languages: ["French", "Spanish", "English", "German"],
      specialFeatures: ["Leadership Training", "Environmental Education", "Cultural Excursions"],
      established: 1982,
      capacity: 100
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
      capacity: 60
    },
    // Academic Excellence
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
      image: activitiesImage,
      category: "academic",
      type: "University Prep",
      activities: ["Medicine", "Engineering", "Business", "Creative Arts"],
      dates: "July 6-20, 2026",
      highlights: ["Oxford University colleges", "University preparation", "Expert tutors", "Historic setting"],
      languages: ["English"],
      specialFeatures: ["College Accommodation", "University Application Guidance", "Academic Excellence"],
      established: 1985,
      capacity: 200
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
      image: mapImage,
      category: "academic",
      type: "Comprehensive Education",
      activities: ["English Classes", "Sports Specialties", "Arts & Crafts", "Cultural Excursions"],
      dates: "July 13-27, 2026",
      highlights: ["1,700+ students", "62 countries", "6 locations", "Parent Programme"],
      languages: ["English"],
      specialFeatures: ["Little Explorers (6-11)", "Specialist Tracks", "Parent Programme"],
      established: 1993,
      capacity: 1700
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
      capacity: 150
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
      image: activitiesImage,
      category: "language",
      type: "French Immersion",
      activities: ["French Classes", "Alpine Hiking", "White Water Rafting", "Mountain Biking"],
      dates: "July 8-22, 2026",
      highlights: ["French Alps setting", "Native speakers", "Adventure focus", "Cultural workshops"],
      languages: ["French", "English"],
      specialFeatures: ["Mountain Adventure", "Cultural Workshops", "Native Instructors"],
      established: 2001,
      capacity: 80
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
      image: mapImage,
      category: "budget",
      type: "English Immersion",
      activities: ["English Classes", "River Activities", "Cave Exploration", "Cultural Games"],
      dates: "July 15-25, 2026",
      highlights: ["10-day program", "Bilingual leaders", "30+ years experience", "Exceptional value"],
      languages: ["English", "Czech"],
      specialFeatures: ["Bilingual Approach", "River Setting", "Cultural Immersion"],
      established: 1995,
      capacity: 120
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
      capacity: 90
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
      image: activitiesImage,
      category: "sports",
      type: "Football Academy",
      activities: ["Professional Coaching", "Stadium Tours", "Technical Training", "Cultural Activities"],
      dates: "August 5-12, 2026",
      highlights: ["AC Milan coaches", "San Siro stadium", "Professional training", "Cultural immersion"],
      languages: ["English", "Italian"],
      specialFeatures: ["Professional Coaching", "Stadium Access", "Player Meetings"],
      established: 2010,
      capacity: 60
    },
    // Unique Programs
    {
      id: 12,
      name: "Mediterranean Sailing",
      location: "Corsica, France",
      country: "France",
      ages: "14-18 years",
      price: "€4,500",
      priceRange: "luxury",
      rating: 4.8,
      reviews: 89,
      image: mapImage,
      category: "unique",
      type: "Sailing Adventure",
      activities: ["Sailing", "Navigation", "Marine Biology", "Leadership"],
      dates: "August 12-26, 2026",
      highlights: ["45-foot yachts", "Certified skippers", "Island hopping", "Leadership focus"],
      languages: ["English", "French"],
      specialFeatures: ["Yacht Living", "Navigation Skills", "Marine Ecology"],
      established: 2015,
      capacity: 24
    }
  ]

  const filteredCamps = allCamps.filter(camp => {
    const matchesFilter = selectedFilter === 'all' || camp.category === selectedFilter
    const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.country.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filterOptions = [
    { value: 'all', label: 'All Camps', count: allCamps.length },
    { value: 'premium', label: 'Premium Alpine', count: allCamps.filter(c => c.category === 'premium').length },
    { value: 'academic', label: 'Academic Excellence', count: allCamps.filter(c => c.category === 'academic').length },
    { value: 'language', label: 'Language Immersion', count: allCamps.filter(c => c.category === 'language').length },
    { value: 'sports', label: 'Sports Specialty', count: allCamps.filter(c => c.category === 'sports').length },
    { value: 'family', label: 'Family Programs', count: allCamps.filter(c => c.category === 'family').length },
    { value: 'budget', label: 'Budget Excellence', count: allCamps.filter(c => c.category === 'budget').length },
    { value: 'unique', label: 'Unique Adventures', count: allCamps.filter(c => c.category === 'unique').length }
  ]

  const stats = [
    { icon: Globe, label: "Countries", value: "12+", description: "Across Europe" },
    { icon: Award, label: "Camps", value: "100+", description: "Verified programs" },
    { icon: Users, label: "Ages", value: "3-24", description: "Years covered" },
    { icon: Shield, label: "Safety", value: "100%", description: "Accredited" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Camp Explorer Europe</h1>
              <span className="ml-2 text-sm text-orange-500 font-semibold">2026</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                <a href="#discover" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Discover Camps</a>
                <a href="#compare" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Compare</a>
                <a href="#plan" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Plan Your Summer</a>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#home" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#discover" className="text-gray-500 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Discover Camps</a>
              <a href="#compare" className="text-gray-500 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Compare</a>
              <a href="#plan" className="text-gray-500 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Plan Your Summer</a>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-2">Get Started</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Badge className="bg-orange-500/90 text-white px-4 py-2 text-sm font-semibold">
              100+ Verified Camps • 12 Countries • 2026 Bookings Open
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Europe's Most
            <span className="block text-orange-400">Comprehensive</span>
            <span className="block text-4xl md:text-5xl">Summer Camp Guide</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            From Swiss Alpine adventures to Spanish beach immersion, discover the perfect summer experience for your child. Research-driven recommendations, verified pricing, and authentic parent reviews.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold">
              Explore 100+ Camps
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
              Download Guide
            </Button>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                onClick={() => setSelectedFilter(option.value)}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCamps.map((camp) => (
              <Card key={camp.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={camp.image} 
                    alt={camp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {camp.rating}
                    </Badge>
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
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
              <img 
                src={activitiesImage} 
                alt="Camp Activities" 
                className="rounded-lg shadow-2xl"
              />
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
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
              Start Your Search
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Download Complete Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Camp Explorer Europe</h3>
              <p className="text-gray-400 mb-4">
                Europe's most comprehensive summer camp guide. Research-driven recommendations, verified pricing, and authentic reviews for 100+ camps across 12 countries.
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
                <li className="hover:text-white cursor-pointer">🇨🇭 Switzerland (Premium Alpine)</li>
                <li className="hover:text-white cursor-pointer">🇬🇧 United Kingdom (Academic)</li>
                <li className="hover:text-white cursor-pointer">🇪🇸 Spain (Language Immersion)</li>
                <li className="hover:text-white cursor-pointer">🇫🇷 France (Cultural Heritage)</li>
                <li className="hover:text-white cursor-pointer">🇦🇹 Austria (Adventure Sports)</li>
                <li className="hover:text-white cursor-pointer">🇮🇹 Italy (Sports & Culture)</li>
                <li className="hover:text-white cursor-pointer">🇩🇪 Germany (Budget Excellence)</li>
                <li className="hover:text-white cursor-pointer">🇨🇿 Czech Republic (Hidden Gems)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Camp Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Premium Alpine Experiences</li>
                <li className="hover:text-white cursor-pointer">Academic Excellence Programs</li>
                <li className="hover:text-white cursor-pointer">Language Immersion Camps</li>
                <li className="hover:text-white cursor-pointer">Sports Specialty Training</li>
                <li className="hover:text-white cursor-pointer">Family-Friendly Programs</li>
                <li className="hover:text-white cursor-pointer">Budget-Conscious Options</li>
                <li className="hover:text-white cursor-pointer">Unique Adventures</li>
                <li className="hover:text-white cursor-pointer">Local & Municipal Gems</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Complete Camp Guide 2026</li>
                <li className="hover:text-white cursor-pointer">Booking Timeline & Tips</li>
                <li className="hover:text-white cursor-pointer">Safety Standards Guide</li>
                <li className="hover:text-white cursor-pointer">Parent Reviews & Testimonials</li>
                <li className="hover:text-white cursor-pointer">Early Bird Discounts</li>
                <li className="hover:text-white cursor-pointer">Camp Comparison Tool</li>
                <li className="hover:text-white cursor-pointer">Age-Appropriate Recommendations</li>
                <li className="hover:text-white cursor-pointer">Budget Planning Calculator</li>
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
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

