import { Router } from 'express';
import * as userController from '../controllers/userController';

const multer = require('multer');
const multerConfig = require('../config/multer');

const router = Router();
router.post(
  '/create',
  multer(multerConfig).single('userPhoto'),
  userController.createUser
);
//router.get('/update')
//router.get('/read')

//router.get('/payment/pin')
//router.get('/payment/create')
//router.get('/payment/delete')

export default router;
