/**
 * Mock college data — used when /api/colleges is unavailable (GitHub Pages).
 */

export interface CollegeData {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  type: string;
  placement_percentage: number;
  avg_package: number;
  description?: string;
  established?: number;
  courses?: string[];
  image?: string;
}

export const MOCK_COLLEGES: CollegeData[] = [
  { id: 1, name: 'IIT Bombay', location: 'Mumbai, Maharashtra', fees: 250000, rating: 4.9, type: 'IIT', placement_percentage: 98, avg_package: 28 },
  { id: 2, name: 'IIT Delhi', location: 'New Delhi, Delhi', fees: 250000, rating: 4.9, type: 'IIT', placement_percentage: 97, avg_package: 27 },
  { id: 3, name: 'IIT Madras', location: 'Chennai, Tamil Nadu', fees: 250000, rating: 4.8, type: 'IIT', placement_percentage: 96, avg_package: 26 },
  { id: 4, name: 'IIT Kanpur', location: 'Kanpur, Uttar Pradesh', fees: 250000, rating: 4.8, type: 'IIT', placement_percentage: 95, avg_package: 25 },
  { id: 5, name: 'IIT Kharagpur', location: 'Kharagpur, West Bengal', fees: 230000, rating: 4.7, type: 'IIT', placement_percentage: 94, avg_package: 24 },
  { id: 6, name: 'IIT Roorkee', location: 'Roorkee, Uttarakhand', fees: 230000, rating: 4.7, type: 'IIT', placement_percentage: 93, avg_package: 23 },
  { id: 7, name: 'NIT Trichy', location: 'Tiruchirappalli, Tamil Nadu', fees: 150000, rating: 4.5, type: 'NIT', placement_percentage: 90, avg_package: 18 },
  { id: 8, name: 'NIT Warangal', location: 'Warangal, Telangana', fees: 140000, rating: 4.4, type: 'NIT', placement_percentage: 89, avg_package: 17 },
  { id: 9, name: 'NIT Surathkal', location: 'Mangalore, Karnataka', fees: 140000, rating: 4.4, type: 'NIT', placement_percentage: 88, avg_package: 16 },
  { id: 10, name: 'NIT Calicut', location: 'Kozhikode, Kerala', fees: 135000, rating: 4.3, type: 'NIT', placement_percentage: 87, avg_package: 15 },
  { id: 11, name: 'IIM Ahmedabad', location: 'Ahmedabad, Gujarat', fees: 2300000, rating: 4.9, type: 'IIM', placement_percentage: 100, avg_package: 35 },
  { id: 12, name: 'IIM Bangalore', location: 'Bangalore, Karnataka', fees: 2200000, rating: 4.9, type: 'IIM', placement_percentage: 100, avg_package: 34 },
  { id: 13, name: 'IIM Calcutta', location: 'Kolkata, West Bengal', fees: 2100000, rating: 4.8, type: 'IIM', placement_percentage: 100, avg_package: 32 },
  { id: 14, name: 'IIIT Hyderabad', location: 'Hyderabad, Telangana', fees: 300000, rating: 4.6, type: 'IIIT', placement_percentage: 92, avg_package: 20 },
  { id: 15, name: 'IIIT Delhi', location: 'New Delhi, Delhi', fees: 350000, rating: 4.5, type: 'IIIT', placement_percentage: 91, avg_package: 19 },
  { id: 16, name: 'BITS Pilani', location: 'Pilani, Rajasthan', fees: 550000, rating: 4.7, type: 'Deemed', placement_percentage: 93, avg_package: 22 },
  { id: 17, name: 'VIT Vellore', location: 'Vellore, Tamil Nadu', fees: 200000, rating: 4.2, type: 'Private', placement_percentage: 82, avg_package: 12 },
  { id: 18, name: 'Manipal Institute of Technology', location: 'Manipal, Karnataka', fees: 250000, rating: 4.1, type: 'Private', placement_percentage: 80, avg_package: 11 },
  { id: 19, name: 'SRM Institute of Science', location: 'Chennai, Tamil Nadu', fees: 200000, rating: 4.0, type: 'Private', placement_percentage: 78, avg_package: 10 },
  { id: 20, name: 'Amity University', location: 'Noida, Uttar Pradesh', fees: 300000, rating: 3.9, type: 'Private', placement_percentage: 75, avg_package: 9 },
  { id: 21, name: 'Delhi University', location: 'New Delhi, Delhi', fees: 30000, rating: 4.3, type: 'State', placement_percentage: 72, avg_package: 8 },
  { id: 22, name: 'Mumbai University', location: 'Mumbai, Maharashtra', fees: 25000, rating: 4.1, type: 'State', placement_percentage: 68, avg_package: 7 },
  { id: 23, name: 'Anna University', location: 'Chennai, Tamil Nadu', fees: 50000, rating: 4.2, type: 'State', placement_percentage: 70, avg_package: 8 },
  { id: 24, name: 'IIT Hyderabad', location: 'Hyderabad, Telangana', fees: 240000, rating: 4.6, type: 'IIT', placement_percentage: 92, avg_package: 22 },
  { id: 25, name: 'IIT Guwahati', location: 'Guwahati, Assam', fees: 230000, rating: 4.6, type: 'IIT', placement_percentage: 91, avg_package: 21 },
  { id: 26, name: 'NIT Rourkela', location: 'Rourkela, Odisha', fees: 130000, rating: 4.3, type: 'NIT', placement_percentage: 86, avg_package: 14 },
  { id: 27, name: 'NIT Jaipur', location: 'Jaipur, Rajasthan', fees: 125000, rating: 4.2, type: 'NIT', placement_percentage: 84, avg_package: 13 },
  { id: 28, name: 'IIM Lucknow', location: 'Lucknow, Uttar Pradesh', fees: 1900000, rating: 4.7, type: 'IIM', placement_percentage: 100, avg_package: 30 },
  { id: 29, name: 'IIM Indore', location: 'Indore, Madhya Pradesh', fees: 1800000, rating: 4.6, type: 'IIM', placement_percentage: 99, avg_package: 28 },
  { id: 30, name: 'IIIT Bangalore', location: 'Bangalore, Karnataka', fees: 320000, rating: 4.5, type: 'IIIT', placement_percentage: 90, avg_package: 18 },
  { id: 31, name: 'Jadavpur University', location: 'Kolkata, West Bengal', fees: 20000, rating: 4.4, type: 'State', placement_percentage: 74, avg_package: 9 },
  { id: 32, name: 'Pune University', location: 'Pune, Maharashtra', fees: 30000, rating: 4.0, type: 'State', placement_percentage: 65, avg_package: 7 },
  { id: 33, name: 'BITS Goa', location: 'Goa', fees: 520000, rating: 4.5, type: 'Deemed', placement_percentage: 91, avg_package: 20 },
  { id: 34, name: 'BITS Hyderabad', location: 'Hyderabad, Telangana', fees: 510000, rating: 4.4, type: 'Deemed', placement_percentage: 90, avg_package: 19 },
  { id: 35, name: 'Thapar University', location: 'Patiala, Punjab', fees: 380000, rating: 4.2, type: 'Deemed', placement_percentage: 83, avg_package: 13 },
  { id: 36, name: 'Christ University', location: 'Bangalore, Karnataka', fees: 180000, rating: 4.0, type: 'Private', placement_percentage: 76, avg_package: 8 },
  { id: 37, name: 'Symbiosis International', location: 'Pune, Maharashtra', fees: 450000, rating: 4.1, type: 'Deemed', placement_percentage: 80, avg_package: 12 },
  { id: 38, name: 'NIT Durgapur', location: 'Durgapur, West Bengal', fees: 120000, rating: 4.1, type: 'NIT', placement_percentage: 83, avg_package: 12 },
  { id: 39, name: 'IIT BHU', location: 'Varanasi, Uttar Pradesh', fees: 235000, rating: 4.5, type: 'IIT', placement_percentage: 90, avg_package: 20 },
  { id: 40, name: 'IIT Indore', location: 'Indore, Madhya Pradesh', fees: 235000, rating: 4.5, type: 'IIT', placement_percentage: 89, avg_package: 19 },
];

export const MOCK_LOCATIONS = [
  'Mumbai, Maharashtra',
  'New Delhi, Delhi',
  'Chennai, Tamil Nadu',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Kanpur, Uttar Pradesh',
  'Varanasi, Uttar Pradesh',
  'Guwahati, Assam',
  'Jaipur, Rajasthan',
  'Pilani, Rajasthan',
  'Vellore, Tamil Nadu',
  'Noida, Uttar Pradesh',
  'Manipal, Karnataka',
  'Patiala, Punjab',
  'Roorkee, Uttarakhand',
];

interface CollegesQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  type?: string;
}

export function queryColleges(params: CollegesQuery) {
  let results = [...MOCK_COLLEGES];

  if (params.search) {
    const q = params.search.toLowerCase();
    results = results.filter(
      (c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    );
  }
  if (params.location && params.location !== 'all') {
    results = results.filter((c) => c.location === params.location);
  }
  if (params.type) {
    const types = params.type.split(',');
    results = results.filter((c) => types.includes(c.type));
  }
  if (params.minFees) results = results.filter((c) => c.fees >= params.minFees!);
  if (params.maxFees) results = results.filter((c) => c.fees <= params.maxFees!);

  switch (params.sort) {
    case 'placement': results.sort((a, b) => b.placement_percentage - a.placement_percentage); break;
    case 'package':   results.sort((a, b) => b.avg_package - a.avg_package); break;
    case 'fees_asc':  results.sort((a, b) => a.fees - b.fees); break;
    case 'fees_desc': results.sort((a, b) => b.fees - a.fees); break;
    case 'name':      results.sort((a, b) => a.name.localeCompare(b.name)); break;
    default:          results.sort((a, b) => b.rating - a.rating);
  }

  const total = results.length;
  const page = params.page || 1;
  const limit = params.limit || 12;
  const totalPages = Math.ceil(total / limit);
  const colleges = results.slice((page - 1) * limit, page * limit);

  return { colleges, total, page, totalPages };
}