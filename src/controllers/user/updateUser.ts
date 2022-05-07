import * as US from '../../schemas/userSchema';

import { Request, Response } from 'express';
import users from '../../models/User';
import address from '../../models/Address';

interface UpdateUserProps {
  streetName: string;
  doorNumber: string;
  postalCode: string;
  parish: string;
  locality: string;
  givenName: string;
  familyName: string;
  phoneNumber: string;
  email: string;
}

interface objectWithoutKeyProps {
  object: Object;
  key: keyof object;
}

interface MulterRequest extends Request {
  file: any;
}

const removeSpecificKey = ({ object, key }: objectWithoutKeyProps) => {
  const { [key]: deletedKey, ...otherKeys } = object;
  return otherKeys;
};

const UpdateUser = async (req: Request, res: Response) => {
  const { location, key } = (req as MulterRequest).file;
  let validatedData;

  //Validate data
  try {
    validatedData = await US.UpdateUserSchema.validateAsync(
      req.body as UpdateUserProps
    );

    if (!validatedData) {
      res.status(400).send({ message: 'Invalid inputs' });
      return;
    }
  } catch (e: any) {
    console.log('Error validating user data on update user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  try {
    const validatedDataWithoutEmail = removeSpecificKey({
      object: validatedData,
      key: 'email' as never,
    });

    await users.update(
      { ...validatedDataWithoutEmail, photoName: key, photoUrl: location },
      { where: { idUser: Number(validatedData.id) } }
    );
  } catch (e: any) {
    console.log('Error updating user data on update user controller');
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  const addressObject = {
    doorNumber: validatedData.doorNumber,
    postalCode: validatedData.postalCode,
    streetName: validatedData.streetName,
    parishName: validatedData.parish,
    locationName: validatedData.locality,
  };

  // const foundAddress = await address.findOne({
  //   where: { idAddress: validatedData.idAddress },
  // });
  // if (!foundAddress) {
  //   const item = await address.create({
  //     doorNumber: validatedData.doorNumber,
  //     postalCode: validatedData.postalCode,
  //     streetName: validatedData.streetName,
  //   });
  //   return { item, created: true };
  // }
  // await address.update(
  //   {
  //     doorNumber: validatedData.doorNumber,
  //     postalCode: validatedData.postalCode,
  //     streetName: validatedData.streetName,
  //   },
  //   { where: { idAddress: validatedData.idAddress } }
  // );

  res.status(200).send({
    ...validatedData,
    photoName: key,
    photoUrl: location,
    userAddress: addressObject,
  });
};

export default UpdateUser;
