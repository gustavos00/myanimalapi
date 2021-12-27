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
router.post('/update')

router.get('/status', UC.status)

router.get('/friend/token/', UC.generateToken)
router.get('/friend/verifyToken/', UC.verifyToken)

export default router;
