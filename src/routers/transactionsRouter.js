import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../models/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Função para formatar um número para o formato de dinheiro (ex: 1.000,00)
function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Rota para criar uma nova transação
router.post("/nova-transacao/:tipo", authMiddleware, async (req, res) => {
  try {
    const { valor, descricao } = req.body;
    const userId = req.userId;
    const tipo = req.params.tipo;

    if (tipo !== "entrada" && tipo !== "saida") {
      return res.status(422).json({ error: "Tipo de transação inválido." });
    }

    if (!valor || !descricao) {
      return res
        .status(422)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    if (isNaN(valor) || parseFloat(valor) <= 0) {
      return res.status(422).json({ error: "O valor deve ser positivo." });
    }

    const db = getDB();
    const valorFormatado = formatarDinheiro(parseFloat(valor));
    const transacao = {
      tipo,
      valor: parseFloat(valor),
      valorFormatado, // Adicionando o valor formatado
      descricao,
      userId: new ObjectId(userId),
    };

    const result = await db.collection("transacoes").insertOne(transacao);
    const insertedId = result.insertedId;

    const novaTransacao = await db
      .collection("transacoes")
      .findOne({ _id: insertedId });

    return res.status(201).json({
      mensagem: `Transação de ${tipo} criada com sucesso!`,
      transacao: novaTransacao,
    });
  } catch (error) {
    console.error("Erro ao criar a transação:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para obter todas as transações do usuário logado
router.get("/transacoes", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const db = getDB();

    const transacoes = await db
      .collection("transacoes")
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .toArray();

    const saldo = transacoes.reduce((total, transacao) => {
      return transacao.tipo === "entrada"
        ? total + transacao.valor
        : total - transacao.valor;
    }, 0);

    const transacoesFormatadas = transacoes.map((transacao) => {
      const transacaoFormatada = {
        ...transacao,
        valorFormatado: formatarDinheiro(transacao.valor),
      };
      return transacaoFormatada;
    });

    return res.status(201).json({
      transacoes: transacoesFormatadas,
      saldo: formatarDinheiro(saldo),
    });
  } catch (error) {
    console.error("Erro ao obter as transações do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
