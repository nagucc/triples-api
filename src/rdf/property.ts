/**
 * 管理rdf:Property
 */

import express from 'express';
import { Factory, RDF } from 'nagu-owl';
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

/**
 * 获取Property列表
 */
const listProperties = async (req, res) => {
  // 创建rdf:type 属性
  const rdfType = await factory.createRdfProperty(RDF.terms.type, false);

  // 读取rdf:Property的所有实例
  const data = await rdfType.instances();

  res.json({
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
 * 获取所有rdf:Property实例
 */
router.get('/list', listProperties);
export default router;