import type { Request, Response } from 'express';
import { colleges } from '../../../data/colleges.js';

export default function handler(req: Request, res: Response) {
  const id = parseInt(String(req.params.id), 10);
  const college = colleges.find((c) => c.id === id);
  if (!college) {
    return res.status(404).json({ error: 'College not found' });
  }
  res.json(college);
}
