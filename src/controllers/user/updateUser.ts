import * as US from '../../schemas/userSchema';

import { Request, Response } from 'express';
import users from '../../models/User';
import address from '../../models/Address';
import { Model } from 'sequelize';
import parish from '../../models/Parish';

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
  let addressId;
  let parishId;
  let localityId;

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

  //ADDRESS
  try {
    if (JSON.parse(validatedData.idAddress) === null) {
      const item = await address.create({
        doorNumber: validatedData.doorNumber,
        postalCode: validatedData.postalCode,
        streetName: validatedData.streetName,
      });

      addressId = item.idAddress;
    } else {
      await address.update(
        {
          doorNumber: validatedData.doorNumber,
          postalCode: validatedData.postalCode,
          streetName: validatedData.streetName,
        },
        { where: { idAddress: validatedData.idAddress } }
      );
    }
  } catch (e) {
    console.log(e);
  }

  //PARISH
  try {
    if (JSON.parse(validatedData.parishName) === null) {
      const item = await parish.create({
        parishName: validatedData.parishName,
      });

      parishId = item.idParish;
    } else {
      const response = await parish.update(
        {
          parishName: validatedData.parishName,
        },
        { where: { parishName: validatedData.parishName } }
      );
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const validatedDataWithoutEmail = removeSpecificKey({
      object: validatedData,
      key: 'email' as never,
    });

    await users.update(
      {
        ...validatedDataWithoutEmail,
        photoName: key,
        photoUrl: location,
        addressIdAddress: addressId,
      },
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

  //verify if all data exist

  // try {
  //   if(JSON.parse(validatedData.idAddress) === null) {
  //     const item = await address.create({
  //       doorNumber: validatedData.doorNumber,
  //       postalCode: validatedData.postalCode,
  //       streetName: validatedData.streetName,
  //     });
  //     //UPDATE USER
  //   } else {
  //     await address.update(
  //       {
  //         doorNumber: validatedData.doorNumber,
  //         postalCode: validatedData.postalCode,
  //         streetName: validatedData.streetName,
  //       },
  //       { where: { idAddress: validatedData.idAddress } }
  //     );
  //   }
  // } catch(e) {
  //   console.log(e)
  // }

  res.status(200).send({
    ...validatedData,
    photoName: key,
    photoUrl: location,
    userAddress: addressObject,
  });
};

export default UpdateUser;
