import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import { connectDB } from "./models/db.js";

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/", authRouter);

app.get("/", (req, res) => {
  res.send("Bem-vindo ao meu back-end!");
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor está rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
