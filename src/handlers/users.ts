import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/models/sequelize";

const router = express.Router();

type UserData = {
  id: number;
  email: string;
  password: string;
  isAdmin?: boolean;
};

interface UserRequest extends Request {
  user?: {
    id: number;
    email: string;
    isAdmin?: boolean;
  };
}

const index = async (req: UserRequest, res: Response) => {
  if (!req.user?.isAdmin)
    return res.status(401).send({ error: "Unauthorized" });
  const users = await User.findAll();
  const usersResponse = users.map((user) => {
    const userObj = user.get({ plain: true });
    delete userObj.password;
    return userObj;
  });

  res.json(usersResponse);
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
    const userResponse = { ...user.get({ plain: true }) };
    const token = jwt.sign(
      {
        id: userResponse.id,
        email: userResponse.email,
        isAdmin: userResponse.isAdmin,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );
    res.json(token);
  } catch (e) {
    res.status(500).json(e);
  }
};

const login = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ error: "Please provide email and password" });

  const userData: UserData = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      return res.status(400).send({ error: "Unable to login" });
    }
    const userResponse = { ...user.get({ plain: true }) };
    const isMatch = await bcrypt.compare(
      userData.password + process.env.BCRYPT_PASS,
      userResponse.password
    );
    if (isMatch) {
      const token = jwt.sign(
        {
          id: userResponse.id,
          email: userResponse.email,
          isAdmin: userResponse.isAdmin,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" }
      );
      res.json(token);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const showOne = async (req: UserRequest, res: Response) => {
  if (!req.user?.isAdmin && req.user?.id !== Number(req.params.id)) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).send({ error: "User not found" });
    const userResponse = { ...user.get({ plain: true }) };
    delete userResponse.password;
    res.json(userResponse);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const userRoutes = (app: express.Application): void => {
  app.get("/user", index);
  app.get("/user/:id", showOne);
  app.post("/user", create);
  app.post("/login", login);
};
