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

  //Validate data
  const tempTrackNumber =
    req.query.trackNumber === 'undefined' ? undefined : req.query.trackNumber;

  try {
    validatedData = await AS.findMyAnimalSchema.validateAsync({
      trackNumber: tempTrackNumber,
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
    res.status(200).send({ message: 'Cannot find animal owner' });
    return;
  }

  try {
    const response = await user.findOne({
      where: {
        idUser: userId,
      },
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

    responseData = {
      email: response?.email,
      phoneNumber: response?.phoneNumber,
    };
  } catch (e) {
    console.log(
      'Error finding owner id on animal table on findMyAnimal animal controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  /*NEED REVIEW
  try {
    const { streetName, postalCode, parishName } = addressData;
    const geoCoder = nodeGeocoder(options);

    const res = await geoCoder.geocode(`${streetName} ${postalCode}`);

    if (res) {
      const latitude = res[0].latitude;
      const longitude = res[0].longitude;

      const tempObj = {
        ...responseData,
        latitude,
        longitude,
      };

      responseData = tempObj;
    } else {
      const { parishName, locality } = parish as unknown as UserAddressParishProps;
      const { locationName } = locality as UserAddressLocalityProps;
      const tempObj = {
        ...responseData,
        streetName,
        postalCode,
        parishName,
        locationName,
      };

      responseData = tempObj;
    }
  } catch (e) {
    console.log(
      'Error getting address geographic coordinates on findMyAnimal animal controller'
    );

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }*/

  res.status(200).send(responseData);
};

export default findMyAnimal