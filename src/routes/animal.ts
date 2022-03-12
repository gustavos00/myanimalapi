import { Router } from 'express';
import createAnimal from '../controllers/animal/createAnimal';
import deleteAnimal from '../controllers/animal/deleteAnimal';
import findMyAnimal from '../controllers/animal/findMyAnimal';
import getMedicalEvents from '../controllers/animal/getMedicalEvents';
import updateAnimal from '../controllers/animal/updateAnimal';
findMyAnimal;

const multer = require('multer');
const multerConfig = require('../config/multer');

const router = Router();

router.post(
  '/create',
  multer(multerConfig).single('animalPhoto'),
  createAnimal
);

router.post(
  '/update/',
  multer(multerConfig).single('animalPhoto'),
  updateAnimal
);
router.delete('/delete/:id', deleteAnimal);

router.get('/findMyAnimal', findMyAnimal);
router.get('/medicalEvents', getMedicalEvents);

export default router;
