import { UsersInstance } from './../../models/User';
import { Request, Response } from 'express';
import address from '../../models/Address';
import locality from '../../models/Locality';
import parish from '../../models/Parish';
import users from '../../models/User';

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

const getAllVeterinarians = async (req: Request, res: Response) => {
  let veterinarianAddressTempObj = {};
  let response;
  let veterinarianData: Array<any> = [];

  try {
    response = await users.findAll({
      where: { isVeterinarian: true },
      raw: true,
      nest: true,
    });
  } catch (e: any) {
    console.log(
      'Error getting all veterinarians on get all veterinarians controller'
    );
    res.status(500).send({ message: 'Something went wrong' });
    throw new Error(e);
  }

  for (const element of response) { //convert to foreach and promisses
    if (element.addressIdAddress) {
      try {
        const addressResponse = await address.findOne({
          where: { idAddress: element.addressIdAddress },
          raw: true,
          nest: true,
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
        }
      } catch (e: any) {
        console.log(
          'Error finding animals from user on create user controller'
        );
        res.status(500).send({ message: 'Something went wrong' });
        throw new Error(e);
      }
    }

    veterinarianData.push({
      ...element,
      veterinarianAddress: veterinarianAddressTempObj,
    });
  }

  res.status(200).send(veterinarianData);
};

export default getAllVeterinarians;
