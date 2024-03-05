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
