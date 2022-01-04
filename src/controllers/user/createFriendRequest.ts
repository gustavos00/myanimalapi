import { Request, Response } from 'express';
import friends from '../../models/Friends';
import * as US from '../../schemas/userSchema';

interface createFriendRequestProps {
  fromWho: string;
  toWhom: string;
}

const createFriendsRequest = async (req: Request, res: Response) => {
  let validatedData;

  try {
    validatedData = await US.createFriendsRequestSchema.validateAsync(
      req.query as unknown as createFriendRequestProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log(
      'Error validating user data on create friends request controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await friends.create({
      userToWhom: validatedData.toWhom,
      userFromWho: validatedData.fromWho,
    });
    res.status(200).send(response);
  } catch (e: any) {
    console.log(
        'Error creating friend request on create friends request controller'
      );
      res.status(500).send({ message: 'Something went wrong' });
      throw new Error(e);
  }
};

export default createFriendsRequest;
