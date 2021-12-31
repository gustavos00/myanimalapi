import { Request, Response } from 'express';
import friendRequest from '../../models/FriendRequest';
import * as US from '../../schemas/userSchema';

interface getAllFriendsRequestProps {
  id: string;
}

const getAllFriendsRequest = async (req: Request, res: Response) => {
  let validatedData;

  try {
    validatedData = await US.getAllFriendsRequest.validateAsync(
      req.query as unknown as getAllFriendsRequestProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
    res.status(200).send({ message: true });
  } catch (e: any) {
    console.log(
      'Error validating user data on generate and verify QR controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await friendRequest.findAll({ where: { toWhom: validatedData.id } });
    console.log(response)
  } catch (e) {
    console.log(e);
  }
};

export default getAllFriendsRequest;
