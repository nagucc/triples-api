/**
 * 管理rdf:Resource
 */

import express from 'express';
import { Factory, RDF, RDFS, RdfsResource } from 'nagu-owl';
import { options } from '../utils.ts';

const router = express.Router();
const factory = new Factory(options);
/**
 * 添加Resource，存放在res.resource
 */
const getOrCreateResource = async (req ,res, next) => {
  const { iri } = req.params; // Resource的IRI
  
  // 创建Resource
  res.resource = await factory.createRdfResource(iri);
  next();
}

export const setCommonPropertyValues = async (req, res) => {
  const { label, comment, seeAlso } = req.body;
  const operations = [
    { iri: RDFS.terms.label, value: label },
    { iri: RDFS.terms.comment, value: comment },
    { iri: RDFS.terms.seeAlso, value: seeAlso },
  ].map(async p => {
    return res.resource.setPropertyValues(p.iri, p.value);
  });
  await Promise.all(operations);
  res.json({
    data: {
      iri: res.resource.uri,
      label,
      comment,
      seeAlso,
    },
  });
}

export const removeCommonPropertyValues = async (_req: any, res: { resource: RdfsResource; }, next: () => void) => {
  const operations = [
    RDFS.terms.label,
    RDFS.terms.comment,
    RDFS.terms.seeAlso,
  ].map(async p => {
    // 获取原值
    const os = await res.resource.getPropertyValues(p);
    // 删除原值
    await Promise.all(os.map(o => res.resource.removePropertyValue(p, o)));
  });
  next();
}

router.put('/:iri', getOrCreateResource, setCommonPropertyValues);
router.post('/:iri', getOrCreateResource, removeCommonPropertyValues, setCommonPropertyValues);
export default router;