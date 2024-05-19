import express from "express";
import { sequelize } from "./db/models/sequelize";
import cors from "cors";
import { userRoutes } from "./handlers/users";
import { authenticate } from "./middlewares/authentication";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.all("*",authenticate);
userRoutes(app);

app.listen(3000, async () => {
  await sequelize.sync();
  console.log("App is running on port 3000");
});
