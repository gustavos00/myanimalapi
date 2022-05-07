import { FriendsInstance } from '../../models/Friends';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import friends from '../../models/Friends';
import users, { UsersInstance } from '../../models/User';
import * as US from '../../schemas/userSchema';

interface getAllFriendsDataProps {
  id?: string;
}

const getAllFriendsRequest = async (req: Request, res: Response) => {
  let validatedData: getAllFriendsDataProps;
  let friendsRequestData: Array<FriendsInstance> = [];
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
    console.log(
      'Error validating user data on get all friends requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    friendsRequestData = await friends.findAll({
      nest: true,
      raw: true,
      where: {
        status: 'Pending',
        [Op.or]: [
          { userFriendsIdToWho: validatedData.id },
          { userFriendsIdFromWho: validatedData.id },
        ],
      },
      include: [
        { model: users, as: 'userFriendsIdtoWhoFk' },
        { model: users, as: 'userFriendsIdFromWhoFk' },
      ],
    });

    friendsRequestData.forEach((element: FriendsInstance) => {
      let friendData;

      if (
        element.userFriendsIdFromWhoFk?.idUser.toString() == validatedData.id
      ) {
        friendData = element.userFriendsIdtoWhoFk;
      }

      if (element.userFriendsIdtoWhoFk?.idUser.toString() == validatedData.id) {
        friendData = element.userFriendsIdFromWhoFk;
      }

      delete element.userFriendsIdtoWhoFk;
      delete element.userFriendsIdFromWhoFk;

      const friendObj = {
        ...element,
        friendData,
        fromWhoId: element.userFriendsIdFromWho
      };

      friendArray.push(friendObj as unknown as UsersInstance);
    });
  } catch (e: any) {
    console.log(
      'Error finding all friends request on get all friends requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send(friendArray);
};

export default getAllFriendsRequest;
