import express from 'express';
import Triples from 'nagu-triples';
import { options } from './utils.ts';

const router = express.Router();

const getById = async (req, res) => {
  const { id } = req.params;
  const triple = await Triples.getById(id, options);
  res.json({
    ret: 0,
    data: triple,
  });
}

/**
 * 添加triple
 */
const getOrCreate = async (req, res) => {
  const { subject, predicate, object } = req.body;
  const data = await Triples.getOrCreate(subject, predicate, object, options);
  res.json({
    ret: 0,
    data,
  });
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Triples.deleteById(id, options);
  res.json({
    ret: 0,
    data: result,
  });
};

router.get('/:id', getById)
router.put('/', getOrCreate);
router.delete('/:id', deleteById)
export default router;