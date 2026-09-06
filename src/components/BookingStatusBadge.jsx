import { Badge } from '@/components/ui/badge.jsx'

// Booking-status badge: rendered only when a camp carries a verified bookingStatus.
// "open" is the only green state; any other verified text (e.g. "2027 dates published") is blue.
// Moved out of App.jsx on 6 Sept 2026 so the Home grid, CampCard and the winter grid share one source.
const getBookingBadge = (camp) => {
  const status = typeof camp.bookingStatus === 'string' ? camp.bookingStatus.trim() : ''
  if (!status || status === 'not yet open') return null
  return status === 'open'
    ? { label: 'Booking open', tone: 'bg-green-500/90' }
    : { label: status, tone: 'bg-blue-500/90' }
}

export function BookingStatusBadge({ camp }) {
  const badge = getBookingBadge(camp)
  if (!badge) return null
  return (
    <Badge className={`${badge.tone} text-white backdrop-blur-sm text-xs ml-auto`}>
      {badge.label}
    </Badge>
  )
}
