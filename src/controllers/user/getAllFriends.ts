import { Request, Response } from 'express';
import { object } from 'joi';
import { Op } from 'sequelize';
import friends from '../../models/Friends';
import users from '../../models/User';
import * as US from '../../schemas/userSchema';

interface getAllFriendsDataProps {
  id: string;
}

const getAllFriends = async (req: Request, res: Response) => {
  let validatedData: getAllFriendsDataProps;
  let friendsData: any;
  let friendArray: any[] = [];
  //TODO -> FIX ANY

  try {
    validatedData = await US.getAllFriendsDataSchema.validateAsync(
      req.query as unknown as getAllFriendsDataProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on get all friends controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    friendsData = await friends.findAll({
      nest: true,
      raw: true,
      where: {
        status: 'Accepted',
        [Op.or]: [{ fromWho: validatedData.id }, { toWhom: validatedData.id }],
      },
      include: [
        { model: users, as: 'fromWhoFk' },
        { model: users, as: 'toWhomFk' },
      ],
    });

    friendsData.forEach((element: any) => {
      let friendData;

      if (element.fromWhoFk.idUser == validatedData.id) {
        friendData = element.toWhomFk;
      }

      if (element.toWhomFk.idUser == validatedData.id) {
        friendData = element.fromWhoFk;
      }

      delete element.toWhomFk;
      delete element.fromWhoFk;

      const friendObj = {
        ...element,
        friendData,
      };

      friendArray.push(friendObj);
    });

    if (friendArray.length === 0) {
    }
  } catch (e: any) {
    console.log(
      'Error finding all friends request on get all friends controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  console.log(friendArray);
  res.status(200).send(friendArray);
};

export default getAllFriends;
