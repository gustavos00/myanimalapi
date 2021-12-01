import { Router } from 'express';
import * as animalController from '../controllers/animalController';

const router = Router();
router.post('/create', animalController.create);
//router.post('/update')
//router.post('/read')

export default router;
