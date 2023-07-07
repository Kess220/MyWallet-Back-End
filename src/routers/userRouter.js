import express from "express";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
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

  try {
    const db = getDB();

    // Verificar se o email já está sendo utilizado
    const existingUser = await db.collection("usuarios").findOne({ email });

    if (existingUser) {
      return res
        .status(422)
        .json({ error: "Este email já está sendo utilizado." });
    }

    // Realizar a criptografia da senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criar um novo objeto ObjectId para o ID do usuário
    const userId = new ObjectId();

    // Realizar o cadastro do usuário no banco de dados
    await db.collection("usuarios").insertOne({
      _id: userId,
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
