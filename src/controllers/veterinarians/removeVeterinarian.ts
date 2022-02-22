import { Request, Response } from 'express';
import animal from '../../models/Animal';

import * as VS from '../../schemas/veterinarianSchema';

interface RemoveVeterinarianProps {
  veterinarianId: number;
  animalId: number;
}

const removeVeterinarian = async (req: Request, res: Response) => {
  let validatedData;

  try {
    validatedData = await VS.removeVeterinarian.validateAsync(
      req.body as unknown as RemoveVeterinarianProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on accept veterinarian controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Updating animal
  try {
    await animal.update(
      {
        userIdVeterinarian: null,
      },
      {
        where: {
          idAnimal: validatedData.animalId,
        },
      }
    );
  } catch (e) {
    console.log('Error updating animal on remove veterinarian controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({});
};

export default removeVeterinarian;
