import { Request, Response } from 'express';
import friends from '../../models/Friends';
import generateRandom from '../../utils/random';

import * as US from '../../schemas/userSchema';

export interface AcceptFriendsProps {
  id: number;
}

const acceptFriendRequest = async (req: Request, res: Response) => {
  let validatedData;
  const fingerprint = generateRandom();

  try {
    validatedData = await US.acceptFriendsSchema.validateAsync(
      req.query as unknown as AcceptFriendsProps
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
    await friends.update(
      { status: 'Accepted', fingerprint },
      {
        where: {
          idfriends: validatedData.id,
        },
      }
    );
  } catch (e) {
    console.log('Error creating user address on user controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({ fingerprint });
};

export default acceptFriendRequest;
