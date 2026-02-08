import { param } from "express-validator";
/*
import * as fbQueries from "../db/foodBankQueries.js";
import { AppError } from "../errors/AppError.js";
import { ValidationError } from "../errors/ValidationError.js";
*/

export const checkFoodBankId = [
  param("id")
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("The food bank id should be an int")
    .bail()
    .toInt()
  ]