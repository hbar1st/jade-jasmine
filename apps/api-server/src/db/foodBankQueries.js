import { pool } from "./pool.js";
import logger from "../utils/logger.js";
import AppError from "../errors/AppError.js";

export async function getAllFoodBanks(l) {
  logger.info("in getAllFoodBanks");
  const { rows } = await pool.query(
    "SELECT * from foodbanks INNER JOIN users ON admin=users.id INNER JOIN user_roles AS ur ON users.id=ur.user_id ORDER BY country,province,city;"
  );
  return rows;
}