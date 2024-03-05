import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, sequelize } from "../db/models/sequelize";
import dotenv from "dotenv";

dotenv.config();

interface UserRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

type User_data = { 
  id: number;
  username: string;
  password: string;
  email: string;
};


export const authenticate = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: "Please authenticate" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });

    const userData: User_data = user?.get({ plain: true }) as User_data;

    if (!user) {
      throw new Error();
    }
    req.user = {
      id: userData.id,
      username: userData.username,
    };
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};