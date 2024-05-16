/**
 * 管理rdf:Property
 */

import express from 'express';
import { Factory, RDF, RDFS } from 'nagu-owl';
import { options } from '../utils.ts';
import { setCommonPropertyValues } from './resource.ts';

const router = express.Router();
const factory = new Factory(options);
/**
 * 添加Property
 */
const createProperty = async (req ,res) => {
  const { iri } = req.params; // Property的IRI
  
  // 创建Resource
  const resource = await factory.createRdfProperty(iri);
  res.json({
    data: resource,
  });
}

router.put('/:iri', createProperty, setCommonPropertyValues);
export default router;