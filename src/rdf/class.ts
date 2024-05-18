/**
 * 管理rdf:Resource
 */

import express from 'express';
import { Factory, IRdfsClass, RDF, RDFS, RdfsResource } from 'nagu-owl';
import { options } from '../utils.ts';
import { getOrCreateResource } from './resource'
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
const getInstances = async (req: { class: IRdfsClass }, res) => {
  const data = await req.class.instances();
  res.json({
    data,
  });
}

const getCommonPropertyValues = async (req, res) => {
  const operations = [
    RDFS.terms.label,
    RDFS.terms.comment,
    RDFS.terms.seeAlso,
  ].map(async p => {
    // 获取原值
    const os = await res.resource.getPropertyValues(await factory.createRdfProperty(p));
  });
  const [label, comment, seeAlso] = await Promise.all(operations);
  res.json({
    data: {
      label, comment, seeAlso,
    }
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