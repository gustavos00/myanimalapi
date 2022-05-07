import { Request, Response } from 'express';

import * as US from '../../schemas/userSchema';

import friends from '../../models/Friends';

interface DeleteFriendProps {
  id: number;
}

export const deleteFriend = async (req: Request, res: Response) => {
  let validatedData;
  //Validate data
  try {
    validatedData = await US.deleteFriendSchema.validateAsync(
      req.body as DeleteFriendProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on delete friend controller');

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
    console.log('Error on delete friend controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({ status: true });
};

export default deleteFriend;
