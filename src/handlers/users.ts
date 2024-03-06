import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/models/sequelize";
const router = express.Router();

type UserData = {
    email: string;
    password: string;
};

const create = async (req: Request, res: Response) => {
    const userData: UserData = req.body;
    const user = await User.create({
        email: userData.email,
        password: userData.password,
    });
    res.json(user);
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
    app.post('/user', create)
}