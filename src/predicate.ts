import express from 'express';
import Triples from 'nagu-triples';
import { options } from './utils.ts';

const router = express.Router();

/**
 * 获取指定iri相关的所有triple
 */
const listByP = async (req, res) => {
  const { iri } = req.params;
  const data = await Triples.listByP(iri, options);
  res.json({
    ret: 0,
    data,
  });
};

/**
 * 获取指定iri及客体的所有triple
 */
const listByPO = async (req, res) => {
  const { iri, object } = req.params;
  const data = await Triples.listByPO(iri, object, options);
  res.json({
    ret: 0,
    data,
  });
}

router.get('/:iri', listByP);
router.get('/:iri/object/:object', listByPO);

export default router;