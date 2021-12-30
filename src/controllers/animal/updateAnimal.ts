import { Request, Response } from 'express';

import * as AS from '../../schemas/animalSchema';

import animal from '../../models/Animal';

interface UpdateAnimalProps {
  name: string;
  age: string;
  breed: string;
  birthday: string;
  birthdayMonth: string;
  trackNumber: string;

  email: string;
}

interface MulterRequest extends Request {
  file: any;
}

const updateAnimal = async (req: Request, res: Response) => {
  const { location, key } = (req as MulterRequest).file;
  let validatedData;
  let updateResponse;

  //Validate data
  try {
    validatedData = await AS.updateAnimalSchema.validateAsync(
      req.body as UpdateAnimalProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on update animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Checking if already exist a trackNumber but from another animal
  try {
    const findResponse = await animal.findOne({
      where: { trackNumber: validatedData.trackNumber },
    });

    if (
      validatedData.trackNumber == findResponse?.trackNumber &&
      validatedData.id != findResponse?.idAnimal
    ) {
      res.status(400).send({ message: 'This track number already exist' });
      return;
    }
  } catch (e) {
    console.log('Error getting owner data on update animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Updating animal
  try {
    updateResponse = await animal.update(
      {
        ...validatedData,
        photoUrl: location,
        photoName: key,
      },
      {
        where: {
          idAnimal: validatedData.id,
        },
      }
    );
  } catch (e) {
    console.log('Error updating animal on update animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send(updateResponse);
};

export default updateAnimal