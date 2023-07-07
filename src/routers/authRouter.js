import express from "express";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { getDB } from "../models/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota de login
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  // Realizar as validações necessárias
  if (!email || !senha) {
    return res.status(422).json({ error: "Todos os campos são obrigatórios." });
  }

  // Verificar se o e-mail possui um formato válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ error: "Formato de e-mail inválido." });
  }

  try {
    const db = getDB();

    // Verificar se o e-mail está cadastrado no banco de dados
    const user = await db.collection("usuarios").findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "E-mail não cadastrado." });
    }

    // Comparar a senha enviada com a senha armazenada no banco de dados
    const senhaCorreta = await compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Gerar o token usando JWT
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Salvar o token no documento do usuário no banco de dados
    await db
      .collection("usuarios")
      .updateOne({ _id: new ObjectId(user._id) }, { $set: { token } });

    // Retornar a resposta de sucesso com o token
    return res.status(200).json({ token, redirect: "/home" });
  } catch (error) {
    console.error("Erro ao acessar o banco de dados:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para obter os dados do usuário logado
router.get("/nome", authMiddleware, async (req, res) => {
  try {
    const db = getDB();

    // Consultar o banco de dados para obter os dados do usuário
    const user = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(req.userId) });

    console.log("User:", user); 

    if (!user) {
      return res.status(401).json({ error: "Usuário não autorizado" });
    }

    // Retornar os dados do usuário
    return res.status(200).json({ nome: user.nome, email: user.email });
  } catch (error) {
    console.error("Erro ao acessar o banco de dados:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
