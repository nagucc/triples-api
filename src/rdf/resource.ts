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
  if (!iri) return res.json({
    error: 'iri不能为空',
  });
  // 创建Resource
  res.resource = await factory.createRdfsResource(iri);
  next();
}

const getAnnotations = async (req, res: {
  json: any; resource: RdfsResource
}) => {
  // const operations = [
  //   RDFS.terms.label,
  //   RDFS.terms.comment,
  //   RDFS.terms.seeAlso,
  // ].map(async p => {
  //   // 获取原值
  //   const os = await res.resource.getPropertyValues(await factory.createRdfProperty(p));
  // });
  await res.resource.getAnnotations();
  const { iri, label, comment, seeAlso } = res.resource;
  res.json({
    data: {
      iri,
      label: label.toString(),
      comment: comment.toString(),
      seeAlso: seeAlso.toString(),
    }
  });
}
export const setAnnotations = async (req, res: {
  json: any; resource: RdfsResource 
}) => {
  // const { label, comment, seeAlso } = req.body;
  await res.resource.setAnnotations(req.body);
  // const operations = [
  //   { iri: RDFS.terms.label, value: label },
  //   { iri: RDFS.terms.comment, value: comment },
  //   { iri: RDFS.terms.seeAlso, value: seeAlso },
  // ].map(async p => {
  //   if (!p.value) return null;
  //   return res.resource.setPropertyValues(p.iri, p.value);
  // });
  // await Promise.all(operations);
  const { iri } = res.resource;
  res.json({
    data: {
      iri,
      // label,
      // comment,
      // seeAlso,
    },
  });
}

// export const removeCommonPropertyValues = async (_req: any, res: { resource: RdfsResource; }, next: () => void) => {
//   const operations = [
//     RDFS.terms.label,
//     RDFS.terms.comment,
//     RDFS.terms.seeAlso,
//   ].map(async p => {
//     // 获取原值
//     const os = await res.resource.getPropertyValues(p);
//     // 删除原值
//     await Promise.all(os.map(o => res.resource.removePropertyValue(p, o)));
//   });
//   next();
// }

router.get('/:iri', getOrCreateResource, getAnnotations);
router.put('/:iri', getOrCreateResource, setAnnotations);
router.post('/:iri', getOrCreateResource, /*removeCommonPropertyValues,*/ setAnnotations);
export default router;