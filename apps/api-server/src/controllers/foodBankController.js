import AppError from "../errors/AppError.js";
import * as fbQueries from "../db/foodBankQueries.js";
import logger from "../utils/logger.js";
import { matchedData } from "express-validator";

/**
 * this method returns open data that is not private to the food bank (so no admin or staff info returned)
 * @param {} req
 * @param {*} res
 */
export async function getFoodBank(req, res) {
  logger.info("in getFoodBank");

  const data = matchedData(req, { locations: ["query"] });

  const id = req.query.id;
  const name = req.query.name;
  const city = req.query.city;
  const province = req.query.province;
  const country = req.query.country;
  const limit = data.limit; // <===  this is weird as I have no choice but to use data.limit instead of req.query.limit
  const offset = data.offset; // same situation as limit

  logger.info("req.query", req.query);
  logger.info(
    `id:  ${req.query.id}, limit: ${data.limit}, offset: ${data.offset}`,
  );
  try {
    const foodbanks = await fbQueries.getAllFoodBanks(
      {
        id,
        name,
        city,
        province,
        country,
      },
      limit,
      offset,
    );
    res.status(200).json({ data: foodbanks });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to get a list of food banks", 500, error);
    }
  }
}

/**
 * if the logged in user is not the admin of the food bank, then
 * this method returns open data that is not private to the food bank (so no admin data)
 * otherwise, it will return the admin id and username too
 *
 * @param {} req
 * @param {*} res
 */
export async function getFoodBankDetails(req, res) {
  logger.info("in getFoodBankDetails");

  //logger.info("req", req);
  const id = Number(req.params.id);

  const authUserId = req.user?.id;

  const getFoodBankById = fbQueries.getFoodBankById(id);

  const checkIsAdmin = fbQueries.isAdmin(authUserId, id);
  try {
    const responses = await Promise.all([getFoodBankById, checkIsAdmin]);

    const [foodbank, isAdmin] = responses;
    logger.info(`admin.id vs req.user.id:  ${foodbank.admin} ${authUserId}`);
    if (!isAdmin) {
      if (foodbank.published) {
        // delete the keys that we shouldn't show
        delete foodbank.admin;
        delete foodbank.username;
        delete foodbank.fb_id;
        delete foodbank.admin_email;
        logger.info(
          "this user is not the admin, so hide some details:",
          foodbank,
        );
      } else {
        res
          .status(403)
          .json({ data: "You are not authorized to access this resource" });
        return;
      }
    }

    res.status(200).json({ data: foodbank });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to get the indicated food bank", 500, error);
    }
  }

  return;
}

/**
 *
 * @param {} req
 * @param {*} res
 */
export async function getFoodBankHours(req, res) {
  logger.info("in getFoodBankHours");

  const id = Number(req.params.id);

  try {
    const hours = await fbQueries.getFoodBankHours(id);

    res.status(200).json({ data: hours });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "Failed to get the indicated food bank's hours",
        500,
        error,
      );
    }
  }
}

/**
 * protected route for admin only
 */
export async function getFoodBankStaff(req, res) {
  logger.info(`in getFoodBankStaff`);
  const id = Number(req.params.id);
  try {
    const staff = await fbQueries.getFoodBankStaff(id, req.query?.role);
    logger.info("fb staff: ", staff);

    res.status(200).json({ data: staff });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "Failed to get the indicated food bank's staff",
        500,
        error,
      );
    }
  }
}

export async function createFoodBank(req, res) {
  logger.info("in createFoodBank");
  const authUserId = req.user.id;
  try {
    const foodbank = await fbQueries.addNewFoodBank(
      Number(authUserId),
      matchedData(req, { includeOptionals: true, locations: ["body"] }),
    );
    if (foodbank) {
      logger.info("created the food bank record");
      res.status(201).json({ data: foodbank });
    } else {
      throw new AppError("Failed to create a new food bank", 500);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to create food bank record", 500, error);
    }
  }
}

export async function setFoodBankHours(req, res) {
  logger.info("in addFoodBankHours");
  const authUserId = req.user.id;
  const fbId = Number(req.params.id);
  try {
    const hours = await fbQueries.setHours(
      fbId,
      matchedData(req, { includeOptionals: true, locations: ["body"] }),
    );
    if (hours) {
      logger.info("set the food bank hours");
      res.status(201).json({ data: hours });
    } else {
      throw new AppError("Failed to set the food bank hours", 500);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to set the food bank hours -", 500, error);
    }
  }
  res.status(201).json({ authUserId, fbId });
}
