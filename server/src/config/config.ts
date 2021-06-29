import path from "path";

import dotenv from "dotenv";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(8080),
    DB_HOST: Joi.string().default("localhost"),
    DB_PORT: Joi.number().default(5432),
    DB_DATABASE: Joi.string().default("poll"),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().default("").allow(""),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION: Joi.number()
      .default(60*60*24)
      .description("JWT life span in seconds"),
    SSO_API_KEY: Joi.string().required(),
    SSO_API_SECRET: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: parseInt(envVars.PORT),
  sequelize: {
    host: envVars.DB_HOST,
    port: parseInt(envVars.DB_PORT),
    database: envVars.DB_DATABASE,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpiration: envVars.JWT_ACCESS_EXPIRATION,
  },
  sso: {
    key: envVars.SSO_API_KEY,
    secret: envVars.SSO_API_SECRET
  }
};
