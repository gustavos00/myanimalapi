import { Router } from 'express';
const multer = require('multer');
const multerConfig = require('../config/multer');

import LoginUser from '../controllers/user/LoginUser';
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
router.post('/create', multer(multerConfig).single('userPhoto'), LoginUser);
router.post('/update', multer(multerConfig).single('userPhoto'), UpdateUser);
router.post('/createAddress', createAddress);
router.post('/expoToken', storeExpoToken);

router.get('/friends/getPending/', getAllFriendsRequest);
router.get('/friends/getAccepted/', getAllFriends);

router.post('/friends/token/', generateToken);
router.post('/friends/verifyToken/', verifyToken);

router.post('/friends/accept/', acceptFriendRequest);
router.post('/friends/decline/', declineFriendsRequest);

router.post('/access/verify/', verifyAccessToken);

export default router;
