import express from 'express';
import Triples from 'nagu-triples/src/index.ts';
import { options } from './utils.ts';
import { INotion } from 'nagu-triples-types';

const router = express.Router();

const getById = async (req, res) => {
  const { id } = req.params;
  const triple = await Triples.getById(id, options);
  res.json({
    ret: triple ? 0 : 404,
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

const listByP = async (req, res) => {
  const pid = req.params.pid as string;
  const data = await Triples.listByP(pid, options);
  res.json({
    data,
  });
}

router.get('/:id', getById)
router.put('/', getOrCreate);
router.delete('/:id', deleteById)
router.get('/predicate/:pid', listByP);
export default router;