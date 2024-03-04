import express from "express";
import seq from "./db/models/sequelize";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, async () => {
  await seq.sync();
  console.log("App is running on port 3000");
});
