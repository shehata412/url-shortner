import { Sequelize } from "sequelize";
import dotenv from "dotenv";
const config = require("../config/config.json");

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

export default sequelize;
