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
import alpineVillage from '../assets/european-winter-camp-alpine-village-snow.jpg'
import iceSkating from '../assets/european-winter-camp-ice-skating-frozen-lake.jpg'
import tatraSkiSchool from '../assets/european-winter-camp-tatra-ski-school-poland.jpg'
import sleddingForest from '../assets/european-winter-camp-sledding-forest-lodge.jpg'
import seasideChristmas from '../assets/european-winter-camp-seaside-christmas-promenade.jpg'
import carpathianSlope from '../assets/european-winter-camp-carpathian-slope-guesthouse.jpg'
import firesideLodge from '../assets/european-winter-camp-fireside-lodge-evening.jpg'

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
    videoUrl: "https://www.youtube.com/watch?v=tVg3zXhl-_o", // Operator's own winter film, "Les Elfes International, Winter Camp in Switzerland", embedded on leselfes.com/winter-camp/ (verified 10 Sept 2026). The summer card keeps the separate summer film
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
    image: firesideLodge,
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
    highlights: ["Five full ski days a week, intermediate ski level required", "Compulsory medical insurance is charged per day on top of the fee", "Boarding at an international school since 1947"],
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
    image: tatraSkiSchool,
    category: "winter",
    type: "Ski & Snowboard Camp",
    activities: ["Skiing", "Snowboarding", "Thermal Baths", "Evening Programme"],
    dates: "Jan 16 - Feb 26, 2027", // Verified 10 Sept 2026: six weekly sessions listed under "TERMINY 2027", 16 to 22 Jan through 20 to 26 Feb
    highlights: ["Five-day Kotelnica lift pass included in the price", "Coach travel PLN 270 extra, or PLN 150 if you travel there yourself", "Rooms of three to six with bathroom, three meals a day"],
    languages: ["Polish"],
    specialFeatures: ["Groups by age and ability, beginner to advanced", "One entry to the Terma Bania thermal baths", "Accident insurance included"],
    established: null, // The operator states "20 years" of camps but prints no founding year (checked 10 Sept 2026)
    capacity: null,
    bookingUrl: "https://ar-sport.pl/obozy-zimowe/",
    bookingStatus: "open" // Verified 10 Sept 2026: every one of the six 2027 sessions is marked "wolne miejsca" (places available) above the sign-up form
  },
  {
    id: 79,
    name: "Kinderland Winter Camp Harz",
    location: "Sudharz, Germany",
    country: "Germany",
    season: "winter",
    ages: "7-14 years", // Verified 10 Sept 2026 on kindercamp.de/de/ferienlager/winter-camp/: "Alter: 7 bis 14"
    price: "EUR 379/1 week", // Verified 10 Sept 2026: "Teilnehmerbeitrag: 379,00 EUR" for the seven-day session. Travel to the venue is not included; the operator publishes road and rail directions instead
    priceRange: "budget",
    rating: null,
    reviews: 0,
    image: sleddingForest,
    category: "winter",
    type: "Winter Holiday Camp",
    activities: ["Sledding", "Torchlit Walks", "Thermal Baths", "Crafts", "Excursions"],
    dates: "Jan 31 - Feb 6, 2027", // Verified 10 Sept 2026: "Winter Camp 2027 Durchgang 1 von 31.01.2027 bis 06.02.2027"
    highlights: ["Sledding by day and by night in the Harz", "All entry fees and three meals a day included", "Not a ski camp: snow play, thermal baths and crafts"],
    languages: ["German"],
    specialFeatures: ["Torchlit walk through the winter forest", "Accommodation in the Forsthaus holiday village", "Accident and liability insurance included"],
    established: null, // The association states "over 30 years" but prints no founding year (checked 10 Sept 2026)
    capacity: null,
    bookingUrl: "https://kindercamp.de/de/ferienlager/winter-camp/",
    bookingStatus: "open" // Verified 10 Sept 2026: the site states "Anmeldung fuer unsere Camps 2027 ist gestartet" and the session carries a live "Jetzt buchen"
  },
  {
    id: 80,
    name: "REC Christmas Camp Rimini",
    location: "Rimini, Italy",
    country: "Italy",
    season: "winter",
    ages: "6-17 years", // Verified 10 Sept 2026 on mondorec.it: "bambini e adolescenti di eta compresa tra i 6 e i 17 anni"
    price: "From EUR 240/4 days", // Verified 10 Sept 2026: short stay EUR 240 for 4 days and 3 nights, full stay EUR 390 for 7 days and 6 nights, both VAT included. A day-only option at EUR 90 exists and is not residential
    priceRange: "budget",
    rating: null,
    reviews: 0,
    image: seasideChristmas,
    category: "winter",
    type: "Christmas Holiday Camp",
    activities: ["Workshops", "Shows and Entertainment", "Excursions", "Evening Activities"],
    dates: "Dec 27, 2026 - Jan 2, 2027", // Verified 10 Sept 2026: "DAL 27 DICEMBRE 2026 AL 2 GENNAIO 2027", with a shorter 27 to 30 December turn
    highlights: ["Christmas and New Year by the winter sea", "Full board and 24-hour supervision included", "Not a ski camp: a seaside holiday camp in winter"],
    languages: ["Italian"],
    specialFeatures: ["Rooms of two to five with private bathrooms", "New Year's Eve dinner on the seven-day stay", "Excursion to San Marino on the longer stay"],
    established: null,
    capacity: null,
    bookingUrl: "https://www.mondorec.it/rec-christmas-camp-la-colonia-invernale-per-bambini-e-ragazzi-a-rimini/"
  },
  {
    id: 81,
    name: "Tabere Straja Ski & Snowboard Camp",
    location: "Straja, Romania",
    country: "Romania",
    season: "winter",
    ages: "6-18 years", // Verified 10 Sept 2026 on the operator's English page: "ages 6-18 and accompanying adults"
    price: "From RON 2,490/4-5 nights", // Verified 10 Sept 2026 on taberestraja.ro/en/: "de la 2.490 lei/copil", sessions of 4 to 5 nights. The operator states plainly that the ski pass is NOT included; travel is not included either
    priceRange: "budget",
    rating: null,
    reviews: 0,
    image: carpathianSlope,
    category: "winter",
    type: "Ski & Snowboard Camp",
    activities: ["Skiing", "Snowboarding", "Ski Lessons", "Camp Contest"],
    dates: "Dec 18, 2026 - Mar 14, 2027", // Verified 10 Sept 2026: "Period 18.12.2026-14.03.2027" across a series of sessions
    highlights: ["Skis, boots, poles and helmet included, ski pass is extra", "One instructor for every two to ten children", "Up to five hours on the slopes a day"],
    languages: ["Romanian", "English"],
    specialFeatures: ["Camp pages and booking available in English", "Three meals a day planned with a dietician", "Ski pass is bought separately, as the operator states"],
    established: null, // The operator claims "over 16 years of experience" but prints no founding year; the company was registered in 2015 (checked 10 Sept 2026)
    capacity: null,
    bookingUrl: "https://taberestraja.ro/en/tabara/tabara-vacantei-de-schi-snowboard/"
  },
  {
    id: 82,
    name: "Neige et Soleil Competition Ski Camp",
    location: "Bramans, Savoie, France",
    country: "France",
    season: "winter",
    ages: "12-17 years", // Read in Chrome 10 Sept 2026. The product prints no age sentence; these are the operator's OWN age categories on the product meta line ("12-13 ans", "12-14 ans", "15-17 ans"), which span 12 to 17. A plain fetch could not tell those apart from related products
    price: "EUR 1,195/1 week", // Verified 10 Sept 2026 on the product page: a single public price, no member or sibling rate. A child membership of EUR 20 is added, and travel from a departure city costs EUR 12.50 to 117.50 and is optional
    priceRange: "mid",
    rating: null,
    reviews: 0,
    image: skiSlopeInstructor,
    category: "winter",
    type: "Competition Ski Camp",
    activities: ["Alpine Ski Racing", "Gate Training", "Video Analysis", "ESF Tests"],
    dates: "Feb 14 - Apr 10, 2027", // Verified 10 Sept 2026 in the booking selector: four sessions, 14 to 20 Feb, 21 to 27 Feb, 28 Feb to 6 Mar and 3 to 10 Apr 2027
    highlights: ["Skis, boots, poles and helmet provided", "Etoile d'Or level required, this is a racing camp", "Compulsory child membership of EUR 20 on top of the fee"],
    languages: ["French"],
    specialFeatures: ["Five days of coaching with ESF instructors", "Fleche and Chamois ESF tests included", "The association's own village club, apartments of four to eight"],
    established: 1951,
    capacity: null,
    bookingUrl: "https://www.neige-et-soleil.com/produit/colo-ado-ski-competition/",
    bookingStatus: "open" // Verified 10 Sept 2026: all four 2027 sessions are selectable in the product's own booking selector
  }
]

export { lesElfesWinter, skiSlopeInstructor, tatraSkiSchool, sleddingForest, alpineVillage, iceSkating, seasideChristmas, carpathianSlope, firesideLodge }
export default winterCamps
