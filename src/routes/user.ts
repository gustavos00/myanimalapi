import { Router } from 'express';
const multer = require('multer');
const multerConfig = require('../config/multer');

import findOrCreate from '../controllers/user/findOrCreateUser';
import verifyAccessToken from '../controllers/user/verifyAccessToken';
import createAddress from './../controllers/user/createAddress';
import {
  generateToken,
  verifyToken,
} from './../controllers/user/generateAndVerifyQRToken';

const router = Router();
router.post('/create', multer(multerConfig).single('userPhoto'), findOrCreate);
router.post('/createAddress', createAddress);

router.get('/friend/token/', generateToken);
router.get('/friend/verifyToken/', verifyToken);

router.post('/access/verify/', verifyAccessToken);

export default router;
