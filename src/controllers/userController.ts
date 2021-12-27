import * as US from '../schemas/userSchema';
import { Request, Response } from 'express';

import animal from '../models/Animal';
import user from '../models/User';
import address from '../models/Address';

import dotenv from 'dotenv';
import parish from '../models/Parish';
import locality from '../models/Locality';
import friendRequest from '../models/FriendRequest';
dotenv.config();

const JWT = require('jsonwebtoken');

interface CreateUserProps {
  givenName: string;
  familyName: string;
  email: string;
}

export interface AnimalDataProps {
  idAnimal: number;

  name: string;
  age: string;
  breed: string;
  trackNumber: string;
  imageName: string;
  imageUrl: string;

  userIdUser: number;
}

interface AddressUserProps {
  streetName: string;
  doorNumber: string;
  postalCode: string;
}

interface FullAddressUserProps {
  doorNumber: string;
  postalCode: string;
  streetName: string;
  parish: ParishAddressUserProps;
}

interface ParishAddressUserProps {
  parishName: string;
  locality: LocalityAddressUserProps;
}

interface LocalityAddressUserProps {
  locationName: string;
}

interface StatusProps {
  status: string;
}

interface GenerateToken {
  id: string;
}

interface VerifyToken {
  token: string;
  fromWho: string;
}

interface MulterRequest extends Request {
  file: any;
}

export const createUser = async (req: Request, res: Response) => {
  const userAnimalData = [] as Array<AnimalDataProps>;
  const { location, key } = (req as MulterRequest).file;

  let returnStatus;
  let returnToken;
  let userAddressTempObj = {};

  try {
    const validatedData = await US.createUserSchema.validateAsync(
      req.body as CreateUserProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
    const token = JWT.sign(
      validatedData.email,
      process.env.JWT_SECRET as string
    );

    const response = await user.findOrCreate({
      where: {
        email: validatedData.email ?? '',
      },
      defaults: {
        ...validatedData,
        imageUrl: location,
        imageName: key,
        token,
      },
    });

    const [data, created] = response;
    returnStatus = created ? 201 : 200;
    returnToken = created ? token : data.token;

    //Check if wasnt create
    if (!created) {
      //Find all animals from user
      const response = await animal.findAll({
        where: {
          userIdUser: data.idUser,
        },
      });

      response.forEach((item) => {
        userAnimalData.push(item);
      });

      if (data.addressIdAddress) {
        const addressResponse = await address.findOne({
          where: { idAddress: data.addressIdAddress },
          include: [
            {
              model: parish,
              include: [
                {
                  model: locality,
                },
              ],
            },
          ],
        });

        if (addressResponse) {
          const {
            doorNumber,
            postalCode,
            streetName,
            parish: parishData,
          } = addressResponse as unknown as FullAddressUserProps;

          const { parishName, locality: localityData } = parishData;
          const { locationName } = localityData;

          userAddressTempObj = {
            doorNumber,
            postalCode,
            streetName,
            parishName,
            locationName,
          };
        }
      }
    }

    res.status(returnStatus).send({
      ...validatedData,
      id: data.idUser,
      token: returnToken,
      imageUrl: location,
      imageKey: key,
      animalData: userAnimalData,
      userAddress: userAddressTempObj,
    });
  } catch (e) {
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};

export const createAddress = async (req: Request, res: Response) => {
  let validatedData;
  let addressResponse;

  //Validate data
  try {
    validatedData = await US.createAddressSchema.validateAsync(
      req.body as AddressUserProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on create user address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    addressResponse = await address.create(validatedData);
  } catch (e) {
    console.log('Error creating user address on user controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    await user.update(
      { addressIdAddress: addressResponse.idAddress },
      { where: { email: validatedData.email } }
    );
  } catch (e) {
    console.log('Error updating user address fk on user controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send(validatedData);
};

export const status = async (req: Request, res: Response) => {
  let validatedData;
  let createResponse;

  //Validate data
  try {
    validatedData = await US.statusSchema.validateAsync(
      req.query as unknown as StatusProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on create user address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const createResponse = await user.create(validatedData);
    res.status(200).send(createResponse);
  } catch (e) {
    console.log('Error creating data on create user address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }
};

export const generateToken = async (req: Request, res: Response) => {
  let validatedData;
  try {
    validatedData = await US.generateTokenSchema.validateAsync(
      req.query as unknown as GenerateToken
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(200).send({ message: 'Something went wrong' });
  }

  try {
    const token = await JWT.sign(
      validatedData,
      process.env.JWT_SECRET as string
    );
    res.status(200).send({ token });
  } catch (e) {
    console.log(e);
    res.status(200).send({ message: 'Something went wrong' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  let validatedData;
  let userData;
  let tokenData;

  try {
    validatedData = await US.verifyTokenSchema.validateAsync(
      req.query as unknown as VerifyToken
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on verifyToken controller');
    res.status(200).send({ message: 'Something went wrong' });
  }

  try {
    tokenData = JWT.verify(
      validatedData.token,
      process.env.JWT_SECRET as string
    );
  } catch (e) {
    console.log('Error verifing token on verifyToken controller');
    res.status(200).send({ message: 'Something went wrong' });
  }

  try {
    userData = await user.findOne({
      where: { email: tokenData.email, idUser: tokenData.id },
    });

  } catch (e) {
    console.log('Error finding user by token on verifyToken controller');
    res.status(200).send({ message: 'Something went wrong' });
  }

  try {
    const response = await friendRequest.create({
      fromWho: validatedData.fromWho,
      toWhom: userData?.idUser,
    });

    res.status(200).send(response);
  } catch (e) {
    console.log('Error finding user by token on verifyToken controller');
    res.status(200).send({ message: 'Something went wrong' });
  }
};
