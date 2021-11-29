import { Router } from 'express';

const userRoutes = require('./user.ts');
const generalRoutes = require('./general.ts');
const animalRoutes = require('./animal.ts');
const router = Router();

router.use('/general', generalRoutes)
router.use('/user', userRoutes)
router.use('/animal', animalRoutes)

export default router;