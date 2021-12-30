import { Request, Response } from 'express';

import * as AS from '../../schemas/animalSchema';

import animal from '../../models/Animal';
import user from '../../models/User';

interface UserAddressProps {
  idAddress: number;
  doorNumber: string;
  postalCode: string;
  streetName: string;
  parishIdParish: number;
  parish: object;
}

interface UserAddressParishProps {
  idParish: number;
  parishName: string;
  localityIdLocality: number;
  locality: object;
}

interface CreateAnimalProps {
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

const createAnimal = async (req: Request, res: Response) => {
  const { location, key } = (req as MulterRequest).file;
  let validatedData;
  let userId;
  let createAnimalResponse;

  //Validate data
  try {
    validatedData = await AS.createAnimalSchema.validateAsync(
      req.body as CreateAnimalProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on create animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Find user id
  try {
    const response = await user.findOne({
      where: { token: validatedData.token },
    });

    if (!response) {
      res.status(404).send({ message: 'Cannot find owner data' });
      return;
    }

    userId = response.idUser;
  } catch (e) {
    console.log('Error getting owner data on create animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Finding if tracknumber already exist
  try {
    const response = await animal.findOne({
      where: {
        trackNumber: validatedData.trackNumber,
      },
    });

    if (response) {
      res.status(400).send({ message: 'This track number already exist' });
      return;
    }
  } catch (e) {
    console.log(
      'Error verifying if trackCode is on use on create animal controller'
    );

    res.status(500).send({ message: 'Something went wrong' });

    throw new Error(e as string);
  }

  //Create animal
  try {
    createAnimalResponse = await animal.create({
      ...validatedData,
      userIdUser: userId,
      photoUrl: location,
      photoName: key,
    });
  } catch (e) {
    console.log('Error creating animal on create animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(201).send(createAnimalResponse);
};

export default createAnimal