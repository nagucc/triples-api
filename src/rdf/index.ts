import express from 'express';
import resourceRoutes from './resource';
import propertyRoutes from './property';
import classRoutes from './class';

const router = express.Router();
router.use('/resource', resourceRoutes);
router.use('/property', propertyRoutes);
router.use('/class', classRoutes);

export default router;
