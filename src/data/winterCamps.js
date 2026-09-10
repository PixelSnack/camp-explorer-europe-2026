// Winter camp directory data: residential winter camps that individual families can book for one
// child. Same shape as allCamps in camps.js plus season: "winter".
//
// Winter does NOT mean ski (owner correction, 6 and 10 September 2026). Snowboard, cross-country,
// ice hockey and skating, husky and sled dog, wilderness, Northern Lights and winter language camps
// all qualify on the same footing. The winter point is that the core activity's equipment and
// instruction are stated, whatever that activity is; a lift pass counts only where the activity is
// skiing or snowboarding.
//
// Rules: per-child price with unit and provenance comment; dates under 40 characters; bookingStatus
// only "open" and only when the operator's own enrolment form lists the season's sessions as
// selectable; rating null / reviews 0 unless reviewData is supplied; category "winter"; IDs continue
// the shared sequence (scripts/validate-camps.js enforces all of this).
//
// EVERY figure below was read by the lead on the operator's own page or PDF on 10 September 2026.
// Nothing here comes from a research agent unchecked. Camps that could not be re-read tonight are
// held out rather than published: see docs/reports/WINTER_LAUNCH_2026-09-10.md for the hold list.
import lesElfesWinter from '../assets/les-elfes-winter-camp-verbier-skiers-4-vallees.jpg'
import skiSlopeInstructor from '../assets/european-winter-camp-ski-slope-instructor-alps.jpg'
import chaletEvening from '../assets/european-winter-camp-chalet-evening-lit-windows.jpg'
import alpineVillage from '../assets/european-winter-camp-alpine-village-snow.jpg'
import iceSkating from '../assets/european-winter-camp-ice-skating-frozen-lake.jpg'
import crossCountryNordic from '../assets/european-winter-camp-cross-country-forest-nordic.jpg'
import huskySled from '../assets/european-winter-camp-husky-sled-trail.jpg'
import northernLights from '../assets/european-winter-camp-northern-lights-lodge.jpg'

export const winterCamps = [
  {
    id: 73,
    featured: true, // Premium partner: accepted EUR 199 for the 2027 cycle on 8 Sept 2026, covering the summer and winter cards
    name: "Les Elfes International Winter Camp",
    location: "Verbier, Switzerland",
    country: "Switzerland",
    season: "winter",
    ages: "6-17 years", // Verified 10 Sept 2026 on leselfes.com/winter-camp/ Key Information block
    price: "From CHF 2,200/1 week", // Verified 10 Sept 2026: winter block of leselfes.com/dates-and-pricing/ runs CHF 2,200 to 2,950 by week; the winter page states "Starting from CHF 2'200 per week". Ski equipment rental and Geneva transfer are extra
    priceRange: "premium",
    rating: null,
    reviews: 0,
    image: lesElfesWinter, // Operator's own photograph, supplied by Les Elfes 8 Sept 2026 for their card
    category: "winter",
    type: "Ski & Snowboard Camp",
    activities: ["Skiing", "Snowboarding", "Apres-Ski Activities", "Weekly Excursions", "Language Classes"],
    dates: "Dec 12, 2026 - Apr 24, 2027", // Verified 10 Sept 2026: first session 12 Dec 2026, last 17 to 24 Apr 2027, weekly, arrivals every Saturday
    highlights: ["4 Vallees ski pass and six hours on snow daily", "Four meals a day, rooms of four with ensuite", "24/7 supervision with an onsite nurse and night guard"],
    languages: ["English", "French", "German", "Spanish"],
    specialFeatures: ["Purpose-built campus in Verbier", "410 km of slopes in the 4 Vallees", "Optional language courses"],
    established: 1987, // "Founded in 1987, Les Elfes is a family-run camp" (winter page, read 10 Sept 2026)
    capacity: 140, // Two purpose-built chalets of 70 beds (operator campus page, read 6 Sept 2026)
    bookingUrl: "https://www.leselfes.com/winter-camp/",
    videoUrl: "https://www.youtube.com/watch?v=Z9--hHAq40g",
    bookingStatus: "open" // Verified 10 Sept 2026: every 2026-27 session in the dates table carries a live "ENROL NOW"
  },
  {
    id: 74,
    name: "FILOLO Ski & Snowboard Camp",
    location: "Les Diablerets, Switzerland",
    country: "Switzerland",
    season: "winter",
    ages: "10-17 years", // Verified 10 Sept 2026 on filolo.ch/en/sports-camps/ski-camp-and-snowboard
    price: "From CHF 999/1 week", // Verified 10 Sept 2026: "From CHF 999", accommodation, full board and ski pass included. A "Bring a Friend" rate of CHF 949 exists for two children registering together; 999 is the first-time public price. Equipment hire and airport transfer are extra
    priceRange: "mid",
    rating: null,
    reviews: 0,
    image: skiSlopeInstructor,
    category: "winter",
    type: "Ski & Snowboard Camp",
    activities: ["Skiing", "Snowboarding", "Language Courses", "Evening Programme"],
    dates: "Dec 20, 2026 - Feb 27, 2027", // Verified 10 Sept 2026: seven weekly sessions listed, 20 Dec 2026 to 27 Feb 2027
    highlights: ["25 hours of ski or snowboard tuition a week", "Accommodation, full board and ski pass included", "Three linked ski areas including Glacier 3000"],
    languages: ["English", "French", "German"],
    specialFeatures: ["Stays of one to three weeks", "232 km of slopes from 1200 m to 3010 m", "Optional language course alongside the snow programme"],
    established: null, // Founding year not stated on the operator's site (checked 10 Sept 2026)
    capacity: null,
    bookingUrl: "https://filolo.ch/en/sports-camps/ski-camp-and-snowboard"
  },
  {
    id: 75,
    name: "Ecole d'Humanite Winter Camp",
    location: "Hasliberg, Switzerland",
    country: "Switzerland",
    season: "winter",
    ages: "13-16 years", // Verified 10 Sept 2026 on ecole.ch/winter-camp: "Ages 13 to 16". An earlier agent read of 12 to 16 was wrong; this is the operator's own wording
    price: "CHF 5,000/2 weeks", // Verified 10 Sept 2026: single two-week fee. If the child later enrols at the school, the fee comes off the first year's tuition
    priceRange: "premium",
    rating: null,
    reviews: 0,
    image: chaletEvening,
    category: "winter",
    type: "Boarding School Winter Camp",
    activities: ["Skiing", "Snowboarding", "Language Classes", "Workshops", "Weekend Excursions"],
    dates: "Jan 31 - Feb 13, 2027", // Verified 10 Sept 2026: "31 January to 13 February 2027", one two-week camp
    highlights: ["Two weeks inside a running international boarding school", "Lift passes, equipment and lessons included", "Twelve places only"],
    languages: ["German", "English", "French"],
    specialFeatures: ["Daily snowsports on the Hasliberg with professional instructors", "Project-based language classes in small groups", "Winter camp parka provided on arrival"],
    established: 1934,
    capacity: 12, // "12 places" (operator page, read 10 Sept 2026)
    bookingUrl: "https://ecole.ch/winter-camp"
  },
  {
    id: 76,
    name: "La Garenne Winter Camp",
    location: "Villars-sur-Ollon, Switzerland",
    country: "Switzerland",
    season: "winter",
    ages: "5-14 years", // Verified 10 Sept 2026 on la-garenne.ch/winter-camps/: camp is for children aged 5 to 14; the Super Ski programme is ages 8 to 14
    price: "From CHF 4,400/1 week", // Verified 10 Sept 2026: "CHF 4'400 as a boarder" for one week; CHF 3,750 is the day-student rate and is not residential. Session 5 carries a CHF 1,200 supplement. Compulsory medical insurance is charged per day
    priceRange: "luxury",
    rating: null,
    reviews: 0,
    image: alpineVillage,
    category: "winter",
    type: "Boarding School Ski Camp",
    activities: ["Skiing", "Academic Lessons", "Evening Activities", "Excursions"],
    dates: "Jan 10 - Mar 13, 2027", // Verified 10 Sept 2026: eight weekly sessions, 10 Jan to 13 Mar 2027. The operator's page mistypes the year on two sessions as 2026; the sequence is unambiguous
    highlights: ["Five full ski days a week above Villars", "Boarding at an international school since 1947", "Intermediate ski level required for Super Ski"],
    languages: ["English", "French"],
    specialFeatures: ["Minimum stay one week, sessions can be combined", "Full-day skiing or skiing combined with lessons", "Boarders stay through the weekend"],
    established: 1947,
    capacity: null,
    bookingUrl: "https://www.la-garenne.ch/winter-camps/"
  },
  {
    id: 77,
    name: "Prefleuri Winter Camp",
    location: "Chesieres-Villars, Switzerland",
    country: "Switzerland",
    season: "winter",
    ages: "3-14 years", // Verified 10 Sept 2026 in the operator's 2027 fees PDF: "For children from 3 to 14 years old"
    price: "From CHF 6,750/2 weeks", // Verified 10 Sept 2026 in PREFLEURI-WINTER-CAMPS-2027-TARIFS-CONDITIONS-ENG.pdf: two weeks CHF 6,750 is the shortest stay offered, rising to CHF 24,400 for nine weeks. Geneva transfers are CHF 250 to 600 and are not included
    priceRange: "luxury",
    rating: null,
    reviews: 0,
    image: iceSkating,
    category: "winter",
    type: "Alpine School Winter Camp",
    activities: ["Skiing", "Ice Skating", "Language Immersion", "Group Sports"],
    dates: "Jan 10 - Mar 19, 2027", // Derived 10 Sept 2026 from the 2027 fees PDF, which sets arrivals and departures every Saturday "except for Sunday 10 January" and "Friday 19 March, last departure before 16:00"
    highlights: ["Ski lifts, skis, boots, suit and helmet included", "French or English lessons five mornings a week", "Alpine school running since 1948"],
    languages: ["French", "English"],
    specialFeatures: ["Shortest stay is two weeks", "Full board, laundry and school uniform included", "Ski-Race Academy available for a full term"],
    established: 1948,
    capacity: null,
    bookingUrl: "https://www.prefleuricamps.ch/"
  },
  {
    id: 78,
    name: "AR-Sport Ski & Snowboard Camp",
    location: "Bialka Tatrzanska, Poland",
    country: "Poland",
    season: "winter",
    ages: "8-18 years", // Verified 10 Sept 2026 on ar-sport.pl/obozy-zimowe/: "dla dzieci i mlodziezy w wieku 8-18 lat"
    price: "PLN 2,949/1 week", // Verified 10 Sept 2026: all six 2027 sessions are PLN 2,949 per child, five-day Kotelnica lift pass included. Coach travel is PLN 270 extra; families making their own way pay a compulsory PLN 150 slope-transfer fee; ski or snowboard hire is PLN 280 per week with a free helmet
    priceRange: "budget",
    rating: null,
    reviews: 0,
    image: skiSlopeInstructor,
    category: "winter",
    type: "Ski & Snowboard Camp",
    activities: ["Skiing", "Snowboarding", "Thermal Baths", "Evening Programme"],
    dates: "Jan 16 - Feb 26, 2027", // Verified 10 Sept 2026: six weekly sessions listed under "TERMINY 2027", 16 to 22 Jan through 20 to 26 Feb
    highlights: ["Five-day Kotelnica lift pass included in the price", "Three sessions on the slopes each day", "Rooms of three to six with bathroom, three meals a day"],
    languages: ["Polish"],
    specialFeatures: ["Groups by age and ability, beginner to advanced", "One entry to the Terma Bania thermal baths", "Accident insurance included"],
    established: null, // The operator states "20 years" of camps but prints no founding year (checked 10 Sept 2026)
    capacity: null,
    bookingUrl: "https://ar-sport.pl/obozy-zimowe/",
    bookingStatus: "open" // Verified 10 Sept 2026: every one of the six 2027 sessions is marked "wolne miejsca" (places available) above the sign-up form
  }
]

export { lesElfesWinter, skiSlopeInstructor, chaletEvening, alpineVillage, iceSkating, crossCountryNordic, huskySled, northernLights }
export default winterCamps
