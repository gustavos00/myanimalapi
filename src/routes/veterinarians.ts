import { Router } from 'express';
const multer = require('multer');
const multerConfig = require('../config/multer');

import getAllVeterinarians from '../controllers/veterinarians/getAllVeterinarians'

const router = Router();
router.get('/get', getAllVeterinarians)

export default router;
