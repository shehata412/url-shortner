import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/models/sequelize";
const router = express.Router();

type UserData = {
    username: string;
    password: string;
};

const show = async (req: Request, res: Response) => {
        const users = await User.findAll();
        res.json(users);
}

const showOne = async (req: Request, res: Response) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
}

export const userRoutes = (app: express.Application) :void => {
    app.get('/user', show);
    app.get ('/user/:id', showOne);
}