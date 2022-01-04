import { Request, Response } from 'express';

import user from '../../models/User';
import friends from '../../models/Friends';

import * as US from '../../schemas/userSchema';

const JWT = require('jsonwebtoken');

interface GenerateToken {
  id: string;
}

interface StatusProps {
  status: string;
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
      req.query as unknown as GenerateToken
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

  res.status(200).send({ token });
};

export const verifyToken = async (req: Request, res: Response) => {
  let validatedData;
  let userData;
  let tokenData;
  let friendsResponse;

  //Validate data
  try {
    validatedData = await US.verifyTokenSchema.validateAsync(
      req.query as unknown as VerifyToken
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
      where: { email: tokenData.email, idUser: tokenData.id },
    });
  } catch (e: any) {
    console.log('Error finding user by token on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Creating a friend request
  console.log(userData)
  console.log(validatedData)
  try {
    friendsResponse = await friends.create({
      userToWhom: userData?.idUser,
      userFromWho: validatedData.fromWho,
    });
  } catch (e: any) {
    console.log('Error finding user by token on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(friendsResponse);
};

