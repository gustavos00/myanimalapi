import { Request, Response } from 'express';
import animal from '../../models/Animal';

import * as VS from '../../schemas/veterinarianSchema';
import generateRandom from '../../utils/random';

interface AcceptVeterinarianProps {
  veterinarianId: number;
  animalId: number;
}

const acceptVeterinarian = async (req: Request, res: Response) => {
  let validatedData;
  const fingerprint = generateRandom();

  try {
    validatedData = await VS.acceptVeterinarian.validateAsync(
      req.body as unknown as AcceptVeterinarianProps
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

  try {
    await animal.update(
      {
        userIdVeterinarian: validatedData.veterinarianId,
        veterinarianChatFingerprint: fingerprint,
      },
      {
        where: {
          idAnimal: validatedData.animalId,
        },
      }
    );
  } catch (e) {
    console.log('Error updating animal on accept veterinarian controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({ veterinarianFingerprint: fingerprint });
};

export default acceptVeterinarian;
