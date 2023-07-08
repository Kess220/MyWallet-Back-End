import express from "express";
import { getDB } from "../models/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para o logout
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const db = getDB();

    // Invalidar o token no banco de dados
    await db
      .collection("usuarios")
      .updateOne({ _id: userId }, { $unset: { token: 1 } });

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
