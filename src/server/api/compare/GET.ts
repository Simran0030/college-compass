import type { Request, Response } from 'express';
import { colleges } from '../../data/colleges.js';

export default function handler(req: Request, res: Response) {
  const { ids } = req.query;
  if (!ids || typeof ids !== 'string') {
    return res.status(400).json({ error: 'ids query param required (comma-separated)' });
  }
  const idList = ids.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean).slice(0, 3);
  const result = idList.map((id) => colleges.find((c) => c.id === id)).filter(Boolean);
  res.json(result);
}
