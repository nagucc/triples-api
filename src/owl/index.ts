import express from 'express';
import resourceRoutes from './resource';
import propertyRoutes from './property';

const router = express.Router();
router.use('/resource', resourceRoutes);
router.use('/property', propertyRoutes);

export default router;
