import * as US from '../../schemas/userSchema';

import { Request, Response } from 'express';

import parish from '../../models/Parish';
import locality from '../../models/Locality';
import animal from '../../models/Animal';
import user from '../../models/User';
import address from '../../models/Address';

const JWT = require('jsonwebtoken');

interface FindOrCreateUserProps {
  givenName: string;
  familyName: string;
  email: string;
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

export interface AnimalDataProps {
  idAnimal: number;

  name: string;
  age: string;
  breed: string;
  trackNumber: string;
  photoName: string;
  photoUrl: string;

  userIdUser: number;
}

interface MulterRequest extends Request {
  file: any;
}

const FindOrCreateUser = async (req: Request, res: Response) => {
  const userAnimalData = [] as Array<AnimalDataProps>;
  const { location, key } = (req as MulterRequest).file;

  let returnStatus;
  let returnToken;
  let userAddressTempObj = {};
  let validatedData;
  let token;
  let accessToken;
  let userData;

  //Validate data
  try {
    validatedData = await US.findOrCreateUserSchema.validateAsync(
      req.body as FindOrCreateUserProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on create user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Generate user token
  try {
    token = JWT.sign(validatedData.email, process.env.JWT_SECRET as string);
  } catch (e: any) {
    console.log('Error generating user token on create user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Find or create user
  try {
    const response = await user.findOrCreate({
      where: {
        email: validatedData.email ?? '',
      },
      defaults: {
        ...validatedData,
        photoUrl: location,
        photoName: key,
        token,
      },
    });

    const [data, created] = response;
    userData = {
      data,
      created,
    };

    returnStatus = created ? 201 : 200;
    returnToken = created ? token : data.token;
  } catch (e: any) {
    console.log('Error finding or creating user on create user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }
  //Check if wasnt create
  if (!userData.created) {
    //Find all animals from user
    try {
      const response = await animal.findAll({
        where: {
          userIdUser: userData.data.idUser,
        },
      });

      response.forEach((item) => {
        userAnimalData.push(item as AnimalDataProps);
      });
    } catch (e: any) {
      console.log('Error finding animals from user on create user controller');
      res.status(500).send({ message: 'Something went wrong' });
      throw new Error(e);
    }

    //Find address from user
    if (userData.data.addressIdAddress) {
      try {
        const addressResponse = await address.findOne({
          where: { idAddress: userData.data.addressIdAddress },
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
      } catch (e: any) {
        console.log(
          'Error finding animals from user on create user controller'
        );
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
      }
    }

    const userCompleteData = {
      ...validatedData,
      id: userData.data.idUser,
      token: returnToken,
      accessToken,
      photoUrl: location,
      photoKey: key,
      animalData: userAnimalData,
      userAddress: userAddressTempObj,
    };

    //Generate access user token
    try {
      accessToken = JWT.sign(userCompleteData, validatedData.salt as string);
    } catch (e: any) {
      console.log(
        'Error generating access user token on create user controller'
      );
      res.status(500).send({ message: 'Something went wrong' });
      throw new Error(e);
    }

    res.status(returnStatus).send({...userCompleteData, accessToken});
  }
};

export default FindOrCreateUser;
