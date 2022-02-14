import { Request, Response } from 'express';
import { object } from 'joi';
import { Op } from 'sequelize';
import friends, { FriendsInstance } from '../../models/Friends';
import users, { UsersInstance } from '../../models/User';
import * as US from '../../schemas/userSchema';

interface getAllFriendsDataProps {
  id: string;
}

const getAllFriends = async (req: Request, res: Response) => {
  let validatedData: getAllFriendsDataProps;
  let friendsData: Array<FriendsInstance> = [];
  let friendArray: Array<UsersInstance> = [];

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
        [Op.or]: [
          { userFriendsIdFromWho: validatedData.id },
          { userFriendsIdToWho: validatedData.id },
        ],
      },
      include: [
        { model: users, as: 'userFriendsIdFromWhoFk' },
        { model: users, as: 'userFriendsIdToWhoFk' },
      ],
    });

    friendsData.forEach((element: FriendsInstance) => {
      let friendData;

      if (
        element.userFriendsIdFromWhoFk?.idUser.toString() == validatedData.id
      ) {
        friendData = element.userFriendsIdToWhoFk;
      }

      if (element.userFriendsIdToWhoFk?.idUser.toString() == validatedData.id) {
        friendData = element.userFriendsIdFromWhoFk;
      }

      delete element.userFriendsIdToWhoFk;
      delete element.userFriendsIdFromWhoFk;

      const friendObj = {
        ...element,
        friendData,
      };

      friendArray.push(friendObj as unknown as UsersInstance);
    });
  } catch (e: any) {
    console.log(
      'Error finding all friends request on get all friends controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(friendArray);
};

export default getAllFriends;
