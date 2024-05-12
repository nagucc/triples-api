import express from 'express';
import Triples from 'nagu-triples';
import { options } from './utils.ts';

const router = express.Router();

/**
 * 获取指定主体iri相关的所有triple
 */
const listByS = async (req, res) => {
  const { iri } = req.params;
  const data = await Triples.listByS(iri, options);
  res.json({
    ret: 0,
    data,
  });
};

/**
 * 获取指定主体iri及属性的所有triple
 */
const listBySP = async (req, res) => {
  const { iri, predicate } = req.params;
  const data = await Triples.listBySP(iri, predicate, options);
  res.json({
    ret: 0,
    data,
  });
}

const listBySPO = async (req, res) => {
    const { iri, predicate, object } = req.params;
    const data = await Triples.getBySPO(iri, predicate, object, options);
    res.json({
      ret: 0,
      data,
    });
    
}

router.get('/:iri', listByS);
router.get('/:iri/predicate/:predicate', listBySP);
router.get('/:iri/predicate/:predicate/object/:object', listBySPO);
export default router;