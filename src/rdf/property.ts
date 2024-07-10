/**
 * 管理rdf:Property
 * /property
 */

import express from 'express';
import { Factory, RDF, RdfProperty } from 'nagu-owl';
import { getLogger, options } from '../utils.ts';
import { setAnnotations } from './resource.ts';

const router = express.Router();
const factory = new Factory(options);
const logger = getLogger('triples-api::/rdf/property');
/**
 * 获取或添加Property
 */
const getOrCreateProperty = async (req ,res) => {
  const { iri } = req.params; // Property的IRI
  
  // 创建Resource
  const resource = await factory.createRdfProperty(iri);
  res.json({
    data: resource,
  });
}

const destoryProperty = async (req, res) => {
  const { iri } = req.params; // Property的IRI
  // 创建Property
  const property = await factory.createRdfProperty(iri);
  const data = await property.destroy().catch(error => res.json({ error }));
  logger.info(`destoryProperty::删除triples ${data} 行.`);
  res.json({
    ret: 0,
    data,
  });
}

// /**
//  * 添加Property
//  */
// router.put('/:iri', getOrCreateProperty, setAnnotations);
// /**
//  * 修改Property
//  */
// router.post('/:iri', getOrCreateProperty, setAnnotations);

/**
 * 删除属性
 */
router.delete('/:iri', destoryProperty);
export default router;