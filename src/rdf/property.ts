/**
 * 管理rdf:Property
 */

import express from 'express';
import { Factory, RDF, RdfProperty } from 'nagu-owl';
import { options } from '../utils.ts';
import { setAnnotations } from './resource.ts';

const router = express.Router();
const factory = new Factory(options);
/**
 * 添加Property
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
  const cls = res.resource as RdfProperty;
  const data = await cls.destroy().catch(error => res.json({ error }));
  res.json({
    ret: 0,
    data,
  });
}

/**
 * 添加Property
 */
router.put('/:iri', getOrCreateProperty, setAnnotations);
/**
 * 修改Property
 */
router.post('/:iri', getOrCreateProperty, setAnnotations);

/**
 * 删除属性
 */
router.delete('/:iri', getOrCreateProperty, destoryProperty);
export default router;