import type { Request, Response } from 'express';
import { reviewsStore } from '../../data/reviews.js';

export default function handler(req: Request, res: Response) {
  const collegeId = parseInt(String(req.query.collegeId), 10);
  if (isNaN(collegeId)) {
    return res.status(400).json({ error: 'collegeId is required' });
  }
  const reviews = reviewsStore.getByCollege(collegeId);
  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;
  res.json({ reviews, avgRating, total: reviews.length });
}
