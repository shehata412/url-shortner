import { Sequelize } from "sequelize";
import UserModel from "./user";
import dotenv from "dotenv";
import config from "../config/config.json";

dotenv.config();

const envConfig = config[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    host: envConfig.host,
    dialect: envConfig.dialect,
  }
);

const User = UserModel(sequelize, Sequelize);

export { sequelize, User };
