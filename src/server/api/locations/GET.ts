import type { Request, Response } from 'express';
import { colleges } from '../../data/colleges.js';

export default function handler(req: Request, res: Response) {
  const locations = [...new Set(colleges.map((c) => c.location))].sort();
  res.json(locations);
}
