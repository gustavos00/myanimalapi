import { Request, Response } from 'express';
import { sendNotifications } from '../../utils/notifications';

import user from '../../models/User';

import * as US from '../../schemas/userSchema';
import friends from '../../models/Friends';

const JWT = require('jsonwebtoken');

interface GenerateToken {
  id: string;
}

interface VerifyToken {
  token: string;
  fromWho: string;
}

export const generateToken = async (req: Request, res: Response) => {
  let validatedData;
  let token;

  //Validate data
  try {
    validatedData = await US.generateTokenSchema.validateAsync(
      req.body as unknown as GenerateToken
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log(
      'Error validating user data on generate and verify QR controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Generate token
  try {
    token = await JWT.sign(validatedData, process.env.JWT_SECRET as string);
  } catch (e: any) {
    console.log('Error decrypting token on generate and verify QR controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  console.log(token);
  res.status(200).send({ token });
};

export const verifyToken = async (req: Request, res: Response) => {
  let validatedData;
  let userData;
  let tokenData;
  let friendRequestHasCreated;

  //Validate data
  try {
    validatedData = await US.verifyTokenSchema.validateAsync(
      req.body as unknown as VerifyToken
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating data on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Decrypting token
  try {
    tokenData = JWT.verify(
      validatedData.token,
      process.env.JWT_SECRET as string
    );
  } catch (e: any) {
    console.log('Error verifing token on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Finding user
  try {
    userData = await user.findOne({
      where: { email: tokenData.email, isVeterinarian: false },
    });
  } catch (e: any) {
    console.log('Error finding user by token on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await friends.findOrCreate({
      where: {
        userFriendsIdToWho: userData?.idUser,
        userFriendsIdFromWho: validatedData.fromWho,
      },
      defaults: {
        userFriendsIdToWho: userData?.idUser,
        userFriendsIdFromWho: validatedData.fromWho,
      },
    })

    //TO DO -> NEED TO FIND WHEN IS CREATED
    const [created] = response;
    friendRequestHasCreated = !created;
    console.log(response)

    created
      ? res.status(200).send({ message: 'Friend relatioship already exist' })
      : res.status(201).send({ message: 'created' });
  } catch (e: any) {
    console.log('Error creating friends request on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  if (friendRequestHasCreated) {
    const receipt = await sendNotifications({
      expoToken: userData?.expoToken,
      title: 'Friend Request',
      message: 'Hello! Someone send you a friend request!',
      data: { do: 'openScreen', screenName: 'friendsRequests' },
    });
  }
};
