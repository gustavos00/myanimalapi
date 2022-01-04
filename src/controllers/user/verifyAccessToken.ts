import * as US from '../../schemas/userSchema';

import { Request, Response } from 'express';

const JWT = require('jsonwebtoken');

interface ValidateAccessTokenProps {
  token: string;
  salt: string;
}

const verifyAccessToken = async (req: Request, res: Response) => {
  let validatedData;
  let userData;

  //Validate data
  try {
    validatedData = await US.verifyAccessTokenSchema.validateAsync(
      req.body as unknown as ValidateAccessTokenProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on create user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Decrypting token
  try {
    userData = JWT.verify(
      validatedData.token,
      validatedData.salt
    );
  } catch (e: any) {
    console.log('Error verifing token on verifyToken controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(userData);
};

export default verifyAccessToken;
