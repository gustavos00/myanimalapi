import { Router } from 'express';
import acceptVeterinarian from '../controllers/veterinarians/acceptVeterinarian';
const multer = require('multer');
const multerConfig = require('../config/multer');

import getAllVeterinarians from '../controllers/veterinarians/getAllVeterinarians'

const router = Router();
router.get('/get', getAllVeterinarians)
router.post('/accept', acceptVeterinarian)

export default router;