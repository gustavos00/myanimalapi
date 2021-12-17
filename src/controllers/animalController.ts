import { Request, Response } from 'express';

import * as AS from '../schemas/animalSchema';

import locality from './../models/Locality';
import animal from '../models/Animal';
import user from '../models/User';
import address from '../models/Address';
import parish from '../models/Parish';

let nodeGeocoder = require('node-geocoder');
let options = {
  provider: 'openstreetmap',
};

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

interface UserAddressLocalityProps {
  idLocality: number;
  locationName: string;
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
      userIdUser: userId,
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
      res.status(400).send({ message: 'Invalid inputs' });
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

  const { location, key } = (req as MulterRequest).file;
  console.log(location)

  try {
    const updateResponse = await animal.update(
      {
        ...validatedData,
        imageUrl: '',
        imageName: '',
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

    addressData = response?.address as UserAddressProps;

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

  try {
    const { streetName, postalCode, parish } = addressData;
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
      const { parishName, locality } = parish as UserAddressParishProps;
      const { locationName } = locality as UserAddressLocalityProps;
      const tempObj = {
        ...responseData,
        streetName,
        postalCode,
        parishName,
        locationName,
      };

      responseData = tempObj
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
