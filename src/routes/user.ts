import { Router } from 'express';

const multer = require('multer');
const multerConfig = require('../config/multer');

import createFriendsRequest from '../controllers/user/createFriendRequest';
import findOrCreate from '../controllers/user/findOrCreateUser';
import getAllFriendsRequest from '../controllers/user/getAllFriendsRequests';
import UpdateUser from '../controllers/user/updateUser';
import verifyAccessToken from '../controllers/user/verifyAccessToken';
import createAddress from './../controllers/user/createAddress';

import {
  generateToken,
  verifyToken,
} from './../controllers/user/generateAndVerifyQRToken';

const router = Router();
router.post('/create', multer(multerConfig).single('userPhoto'), findOrCreate);
router.post('/update', multer(multerConfig).single('userPhoto'), UpdateUser);
router.post('/createAddress', createAddress);

router.get('/friend/token/', generateToken);
router.get('/friend/get/', getAllFriendsRequest);
router.get('/friend/create/', createFriendsRequest);
router.get('/friend/verifyToken/', verifyToken);

router.post('/access/verify/', verifyAccessToken);

export default router;
