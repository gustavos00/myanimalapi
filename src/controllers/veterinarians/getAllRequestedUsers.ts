import { Request, Response } from 'express';

import * as VS from '../../schemas/veterinarianSchema';
import animal from '../../models/Animal';
import users from '../../models/User';

interface getAllFriendsDataProps {
  id?: string;
}

const getNotAcceptedOwners = async (req: Request, res: Response) => {
  let validatedData;
  try {
    validatedData = await VS.getVeterinarianAnimalsSchema.validateAsync(
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
  console.log(validatedData.id)

  try {
    const response = await animal.findAll({
      raw: true,
      nest: true,
      include: [{model: users}],
      where: {
        userIdVeterinarian: validatedData.id,
        veterinarianAcceptedRequest: false,
      },
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
