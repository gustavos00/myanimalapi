import * as AS from '../schemas/animalSchema';
import { Request, Response } from 'express';
import { animal } from '../models/Animal';
import { user } from '../models/User';

interface CreateAnimalProps {
  name: string;
  age: string;
  breed: string;
  birthday: string;
  birthdayMonth: string;
  trackNumber: string;

  email: string;
}

export const create = async (req: any, res: any) => {
  let validatedData;
  let userId;

  //Validate data
  try {
    validatedData = await AS.animalSchema.validateAsync(
      req.body as CreateAnimalProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invaid inputs' });
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
    const response = await animal.create({
      ...validatedData,
      user_idUser: userId,
    });

    res.status(201).send(response);
  } catch (e) {
    console.log('Error creating animal on create animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};
