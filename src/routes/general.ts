import { Router } from 'express';
import pingEndpoint from '../controllers/generalController';

const router = Router();
router.get('/ping', pingEndpoint);

export default router;
