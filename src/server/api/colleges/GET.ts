import type { Request, Response } from 'express';
import { colleges } from '../../data/colleges.js';

type SortField = 'rating' | 'fees_asc' | 'fees_desc' | 'placement' | 'package' | 'name';

export default function handler(req: Request, res: Response) {
  const { search, location, minFees, maxFees, type, sort, page = '1', limit = '12' } = req.query;

  let filtered = [...colleges];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }

  if (location && typeof location === 'string' && location !== 'all') {
    filtered = filtered.filter((c) => c.location === location);
  }

  if (minFees) {
    filtered = filtered.filter((c) => c.fees >= Number(minFees));
  }

  if (maxFees) {
    filtered = filtered.filter((c) => c.fees <= Number(maxFees));
  }

  if (type && typeof type === 'string' && type !== 'all') {
    const types = type.split(',');
    filtered = filtered.filter((c) => types.includes(c.type));
  }

  // Sorting
  const sortKey = (typeof sort === 'string' ? sort : 'rating') as SortField;
  filtered.sort((a, b) => {
    switch (sortKey) {
      case 'fees_asc':  return a.fees - b.fees;
      case 'fees_desc': return b.fees - a.fees;
      case 'placement': return b.placement_percentage - a.placement_percentage;
      case 'package':   return b.avg_package - a.avg_package;
      case 'name':      return a.name.localeCompare(b.name);
      case 'rating':
      default:          return b.rating - a.rating;
    }
  });

  const pageNum = Math.max(1, parseInt(String(page), 10));
  const limitNum = Math.max(1, Math.min(50, parseInt(String(limit), 10)));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const paged = filtered.slice(start, start + limitNum);

  res.json({ colleges: paged, total, page: pageNum, totalPages });
}
