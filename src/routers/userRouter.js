import express from "express";
import bcrypt from "bcrypt";
import { getDB } from "../models/db.js";

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  const { nome, email, senha, confirmarSenha } = req.body;

  if (!nome || !email || !senha || !confirmarSenha) {
    return res.status(422).json({ error: "Todos os campos são obrigatórios." });
  }

  if (senha.length < 3) {
    return res
      .status(422)
      .json({ error: "A senha deve ter no mínimo três caracteres." });
  }

  if (senha !== confirmarSenha) {
    return res.status(422).json({ error: "As senhas não coincidem." });
  }

  // Realizar a criptografia da senha
  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Realizar o cadastro do usuário no banco de dados
    const db = getDB();

    await db.collection("usuarios").insertOne({
      nome,
      email,
      senha: hashedSenha,
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

export default router;
