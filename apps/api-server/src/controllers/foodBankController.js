import AppError from "../errors/AppError.js";
import AuthError from "../errors/AuthError.js";
import * as fbQueries from "../db/foodBankQueries.js";
import logger from "../utils/logger.js";

// needed to authenticate the requests
import jwt from "jsonwebtoken";

//import "dotenv/config";
import { env } from "node:process";

/**
 * this method returns open data that is not private to the food bank (so no admin or staff info returned)
 * @param {} req
 * @param {*} res
 */
export async function getFoodBank(req, res) {
  logger.info("in getFoodBank");

  const id = req.query.id;
  const name = req.query.name;
  const city = req.query.city;
  const province = req.query.province;
  const country = req.query.country;
  logger.info("req.query", req.query);
  logger.info(`id:  ${req.query.id}`)
  try {
    const foodbanks = await fbQueries.getAllFoodBanks({
      id,
      name,
      city,
      province,
      country,
    });
    res.status(200).json({ data: foodbanks });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to get a list of food banks", 500, error);
    }
  }
}
