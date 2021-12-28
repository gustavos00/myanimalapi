
import { Request, Response } from 'express';

import * as US from '../../schemas/userSchema';

import address from '../../models/Address'
import user from '../../models/User';

interface AddressUserProps {
  streetName: string;
  doorNumber: string;
  postalCode: string;
}

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

export default createAddress