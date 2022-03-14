import { UsersInstance } from './../../models/User';
import * as US from '../../schemas/userSchema';

import { Request, Response } from 'express';

import parish from '../../models/Parish';
import locality from '../../models/Locality';
import animal, { AnimalInstance } from '../../models/Animal';
import user from '../../models/User';
import address from '../../models/Address';
import users from '../../models/User';

const JWT = require('jsonwebtoken');

interface LoginUserProps {
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

interface MulterRequest extends Request {
  file: any;
}

const LoginUser = async (req: Request, res: Response) => {
  const userAnimalData = [] as Array<AnimalInstance>;
  const { location, key } = (req as MulterRequest).file;

  let returnStatus;
  let returnToken;
  let userAddressTempObj = {};
  let validatedData;
  let token;
  let accessToken;
  let userData;
  let veterinarianAddressTempObj;

  //Validate data
  try {
    validatedData = await US.LoginUserSchema.validateAsync(
      req.body as LoginUserProps
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
    token = JWT.sign(
      {
        email: validatedData.email,
        isVeterinarian: validatedData.isVeterinarian,
      },
      process.env.JWT_SECRET as string
    );
  } catch (e: any) {
    console.log('Error generating user token on create user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  //Find or create user
  try {
    const response = await users.findOrCreate({
      nest: true,
      raw: true,
      where: {
        email: validatedData.email,
        isVeterinarian: validatedData.isVeterinarian,
      },
      defaults: {
        ...validatedData,
        isVeterinarian: validatedData.isVeterinarian,
        photoUrl: location,
        photoName: key,
        token,
      },
    });


    const [data, created] = response;
    const cleanUserData = created ? (data as UsersInstance).get() : data

    returnStatus = created ? 201 : 200;
    returnToken = created ? token : data.token;

    userData = {
      data: cleanUserData,
      created,
    };

  } catch (e: any) {
    console.log(e);
    return;
  }

  if (!userData.created) {
    try {
      const response = await animal.findAll({
        where: {
          userIdUser: userData.data.idUser,
        },
        nest: true,
        raw: true,
        include: [{ model: user, as: 'userVeterinarianFk' }],
      });

      response.forEach(async (item) => {
        try {
          const addressResponse = await address.findOne({
            where: { idAddress: item.userVeterinarianFk.addressIdAddress },
            nest: true,
            raw: true,
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

            veterinarianAddressTempObj = {
              doorNumber,
              postalCode,
              streetName,
              parishName,
              locationName,
            };

            const tempObj = {
              ...item,
              userVeterinarianFk: {
                ...item.userVeterinarianFk,
                veterinarianAddress: veterinarianAddressTempObj,
              },
            } as unknown as AnimalInstance;

            userAnimalData.push(tempObj);
          }
        } catch (e: any) {
          console.log(
            'Error finding animals veterinarians address create user controller'
          );
          res.status(500).send({ message: 'Something went wrong' });
          throw new Error(e);
        }
      });
    } catch (e: any) {
      console.log('Error finding animals from user on create user controller');
      res.status(500).send({ message: 'Something went wrong' });
      throw new Error(e);
    }

    if (userData.data.addressIdAddress) {
      try {
        const addressResponse = await address.findOne({
          where: { idAddress: userData.data.addressIdAddress },
          nest: true,
          raw: true,
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
  }

  const userCompleteData = {
    ...userData.data,
    token: returnToken,
    accessToken,
    salt: validatedData.salt,
    animalData: userAnimalData,
    userAddress: userAddressTempObj,
  };

  //Generate access user token
  try {
    accessToken = JWT.sign(userCompleteData, validatedData.salt as string);
  } catch (e: any) {
    console.log('Error generating access user token on create user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  res
    .status(returnStatus)
    .send({ ...userCompleteData,  });
};

export default LoginUser;
