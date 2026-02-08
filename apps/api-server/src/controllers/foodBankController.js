import AppError from "../errors/AppError.js";
import AuthError from "../errors/AuthError.js";
import * as fbQueries from "../db/foodBankQueries.js";
import logger from "../utils/logger.js";

// needed to authenticate the requests
import jwt from "jsonwebtoken";

//import "dotenv/config";
import { env } from "node:process";

export async function getFoodBank(req, res) {
  logger.info("in getFoodBank")
  try {
    const foodbanks = await fbQueries.getAllFoodBanks()
    res.status(200).json({ data: foodbanks })
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to get a list of food banks", 500, error);
    }
  }
}