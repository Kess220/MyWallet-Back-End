import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import { connectDB } from "./models/db.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();
dotenv.config();

app.use(cors());

app.use(bodyParser.json());

app.use("/usuario", userRouter);
app.use("/", authRouter);

app.get("/", authMiddleware, (req, res) => {
  res.send("Bem vindo ao meu back-end!");
});

app.get("/usuario/nome", authMiddleware, (req, res) => {
  const nomeDoUsuario = ""; // Obtém o nome do usuário do banco de dados
  res.json(nomeDoUsuario);
});

const port = process.env.PORT;

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
