import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/apiConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Parameter pencarian tidak valid.' });
  }
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_SEARCH(name)}`);
    res.status(200).json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
    res.status(axiosError?.response?.status || 500).json({
      message: axiosError?.response?.data?.message || 'Gagal mengambil data produk dari backend.'
    });
  }
} 