import { pool } from "./pool.js";
import logger from "../utils/logger.js";
//import AppError from "../errors/AppError.js";

export async function getAllFoodBanks({id,name,city,province,country}) {
  logger.info("in getAllFoodBanks:", id, name, city, province, country);

  let count = 1;
  const whereParams = [];
  let whereClause = [];
  id && whereParams.push(id) && whereClause.push(`id=$${count++}`);  
  name &&
    whereParams.push(name) &&
    whereClause.push(`name ILIKE $${count++}`);
  city &&
    whereParams.push(city) &&
    whereClause.push(`city ILIKE $${count++}`);
  province &&
    whereParams.push(province) &&
    whereClause.push(`province ILIKE $${count++}`);
  country &&
    whereParams.push(country) &&
    whereClause.push(`country ILIKE $${count++}`);

  whereClause = whereClause.length === 0 ? "" : whereClause.length === 1 ? `WHERE ${whereClause}` : `WHERE ${whereClause.join(' AND ')}`;
  
  const { rows } = await pool.query(
    `SELECT id,name,unit_no,street,city,province,country,postal_code,longitude,latitude,website,phone,fax,charity_registration_no,timezone from foodbanks  ${whereClause} ORDER BY country,province,city;`,
    whereParams,
  );
  return rows;
}
/*
export async function getAllFoodBanks() {
  logger.info("in getAllFoodBanks");
  const { rows } = await pool.query(
    "SELECT * from foodbanks INNER JOIN users ON admin=users.id INNER JOIN user_roles AS ur ON users.id=ur.user_id ORDER BY country,province,city;",
  );
  return rows;
}
  */