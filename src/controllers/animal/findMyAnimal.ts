import { Request, Response } from 'express';

import * as AS from '../../schemas/animalSchema';

import locality from '../../models/Locality';
import animal from '../../models/Animal';
import user from '../../models/User';
import address from '../../models/Address';
import parish from '../../models/Parish';

let nodeGeocoder = require('node-geocoder');
let options = {
  provider: 'openstreetmap',
};

interface UserAddressParishProps {
  idParish: number;
  parishName: string;
  localityIdLocality: number;
  locality: object;
}

interface UserAddressLocalityProps {
  idLocality: number;
  locationName: string;
}

interface UserAddressParishProps {
  idParish: number;
  parishName: string;
  localityIdLocality: number;
  locality: object;
}

const findMyAnimal = async (req: Request, res: Response) => {
  let validatedData;
  let userId;
  let responseData;
  let addressData;
  let cleanResponse;

  try {
    validatedData = await AS.findMyAnimalSchema.validateAsync({
      trackNumber: req.query.tracking,
    });

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e) {
    console.log('Error validating data on findMyAnimal animal controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  //Try find animal
  try {
    const response = await animal.findOne({
      where: validatedData,
    });

    userId = response?.userIdUser;
  } catch (e) {
    console.log(
      'Error finding owner id on animal table on findMyAnimal animal controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  if (userId === undefined) {
    //Try find animal owner
    res.status(500).send({ message: 'Cannot find animal owner' });
    return;
  }

  try {
    const response = await user.findOne({
      where: {
        idUser: userId,
      },
      raw: true,
      nest: true,
      include: [
        {
          model: address,
          required: false,
          include: [
            {
              model: parish,
              required: false,
              include: [
                {
                  model: locality,
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    cleanResponse = response as any;
    addressData = cleanResponse.address;

    responseData = {
      name: `${response?.givenName} ${response?.familyName}`,
      email: response?.email,
      phoneNumber: response?.phoneNumber,
    };
  } catch (e) {
    console.log(
      'Error finding owner address on animal table on findMyAnimal animal controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const { streetName, postalCode } = addressData;
    const geoCoder = nodeGeocoder(options);

    const res = await geoCoder.geocode(`${streetName} ${postalCode}`);

    if (res.length === 1) {
      const latitude = res[0].latitude;
      const longitude = res[0].longitude;

      responseData = {
        ...responseData,
        latitude,
        longitude,
      };
    } else {
      const { parishName, locality } = addressData.parish;
      const { locationName } = locality as UserAddressLocalityProps;
      responseData = {
        ...responseData,
        doorNumber: addressData.doorNumber,
        streetName: addressData.streetName,
        postalCode: addressData.postalCode,
        parishName,
        locationName,
      };
    }
  } catch (e) {
    console.log(
      'Error getting address geographic coordinates on findMyAnimal animal controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send(responseData);
};

export default findMyAnimal;
