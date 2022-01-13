import { Request, Response } from 'express';
import friends from '../../models/Friends';

import * as US from '../../schemas/userSchema';

export interface FriendsProps {
  idfriends: number;
  status: string;
  userfromWho: number;
  usertoWhom: number;
  fromWhoFk: Object;
}

const acceptFriendRequest = async (req: Request, res: Response) => {
  let validatedData;
  console.log(validatedData);

  try {
    validatedData = await US.acceptFriendsSchema.validateAsync(
      req.query as unknown as FriendsProps
    );

    console.log(validatedData);

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
      { status: 'Accepted' },
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

  res.status(200).send({});
};

export default acceptFriendRequest;
