import { Request, Response } from "express";

import { animal } from "../models/Animal";
import { user } from "../models/User";

import dotenv from "dotenv";
dotenv.config();

const Joi = require("joi");
import * as US from "../schemas/userSchema";
import { userSchema } from "../schemas/index";
const JWD = require("jsonwebtoken");

interface CreateUserProps {
  givenName: string;
  familyName: string;
  email: string;
}

interface AnimalDataProps {
  idAnimal: number;

  name: string;
  age: string;
  breed: string;
  trackNumber: string;
  imageName: string;
  imageUrl: string;

  user_idUser: number;
}

export const test = async (req: Request, res: Response) => {
  console.log("testing");

  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });

  schema.validate({ username: "abc", birth_year: 1994 });
  // -> { value: { username: 'abc', birth_year: 1994 } }

  schema.validate({});
  // -> { value: {}, error: '"username" is required' }

  // Also -

  try {
    const value = await schema.validateAsync({
      username: "abc",
      password: "testingPassword",
    });
    console.log(value);
  } catch (err) {
    console.log(err);
  }

  res.status(200).send({
    message: "ok",
  });
}; //function end

export const create = async (req: Request, res: Response) => {
  const userAnimalData = [] as Array<AnimalDataProps>;

  try {
    const validatedData = await US.userSchema.validateAsync(
      req.body as CreateUserProps
    );

    if (!validatedData) {
      res.status(400).send({ message: "Invalid inputs" });
      return;
    }
    const token = JWD.sign(
      {
        email: validatedData,
      },
      process.env.JWT_SECRET as string
    );

    const response = await user.findOrCreate({
      where: {
        email: validatedData.email ?? "",
      },
      defaults: {
        givenName: validatedData.givenName,
        familyName: validatedData.familyName,
        email: validatedData.email,
        token,
      },
    });

    const [data, created] = response;
    const returnStatus = created ? 201 : 200;
    const returnToken = created ? token : data.token;

    //Check if wasnt create
    if (!created) {
      //Find all animals from user
      const response = await animal.findAll({
        where: {
          user_idUser: data.idUser,
        },
      });

      response.forEach((item) => {
        userAnimalData.push(item);
      });

      /*Find user address - Need make the relations on models
      const addressResponse = await address.findOne({
        where: { idAddress: data.address_idAddress },
        include: [
          {
            model: parish,
          },
          {
            model: locality,
          },
        ],
      })
      */
    }

    res.status(returnStatus).send({
      givenName: validatedData.givenName,
      familyName: validatedData.givenName,
      email: validatedData.email,
      token: returnToken,
      animalData: userAnimalData,
    });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
    throw new Error(e as string);
  }
};
