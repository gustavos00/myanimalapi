import { Router } from 'express';
import pingEndpoint from '../controllers/GeneralController';

const router = Router();
router.get('/ping', pingEndpoint)

export default router;
