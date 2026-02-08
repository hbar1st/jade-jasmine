// Routes belonging to /foodbank

import { Router } from "express";

import passport from "passport";


import * as fbController from "../controllers/foodBankController.js";


import { handleExpressValidationErrors } from "./routerUtil.js";


const foodBankRouter = Router();


//import * as fbValidator from "../validators/foodBankValidator.js";


//import AuthError from "../errors/AuthError.js";

// this route is not protected so it doesn't return the admin data or the staff data, just generally available data
foodBankRouter
  .route("/")
  .get(fbController.getFoodBank);

  
  //foodBankRouter.get("/:id", )
  
  /**
   foodBankRouter.get("/:name", fbController.getFoodBank({id}))
   */
export default foodBankRouter;