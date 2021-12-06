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

router.post(
  '/update/',
  multer(multerConfig).single('animalPhoto'),
  animalController.updateAnimal
);
router.delete('/delete/:id', animalController.deleteAnimal);

router.get('/findMyAnimal/', animalController.findMyAnimal);

export default router;
