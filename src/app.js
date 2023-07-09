import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import transactionRouter from "./routers/transactionsRouter.js";
import logoutRouter from "./routers/logoutRouter.js";

import { connectDB } from "./models/db.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// Registrar as rotas
app.use("/cadastro", userRouter);
app.use("/", authRouter);
app.use("/", transactionRouter);
app.use("/", logoutRouter);

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
