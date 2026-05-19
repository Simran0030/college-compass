import type { Request, Response } from 'express';
import { reviewsStore } from '../../data/reviews.js';

export default function handler(req: Request, res: Response) {
  const { collegeId, name, rating, title, body, category } = req.body as {
    collegeId: number;
    name: string;
    rating: number;
    title: string;
    body: string;
    category: string;
  };

  if (!collegeId || !name?.trim() || !rating || !title?.trim() || !body?.trim()) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const review = reviewsStore.add({
    collegeId: Number(collegeId),
    name: name.trim().slice(0, 60),
    rating: Math.round(rating),
    title: title.trim().slice(0, 100),
    body: body.trim().slice(0, 1000),
    category: category || 'General',
  });

  res.status(201).json(review);
}
