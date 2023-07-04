import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient
  .connect()
  .then(() => {
    app.locals.db = mongoClient.db();
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err.message));

app.use(bodyParser.json());

import userRouter from "./routers/userRouter.js";
app.use("/usuario", userRouter);

app.get("/", (req, res) => {
  res.send("Bem-vindo ao meu back-end!");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
