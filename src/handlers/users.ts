import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/models/sequelize";

const router = express.Router();


type UserData = {
  id: number;
  email: string;
  password: string;
};

const create = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ error: "Please provide email and password" });

  req.body.password = await bcrypt.hash(
    (req.body.password + process.env.BCRYPT_PASS) as string,
    Number(process.env.SALT_ROUNDS as string)
  );

  const userData: UserData = req.body;

  try {
    const user = await User.create({
      email: userData.email,
      password: userData.password,
    });
    const userId = user.get('id') as number;
    const userResponse = { ...user.get({ plain: true }) };
    delete userResponse.password;
    res.json(userResponse);
  } catch (e) {
    res.status(500).json(e);
  }
};

const index = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

const showOne = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
};

export const userRoutes = (app: express.Application): void => {
  app.get("/user", index);
  app.get("/user/:id", showOne);
  app.post("/user", create);
};
