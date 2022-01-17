import { Router } from 'express';
const multer = require('multer');
const multerConfig = require('../config/multer');

import findOrCreate from '../controllers/user/findOrCreateUser';
import getAllFriendsRequest from '../controllers/user/getAllFriendsRequests';
import storeExpoToken from '../controllers/user/storeExpoToken';
import UpdateUser from '../controllers/user/updateUser';
import verifyAccessToken from '../controllers/user/verifyAccessToken';
import createAddress from './../controllers/user/createAddress';
import acceptFriendRequest from '../controllers/user/acceptFriendsRequest';
import getAllFriends from '../controllers/user/getAllFriends';
import declineFriendsRequest from '../controllers/user/declineFriendsRequest';

import {
  generateToken,
  verifyToken,
} from './../controllers/user/generateAndVerifyQRToken';

const router = Router();
router.post('/create', multer(multerConfig).single('userPhoto'), findOrCreate);
router.post('/update', multer(multerConfig).single('userPhoto'), UpdateUser);
router.post('/createAddress', createAddress);
router.post('/expoToken', storeExpoToken);

router.get('/friends/token/', generateToken);
router.get('/friends/getPending/', getAllFriendsRequest);
router.get('/friends/getAccepted/', getAllFriends);
router.get('/friends/verifyToken/', verifyToken);
router.get('/friends/accept/', acceptFriendRequest);
router.get('/friends/decline/', declineFriendsRequest);

router.post('/access/verify/', verifyAccessToken);

export default router;
