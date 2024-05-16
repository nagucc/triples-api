/**
 * 管理rdf:Resource
 */

import express from 'express';
import { Factory, RDF, RDFS } from 'nagu-owl';
import { options } from '../utils.ts';

const router = express.Router();
const factory = new Factory(options);
/**
 * 添加Resource，存放在res.resource
 */
export const createResource = async (req ,res, next) => {
  const { iri } = req.params; // Resource的IRI
  
  // 创建Resource
  res.resource = await factory.createRdfResource(iri);
  next();
}

export const setCommonPropertyValues = async (req, res) => {
  const { label, comment, seeAlso } = req.body;
  const operations = [
    { iri: RDFS.label, value: label },
    { iri: RDFS.comment, value: comment },
    { iri: RDFS.seeAlso, value: seeAlso },
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

router.put('/:iri', createResource, setCommonPropertyValues);
export default router;