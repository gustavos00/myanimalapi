import { Router } from 'express';
import * as UC from '../controllers/userController';

const multer = require('multer');
const multerConfig = require('../config/multer');

const router = Router();
router.post(
  '/create',
  multer(multerConfig).single('userPhoto'),
  UC.createUser
);
router.post('/createAddress', UC.createAddress)
//router.get('/update')
//router.get('/read')

//router.get('/payment/pin')
//router.get('/payment/create')
//router.get('/payment/delete')

export default router;
