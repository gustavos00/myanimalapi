import { Request, Response } from 'express';

import * as AS from '../../schemas/animalSchema';

import animal from '../../models/Animal';

interface DeleteAnimalProps {
  id?: string;
}

const deleteAnimal = async (req: Request, res: Response) => {
  let validatedData;

  //Validate data
  try {
    validatedData = await AS.deleteAnimalSchema.validateAsync(
      req.params as DeleteAnimalProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on delete animal controller');

    res.status(500).send({ message: 'Something went wrong' });
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
      res.status(400).send({ message: 'Animal dont exist' });
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
  } catch (e) {
    console.log('Error deleting data on delete animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send({ message: 'Animal deleted' });
};

export default deleteAnimal