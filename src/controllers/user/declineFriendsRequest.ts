import { Request, Response } from 'express';
import friends from '../../models/Friends';

import * as US from '../../schemas/userSchema';

export interface DeclineFriendsProps {
  id: number;
}

const declineFriendsRequest = async (req: Request, res: Response) => {
  let validatedData;

  try {
    validatedData = await US.declineFriendsSchema.validateAsync(
      req.body as DeclineFriendsProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on create user address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    await friends.destroy({
      where: {
        idfriends: validatedData.id,
      },
    });
  } catch (e) {
    console.log('Error creating user address on user controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({ status: true });
};

export default declineFriendsRequest;
