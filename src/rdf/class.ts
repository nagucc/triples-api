/**
 * 管理rdfs:Class
 */

import express from 'express';
import { Factory, RdfsClass, RdfsResource } from 'nagu-owl';
import { options } from '../utils.ts';
import { setAnnotations } from './resource.ts';
import { IRdfsClass, IRdfsResource } from 'nagu-owl-types';
const router = express.Router();
const factory = new Factory(options);

const getOrCreateClass = async (req, res, next) => {
  const { iri } = req.params; // Class的IRI
  if (!iri) return res.json({
    error: 'iri不能为空',
  });
  // 创建Class
  res.resource = await factory.createRdfsClass(iri);
  next();
}
const getInstances = async (_req: any, res: {
  json: any; class: RdfsClass 
}) => {
  // 获取所有Instance
  const resources = await res.class.instances();

  // 定义获取公共信息的函数
  const getCommonPvs = async (resource: RdfsResource) => {
    // 获取Annotations
    await resource.getAnnotations();
    // 获取type
    const types = await resource.types();
    // 读取type的Annotations
    await Promise.all(types.map(t => t.getAnnotations()));
    return {
      iri: resource.iri.toString(),
      label: resource.label,
      comment: resource.comment,
      seeAlso: resource.seeAlso,
      types: types.map(t => ({
        iri: t.iri.toString(),
        label: t.label,
        comment: t.comment,
        seeAlso: t.seeAlso,
      })),
    }
  };
  const data = await Promise.all(resources.map(r => getCommonPvs(r)));
  res.json({
    data,
  });
}

const destoryClass = async (req, res) => {
  const cls = res.resource as RdfsClass;
  await cls.destroy();
  res.json({
    ret: 0,
  });
}




router.get('/:iri/instances', getOrCreateClass, getInstances);
router.put('/:iri', getOrCreateClass, setAnnotations);
router.delete('/:iri', getOrCreateClass, destoryClass)
export default router;