import { Request, Response } from 'express';

import * as VS from '../../schemas/veterinarianSchema';
import users from '../../models/User';
import animal from '../../models/Animal';

interface getAllFriendsDataProps {
  id?: string;
}

const getNotAcceptedOwners = async (req: Request, res: Response) => {
  let validatedData;
  try {
    validatedData = await VS.getNotAcceptedOwnersSchema.validateAsync(
      req.query as unknown as getAllFriendsDataProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log(
      'Error validating user data on get all veterinarian animals requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const response = await animal.findAll({
      raw: true,
      nest: true,
      where: {
        userIdVeterinarian: validatedData.id,
        veterinarianAcceptedRequest: false,
      },
      include: [{ model: users }],
    });
    console.log({
      userIdVeterinarian: validatedData.id,
      veterinarianAcceptedRequest: false,
    });
    res.status(200).send(response);
  } catch (e: any) {
    console.log(
      'Error finding all animals on get all veterinarian animals requests controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
};

export default getNotAcceptedOwners;
