import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Parameter pencarian tidak valid.' });
  }
  try {
    const response = await axios.get(`https://amimumprojectbe-production.up.railway.app/product/${encodeURIComponent(name)}`);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error?.response?.status || 500).json({
      message: error?.response?.data?.message || 'Gagal mengambil data produk dari backend.'
    });
  }
} 