import { Request, Response } from 'express';

import * as US from '../../schemas/userSchema';

import address from '../../models/Address';
import user from '../../models/User';
import parish from '../../models/Parish';
import locality from '../../models/Locality';

interface AddressUserProps {
  parish: string;
  locality: string;
  streetName: string;
  doorNumber: string;
  postalCode: string;
}

export const createAddress = async (req: Request, res: Response) => {
  let validatedData;
  let addressResponse;
  let localityResponse;
  let parishResponse;

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
    const { locationName } = validatedData;
    localityResponse = await locality.findOrCreate({
      where: { locationName },
      defaults: { locationName },
    });
  } catch (e) {
    console.log('Error creating locality on create address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const { parishName } = validatedData;
    parishResponse = await parish.findOrCreate({
      where: {
        parishName,
        localityIdLocality: 1,
      },
      defaults: {
        parishName,
        localityIdLocality: localityResponse[0].idLocality,
      },
    });
  } catch (e) {
    console.log('Error creating parish on create address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    const { streetName, postalCode, doorNumber } = validatedData;
    addressResponse = await address.create({
      streetName,
      postalCode,
      doorNumber,
      parishIdParish: parishResponse[0].idParish,
    });
  } catch (e) {
    console.log('Error creating user address on create address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  try {
    await user.update(
      { addressIdAddress: addressResponse.idAddress },
      {
        where: {
          email: validatedData.email,
          isVeterinarian: validatedData.isVeterinarian,
        },
      }
    );
  } catch (e) {
    console.log('Error updating user address fk on create address controller');

    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e as string);
  }

  res.status(200).send(validatedData);
};

export default createAddress;
