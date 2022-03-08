import { Router } from 'express';

const multer = require('multer');
const multerConfig = require('../config/multer');
import removeVeterinarian from './../controllers/veterinarians/removeVeterinarian';
import acceptVeterinarian from '../controllers/veterinarians/acceptVeterinarian';
import getAllVeterinarians from '../controllers/veterinarians/getAllVeterinarians'

const router = Router();
router.get('/get', getAllVeterinarians)
router.post('/accept', acceptVeterinarian)
router.post('/remove', removeVeterinarian)

export default router;