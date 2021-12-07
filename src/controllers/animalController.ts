import { sequelize } from './../config/pg';

import { Request, Response } from 'express';

import * as AS from '../schemas/animalSchema';

import animal from '../models/Animal';
import user from '../models/User';
import users from '../models/User';

interface CreateAnimalProps {
  name: string;
  age: string;
  breed: string;
  birthday: string;
  birthdayMonth: string;
  trackNumber: string;

  email: string;
}

interface DeleteAnimalProps {
  id?: string;
}

interface MulterRequest extends Request {
  file: any; 
}

export const createAnimal = async (req: Request, res: Response) => {
  const { location, key } = (req as MulterRequest).file;
  let validatedData;
  let userId;

  //Validate data
  try {
    validatedData = await AS.createAnimalSchema.validateAsync(
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
      imageUrl: location,
      imageName: key,
    });

    res.status(201).send(response);
  } catch (e) {
    console.log('Error creating animal on create animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await AS.updateAnimalSchema.validateAsync(
      req.body as CreateAnimalProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invaid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on update animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const findResponse = await animal.findOne({
      where: { trackNumber: validatedData.trackNumber },
    });

    //Checking if already exist a trackNumber but from another user
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

  try {
    const updateResponse = await animal.update(
      {
        name: '',
        age: '0',
        breed: '',
        trackNumber: '',
        imageUrl: '',
        imageName: '',
        birthday: '',
        birthdayMonth: '',
      },
      {
        where: {
          idAnimal: validatedData.id,
        },
      }
    );

    console.log(updateResponse);
    res.status(200).send(updateResponse);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: 'errr' });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await AS.deleteAnimalSchema.validateAsync(
      req.params as DeleteAnimalProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invaid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on delete animal controller');

    res.status(400).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Verifying if animal exist
  try {
    const response = await animal.findOne({
      where: {
        idAnimal: validatedData.id,
      },
    });

    if (!response) {
      res.status(200).send({ message: 'Animal dont exist' });
      return;
    }
  } catch (e) {
    console.log('Error verifying if animal exist on delete animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Deleting animal
  try {
    await animal.destroy({
      where: { idAnimal: validatedData.id },
    });

    res.status(200).send({ message: 'Animal deleted' });
  } catch (e) {
    console.log('Error deleting data on delete animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};

export const findMyAnimal = async (req: Request, res: Response) => {
  let validatedData;
  let userId;

  //Validate data
  const tempTrackNumber =
    req.query.trackNumber === 'undefined' ? undefined : req.query.trackNumber;

  try {
    validatedData = await AS.findMyAnimalSchema.validateAsync({
      trackNumber: tempTrackNumber,
    });

    if (!validatedData) {
      res.status(400).send({ message: 'Invaid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on findMyAnimal animal controller');

    res.status(400).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const response = await animal.findOne({
      where: validatedData,
    });

    userId = response?.user_idUser;
  } catch (e) {
    console.log(
      'Error finding owner id on animal table on findMyAnimal animal controller'
    );

    res.status(400).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const response = await user.findOne({
      where: {
        idUser: userId,
      },
    });

    res
      .status(200)
      .send({ email: response?.email, phoneNumber: response?.phoneNumber });
  } catch (e) {
    console.log(
      'Error finding owner id on animal table on findMyAnimal animal controller'
    );

    res.status(400).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};
