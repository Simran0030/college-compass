import type { Request, Response } from 'express';
import { colleges } from '../../data/colleges.js';

export default function handler(req: Request, res: Response) {
  const { exam, rank } = req.body as { exam?: string; rank?: number };

  if (!exam || !rank) {
    return res.status(400).json({ error: 'exam and rank are required' });
  }

  const rankNum = Number(rank);
  if (isNaN(rankNum) || rankNum < 1) {
    return res.status(400).json({ error: 'rank must be a positive number' });
  }

  // Filter colleges where exam matches AND cutoff_rank >= rank (student is eligible)
  const eligible = colleges
    .filter((c) => c.exam.some((e) => e.toLowerCase() === exam.toLowerCase()))
    .filter((c) => c.cutoff_rank >= rankNum)
    .sort((a, b) => a.cutoff_rank - b.cutoff_rank)
    .slice(0, 10);

  res.json({ colleges: eligible, exam, rank: rankNum });
}
