/**
 * 管理rdf:Resource
 */

import express from 'express';
import { Factory, RdfsResource } from 'nagu-owl';
import { options } from '../utils.ts';
import { IRdfsResource } from 'nagu-owl-types';

const router = express.Router();
const factory = new Factory(options);
/**
 * 添加Resource，存放在res.resource
 */
const getOrCreateResource = async (req, res, next) => {
  const { iri } = req.params; // Resource的IRI
  if (!iri) return res.json({
    error: 'iri不能为空',
  });
  // 创建Resource
  res.resource = await factory.createRdfsResource(iri).catch(error => res.json({ error }));
  if (res.resource) next();
}

const getAnnotations = async (req, res) => {
  const resource = res.resource as IRdfsResource;
  const data = await resource.getAnnotations();
  res.json({
    data,
  });
}
export const setAnnotations = async (req, res) => {
  const resource = res.resource as IRdfsResource;
  await resource.setAnnotations(req.body);
  const { iri } = resource;
  res.json({
    data: {
      iri,
      ...req.body,
    },
  });
}

const getPropertyValues = async (req, res) => {
  const { piri } = req.params;
  const resource = res.resource as IRdfsResource;
  const vs = await resource.getPropertyValues(piri);
  const data = await Promise.all(vs.map(v => v.getAnnotations()));
  res.json({
    data,
  });
}
const setPropertyValue = async (req, res) => {
  const { piri } = req.params;
  const { value } = req.body;
  const resource = res.resource as IRdfsResource;
  try {
    const data = await resource.setPropertyValue(piri, value);
    res.json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
}

const removeType = async (req, res) => {
  const { type } = req.body;
  const resource = res.resource as IRdfsResource;
  const data = await resource.removeType(type).catch(error => res.status(500).json({ error }));
  res.json({
    data,
  });
}

// const batchRetriveAnnotations = async (req, res) => {
//   const iris = req.body.iris as Array<string>;
//   const iri
// }


router.get('/:iri', getOrCreateResource, getAnnotations);
router.put('/:iri', getOrCreateResource, setAnnotations);
router.post('/:iri', getOrCreateResource, setAnnotations);
router.get('/:iri/property/:piri/value', getOrCreateResource, getPropertyValues);
/**
 * 设置属性值
 */
router.post('/:iri/property/:piri', getOrCreateResource, setPropertyValue);

/**
 * 移除资源的type
 */
router.post('/:iri/remove-type', getOrCreateResource, removeType)
// router.post('/batch-retrive-annotations', )

export default router;