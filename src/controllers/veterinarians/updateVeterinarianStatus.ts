import * as VS from '../../schemas/veterinarianSchema';

import { Request, Response } from 'express';

import animal from '../../models/Animal';

interface UpdateVeterinarianStatusProps {
  idEvents: number;
}

const updateVeterinarianStatus = async (req: Request, res: Response) => {
  let validatedData;
  console.log(req.query);
  console.log(req.body);

  //Validate data
  try {
    validatedData = await VS.updateVeterinarianStatus.validateAsync(
      req.body as UpdateVeterinarianStatusProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on update event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    animal.update(
      {
        veterinarianAcceptedRequest: true,
      },
      {
        where: { idAnimal: validatedData.id },
      }
    );
  } catch (e: any) {
    console.log('Error updating user data on update event controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res.status(200).send({ data: validatedData });
};

export default updateVeterinarianStatus;
