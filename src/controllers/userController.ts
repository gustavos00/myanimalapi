import * as US from '../schemas/userSchema';
import { Request, Response } from 'express';
import { animal } from '../models/Animal';
import { user } from '../models/User';

import dotenv from 'dotenv';
dotenv.config();

const Joi = require('joi');
const JWD = require('jsonwebtoken');

interface CreateUserProps {
  givenName: string;
  familyName: string;
  email: string;
}

interface AnimalDataProps {
  idAnimal: number;

  name: string;
  age: string;
  breed: string;
  trackNumber: string;
  imageName: string;
  imageUrl: string;

  user_idUser: number;
}

interface MulterRequest extends Request {
  file: any;
}

export const createUser = async (req: Request, res: Response) => {
  const userAnimalData = [] as Array<AnimalDataProps>;
  const { location, key } = (req as MulterRequest).file;

  try {
    const validatedData = await US.createUserSchema.validateAsync(
      req.body as CreateUserProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
    const token = JWD.sign(
      {
        email: validatedData,
      },
      (process.env.JWT_SECRET as string) ?? '' 
    );

    const response = await user.findOrCreate({
      where: {
        email: validatedData.email ?? '',
      },
      defaults: {
        ...validatedData,
        token,
      },
    });

    const [data, created] = response;
    const returnStatus = created ? 201 : 200;
    const returnToken = created ? token : data.token;

    //Check if wasnt create
    if (!created) {
      //Find all animals from user
      const response = await animal.findAll({
        where: {
          user_idUser: data.idUser,
        },
      });

      response.forEach((item) => {
        userAnimalData.push(item);
      });

      /*Find user address - Need make the relations on models
      const addressResponse = await address.findOne({
        where: { idAddress: data.address_idAddress },
        include: [
          {
            model: parish,
          },
          {
            model: locality,
          },
        ],
      })
      */
    }

    res.status(returnStatus).send({
      ...validatedData,
      token: returnToken,
      animalData: userAnimalData,
      imageUrl: location,
      imageKey: key,
    });
  } catch (e) {
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};
