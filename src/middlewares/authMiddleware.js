import jwt from "jsonwebtoken";
import { getDB } from "../models/db.js";
import { ObjectId } from "mongodb";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    console.log("UserID:", userId);

    const db = getDB();

    // Consulta o banco de dados para verificar se o usuário existe
    const user = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(401).json({ error: "Usuário não autorizado" });
    }

    req.userId = userId; // Define o ID do usuário na requisição
    next(); // Passa para o próximo middleware ou rota
  } catch (error) {
    console.error("Erro de autenticação:", error);
    return res.status(401).json({ error: "Falha na autenticação" });
  }
};

export default authMiddleware;
