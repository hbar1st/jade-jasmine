// Routes belonging to /foodbank

import { Router } from "express";

import passport from "passport";


import * as fbController from "../controllers/foodBankController.js";


import { handleExpressValidationErrors } from "./routerUtil.js";


const foodBankRouter = Router();


//import * as fbValidator from "../validators/foodBankValidator.js";


//import AuthError from "../errors/AuthError.js";

foodBankRouter
  .route("/")
  .get(fbController.getFoodBank);

  
export default foodBankRouter;