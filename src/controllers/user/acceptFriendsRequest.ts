import { Request, Response } from 'express';
import friends from '../../models/Friends';
import generateRandom from '../../utils/random';

import * as US from '../../schemas/userSchema';
import { sendNotifications } from '../../utils/notifications';
import users from '../../models/User';

export interface AcceptFriendsProps {
  id: number;
}

const acceptFriendRequest = async (req: Request, res: Response) => {
  let validatedData;
  let friendsData;
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
    console.log('Error validating data on accept friend request controller');

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
    console.log(
      'Error updating friend status on accept friend request controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    friendsData = await friends.findOne({
      where: {
        idfriends: validatedData.id,
      },
      include: [
        { model: users, as: 'userFriendsIdtoWhoFk' },
        { model: users, as: 'userFriendsIdFromWhoFk' },
      ],
    });
  } catch (e) {
    console.log(
      'Error updating friend status on accept friend request controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  const receipt = await sendNotifications({
    expoToken: friendsData?.userFriendsIdFromWhoFk?.expoToken,
    title: 'Friend Request',
    message: `Hello! ${friendsData?.userFriendsIdtoWhoFk?.givenName} accepted your friend request!`,
    data: { do: 'openScreen', screenName: 'friendsRequests' },
  });

  res.status(200).send({ fingerprint });
};

export default acceptFriendRequest;
