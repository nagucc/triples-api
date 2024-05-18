/**
 * 管理rdf:Resource
 */

import express from 'express';
import { Factory, IRdfsClass, RDF, RDFS, RdfsClass, RdfsResource, rdf, rdfs } from 'nagu-owl';
import { options } from '../utils.ts';
const router = express.Router();
const factory = new Factory(options);

const getOrCreateClass = async (req, res, next) => {
  const { iri } = req.params; // Class的IRI
  if (!iri) return res.json({
    error: 'iri不能为空',
  });
  // 创建Class
  res.class = await factory.createRdfsClass(iri);
  next();
}
const getInstances = async (_req: any, res: {
  json: any; class: RdfsClass 
}) => {
  // 获取所有Instanec
  const resources = await res.class.instances();

  // 定义获取公共信息的函数
  const getCommonPvs = async (resource: RdfsResource) => {
    const [ labels, comments, seeAlsos, types ] = await Promise.all([
      rdfs.label, rdfs.comment, rdfs.seeAlso, rdf.type,
    ].map(p => resource.getPropertyValues(p)));
    return {
      iri: resource.iri.toString(),
      labels, comments, seeAlsos, types,
    };
  };
  const data = await Promise.all(resources.map(r => getCommonPvs(r)));

  res.json({
    data,
  });
}

export const setCommonPropertyValues = async (req, res) => {
  const { label, comment, seeAlso } = req.body;
  const operations = [
    { iri: RDFS.terms.label, value: label },
    { iri: RDFS.terms.comment, value: comment },
    { iri: RDFS.terms.seeAlso, value: seeAlso },
  ].map(async p => {
    if (!p.value) return null;
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

router.get('/:iri/instances', getOrCreateClass, getInstances);
// router.put('/:iri', getOrCreateResource, setCommonPropertyValues);
// router.post('/:iri', getOrCreateResource, removeCommonPropertyValues, setCommonPropertyValues);
export default router;