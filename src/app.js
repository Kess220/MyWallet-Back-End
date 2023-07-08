import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import { connectDB } from "./models/db.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// Registrar as rotas
app.use("/cadastro", userRouter); // Rota para o cadastro
app.use("/", authRouter); // Outras rotas de autenticação

const port = process.env.PORT || 5000;

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
