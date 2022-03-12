import { Router } from 'express';

import generalRoutes from './general';
import userRoutes from './user';
import animalRoutes from './animal';
import veterinariansRoutes from './veterinarians';

const router = Router();
router.use('/general', generalRoutes);
router.use('/user', userRoutes);
router.use('/animal', animalRoutes);
router.use('/veterinarian', veterinariansRoutes);

export default router;
