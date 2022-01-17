import Expo from 'expo-server-sdk';

import * as US from '../../schemas/userSchema';

import { Request, Response } from 'express';
import users from '../../models/User';

interface storeExpoTokenProps {
  expoToken: string;
  token: string;
}

const storeExpoToken = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await US.storeExpoTokenSchema.validateAsync(
      req.body as unknown as storeExpoTokenProps
    );

    const expoTokenIsValid = Expo.isExpoPushToken(validatedData.expoToken);

    if (!validatedData || !expoTokenIsValid) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on store expo token controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    await users.update(
      { expoToken: validatedData.expoToken },
      {
        where: {
          token: validatedData.token,
        },
      }
    );
  } catch (e: any) {
    console.log('Error finding user data on store expo token controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(validatedData);
};

export default storeExpoToken;
