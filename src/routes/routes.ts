import { Router } from 'express';
import generalRoutes from './general'
import userRoutes from './user'

const router = Router();
router.use('/general', generalRoutes)
router.use('/user', userRoutes)

export default router;
