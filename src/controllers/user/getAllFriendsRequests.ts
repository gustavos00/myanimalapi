import { Request, Response } from 'express';
import friends from '../../models/Friends';
import * as US from '../../schemas/userSchema';

interface getAllFriendsDataProps {
  id: string;
}

const getAllFriendsRequest = async (req: Request, res: Response) => {
  let validatedData;

  try {
    validatedData = await US.getAllFriendsDataSchema.validateAsync(
      req.query as unknown as getAllFriendsDataProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log(
      'Error validating user data on get all friends requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await friends.findAll({
      where: { userToWhom: validatedData.id, status: 'Pending' },
    });
    console.log(response);
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
  }
};

export default getAllFriendsRequest;
