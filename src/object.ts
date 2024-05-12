import express from 'express';
import Triples from 'nagu-triples';
import { options } from './utils.ts';

const router = express.Router();

/**
 * 获取指定客体value相关的所有triple
 */
const listByO = async (req, res) => {
  const { value } = req.params;
  const data = await Triples.listByO(value, options);
  res.json({
    ret: 0,
    data,
  });
};

router.get('/:value', listByO);
export default router;