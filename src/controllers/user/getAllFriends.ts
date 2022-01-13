import { Request, Response } from 'express';
import friends from '../../models/Friends';
import users from '../../models/User';
import * as US from '../../schemas/userSchema';

interface getAllFriendsDataProps {
  id: string;
}

const getAllFriends = async (req: Request, res: Response) => {
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
      'Error validating user data on get all friends controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await friends.findAll({
      where: { toWhom: validatedData.id, status: 'Accepted' },
      include: [{ model: users, as: 'fromWhoFk' }],
    });
    console.log(response);
    res.status(200).send(response);
  } catch (e: any) {
    console.log(
      'Error finding all friends request on get all friends controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
};

export default getAllFriends;
