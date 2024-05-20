import express, { Request, Response } from "express";
import { URL, User } from "../db/models/sequelize";

interface UserRequest extends Request {
  user?: {
    id: number;
    email: string;
    isAdmin?: boolean;
  };
}

const index = async (req: UserRequest, res: Response) => {
  if (!req.user) return res.status(401).send({ error: "Unauthorized" });
  if (!req.user?.isAdmin && req.user?.id !== Number(req.params.id)) {
    return res.status(401).send({ error: "Unauthorized" });
  } else if (req.user?.isAdmin) {
    const urls = await URL.findAll();
    res.json(urls);
  }
  const urls = await URL.findAll({
    where: {
      userId: req.user.id,
    },
  });
};

export const urlRoutes = (app: express.Application): void => {
  app.get("/urls", index);
};
