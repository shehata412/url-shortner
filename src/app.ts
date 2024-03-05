import express from "express";
import { sequelize } from "./db/models/sequelize";
import cors from "cors";
import { userRoutes } from "./handlers/users";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

userRoutes(app);

app.listen(3000, async () => {
  await sequelize.sync();
  console.log("App is running on port 3000");
});
