import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../models/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para criar uma nova transação de entrada
router.post("/nova-transacao/entrada", authMiddleware, async (req, res) => {
  try {
    const { valor, descricao } = req.body;
    const userId = req.userId;

    // Validar os dados da transação
    if (!valor || !descricao) {
      return res
        .status(422)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // Verificar se o valor é um número positivo
    if (isNaN(valor) || parseFloat(valor) <= 0) {
      return res.status(422).json({ error: "O valor deve ser positivo." });
    }

    const db = getDB();
    const transacao = {
      tipo: "entrada",
      valor: parseFloat(valor),
      descricao,
      userId: new ObjectId(userId),
    };

    // Inserir a transação no banco de dados
    const result = await db.collection("transacoes").insertOne(transacao);
    const insertedId = result.insertedId;

    // Obter a transação completa com base no ID inserido
    const novaTransacao = await db
      .collection("transacoes")
      .findOne({ _id: insertedId });

    return res.status(200).json({
      mensagem: "Transação de entrada criada com sucesso!",
      transacao: novaTransacao,
    });
  } catch (error) {
    console.error("Erro ao criar a transação de entrada:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para criar uma nova transação de saída
router.post("/nova-transacao/saida", authMiddleware, async (req, res) => {
  try {
    const { valor, descricao } = req.body;
    const userId = req.userId;

    // Validar os dados da transação
    if (!valor || !descricao) {
      return res
        .status(422)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // Verificar se o valor é um número positivo
    if (isNaN(valor) || parseFloat(valor) <= 0) {
      return res.status(422).json({ error: "O valor deve ser positivo." });
    }

    const db = getDB();
    const transacao = {
      tipo: "saida",
      valor: parseFloat(valor),
      descricao,
      userId: new ObjectId(userId),
    };

    // Inserir a transação no banco de dados
    const result = await db.collection("transacoes").insertOne(transacao);
    const insertedId = result.insertedId;

    // Obter a transação completa com base no ID inserido
    const novaTransacao = await db
      .collection("transacoes")
      .findOne({ _id: insertedId });

    return res.status(200).json({
      mensagem: "Transação de saída criada com sucesso!",
      transacao: novaTransacao,
    });
  } catch (error) {
    console.error("Erro ao criar a transação de saída:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
