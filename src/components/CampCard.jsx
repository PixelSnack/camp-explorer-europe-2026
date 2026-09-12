// Camp card as rendered in the Discover grid (and the winter grid). Extracted from App.jsx on 6 Sept 2026
// with an identical rendered DOM (before/after dump diff over the DevTools protocol). The Home grid keeps
// its own copy on purpose (indexed view, zero-touch rule); every grid calls the same shared handlers.
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { MapPin, Calendar, Users, Star, Globe, Award, Heart } from 'lucide-react'
import { mapCompressed } from '../data/camps.js'
import { BookingStatusBadge } from './BookingStatusBadge.jsx'

/**
 * @param {object} props
 * @param {object} props.camp row from camps.js (summer) or winterCamps.js (season "winter")
 * @param {boolean} props.isSelected whether the camp is in the comparison tray
 * @param {(camp: object) => void} props.onToggleCompare add to or remove from the comparison
 * @param {(camp: object) => void} props.onBook tracked outbound booking click
 * @param {(camp: object) => void} props.onVideo tracked video click
 */
export default function CampCard({ camp, isSelected, onToggleCompare, onBook, onVideo }) {
  // "+N more" on the activities row was a static badge until 12 Sept 2026; every camp has more than three
  // activities and the rest were visible nowhere on the site. It is now a button that expands the row in place.
  const [showAllActivities, setShowAllActivities] = useState(false)
  return (
    <Card data-camp-card={camp.id} className={`camp-card overflow-hidden group flex flex-col ${
      camp.featured
        ? 'border-[3px] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-4 ring-amber-100'
        : 'border-0 shadow-lg'
    }`}>
      <div className="relative h-56 overflow-hidden">
        <img
          src={camp.image}
          alt={`${camp.name} - ${camp.type} ${camp.season === 'winter' ? 'winter' : 'summer'} camp in ${camp.location} for ages ${camp.ages}`}
          className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
            camp.image === mapCompressed ? 'object-contain bg-sky-50' : 'object-cover'
          }`}
          title={`${camp.name} - European ${camp.season === 'winter' ? 'Winter' : 'Summer'} Camp ${camp.ages}`}
          loading="lazy"
        />
        {/* Featured band: every paying (featured) card reads FEATURED regardless of price tier. Owner decision 12 Sept 2026: "Premium" on the band read as a rating; the partner product keeps the name Premium listing, the public label is Featured */}
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
          {camp.rating != null && (
          <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {Number(camp.rating).toFixed(1)}
          </Badge>
          )}
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            className="h-8 px-2"
            onClick={(e) => { e.stopPropagation(); onToggleCompare(camp); }}
            aria-pressed={isSelected}
            aria-label={isSelected ? `Remove ${camp.name} from comparison` : `Add ${camp.name} to comparison`}
          >
            {isSelected ? '✓' : '+'}
          </Button>
        </div>
        {/* Bottom overlay row: date chip left, verified booking badge right; wraps instead of overlapping on narrow phones */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end gap-2">
          <Badge className="bg-black/70 text-white backdrop-blur-sm whitespace-normal text-left">
            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
            {camp.dates}
          </Badge>
          <BookingStatusBadge camp={camp} />
        </div>
      </div>
  
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
              {camp.name}
            </CardTitle>
            <CardDescription className="flex items-start text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1 shrink-0 mt-0.5" aria-hidden="true" />
              {camp.location}
            </CardDescription>
          </div>
          <div className="text-right flex-shrink-0">
            {camp.price.split('/')[0].startsWith('From ') && (
              <div className="camp-from-label">From</div>
            )}
            <div className="camp-price">{camp.price.split('/')[0].replace('From ', '')}</div>
            {camp.price.includes('/') && (
              <div className="camp-duration">{camp.price.split('/')[1]}</div>
            )}
            {camp.priceNote && (
              <div className="camp-price-note">{camp.priceNote}</div>
            )}
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
              {camp.capacity ? `${camp.capacity} max` : 'Capacity on request'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1" id={`activities-${camp.season === 'winter' ? 'winter' : 'discover'}-${camp.id}`}>
            {(showAllActivities ? camp.activities : camp.activities.slice(0, 3)).map((activity, index) => (
              <Badge key={index} variant="secondary" className="badge-responsive">
                {activity}
              </Badge>
            ))}
            {camp.activities.length > 3 && (
              <button
                type="button"
                className="badge-responsive activities-toggle"
                aria-expanded={showAllActivities}
                aria-controls={`activities-${camp.season === 'winter' ? 'winter' : 'discover'}-${camp.id}`}
                aria-label={showAllActivities ? `Show fewer activities for ${camp.name}` : `Show all ${camp.activities.length} activities for ${camp.name}`}
                onClick={(e) => { e.stopPropagation(); setShowAllActivities(v => !v) }}
              >
                {showAllActivities ? 'Show fewer' : `+${camp.activities.length - 3} more`}
              </button>
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
              {camp.highlights.slice(0, camp.featured ? 6 : 3).map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 mt-[7px] shrink-0"></div>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {camp.established && (
            <div className="flex items-center text-sm text-gray-500">
              <Award className="w-4 h-4 mr-1" />
              Est. {camp.established}
            </div>
            )}
            {camp.reviews > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="w-4 h-4 mr-1" />
              {camp.reviews} reviews
            </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onBook(camp)}
            aria-label={`View details and book ${camp.name}`}
          >
            View Details & Book
          </Button>
          {camp.videoUrl && (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm h-9"
              onClick={(e) => { e.stopPropagation(); onVideo(camp) }}
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
  )
}
