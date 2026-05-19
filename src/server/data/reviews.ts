export interface Review {
  id: number;
  collegeId: number;
  name: string;
  rating: number; // 1–5
  title: string;
  body: string;
  category: string;
  createdAt: string; // ISO date string
}

type NewReview = Omit<Review, 'id' | 'createdAt'>;

// Seed reviews for a few colleges
const seed: Review[] = [
  {
    id: 1, collegeId: 1, name: 'Arjun Mehta', rating: 5,
    title: 'World-class education and research',
    body: 'IIT Bombay completely transformed my career. The faculty are brilliant, the labs are state-of-the-art, and the alumni network is unmatched. Placements were excellent — I got into a top MNC.',
    category: 'Academics', createdAt: '2025-11-10T08:00:00Z',
  },
  {
    id: 2, collegeId: 1, name: 'Priya Sharma', rating: 4,
    title: 'Great campus life, tough academics',
    body: 'The academic pressure is real but the campus life makes up for it. Tons of clubs, fests, and networking opportunities. The hostel facilities could be better but overall a great experience.',
    category: 'Campus Life', createdAt: '2025-12-03T10:30:00Z',
  },
  {
    id: 3, collegeId: 1, name: 'Rohit Verma', rating: 5,
    title: 'Best decision of my life',
    body: 'The research opportunities here are incredible. I got to work with professors on cutting-edge projects. The placement cell is very active and companies like Google, Microsoft visit every year.',
    category: 'Placements', createdAt: '2026-01-15T14:00:00Z',
  },
  {
    id: 4, collegeId: 2, name: 'Sneha Patel', rating: 4,
    title: 'Excellent engineering college',
    body: 'IIT Delhi has a fantastic environment for learning. The professors are very knowledgeable and approachable. The campus is well-maintained and the sports facilities are top-notch.',
    category: 'Academics', createdAt: '2025-10-20T09:00:00Z',
  },
  {
    id: 5, collegeId: 2, name: 'Karan Singh', rating: 5,
    title: 'Placements are phenomenal',
    body: 'Got placed at a top tech company with a great package. The placement training and mock interviews really helped. The alumni network in Delhi NCR is very strong.',
    category: 'Placements', createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 6, collegeId: 5, name: 'Ananya Gupta', rating: 4,
    title: 'Solid NIT with good placements',
    body: 'NIT Trichy is one of the best NITs in the country. The faculty are dedicated and the curriculum is industry-relevant. The campus is beautiful and the food in the mess is surprisingly good!',
    category: 'General', createdAt: '2025-09-15T07:30:00Z',
  },
];

let nextId = seed.length + 1;
const store: Review[] = [...seed];

export const reviewsStore = {
  getByCollege(collegeId: number): Review[] {
    return store
      .filter((r) => r.collegeId === collegeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  add(data: NewReview): Review {
    const review: Review = {
      ...data,
      id: nextId++,
      createdAt: new Date().toISOString(),
    };
    store.push(review);
    return review;
  },
};
