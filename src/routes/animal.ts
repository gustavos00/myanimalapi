import { Router } from 'express';
import * as animalController from '../controllers/animalController';

const multer = require('multer');
const multerConfig = require('../config/multer');

const router = Router();
router.post(
  '/create',
  multer(multerConfig).single('animalPhoto'),
  animalController.createAnimal
);
router.delete('/delete/:id', animalController.deleteAnimal);
router.post('/update');
//router.post('/read')

export default router;
