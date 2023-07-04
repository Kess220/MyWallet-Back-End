import express from "express";
import { compare } from "bcrypt";
import { ObjectId } from "mongodb";
import { getDB } from "../models/db.js";

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

    // Retornar a resposta de sucesso com o token e redirecionar o usuário para a rota /home
    return res
      .status(200)
      .json({ token: "token_de_exemplo", redirect: "/home" });
  } catch (error) {
    console.error("Erro ao acessar o banco de dados:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
