import { Joi } from "celebrate";
import { config as configEnv } from "dotenv";
import { NODE_ENV } from "typings/global_enums";

/**
 * change working directory back to app root
 * this is needed cause root directory got changed to ${__dirname/src/config} by knex migration
 * changing the root directory back to ./ is needed so dotenv can find and read .env
 */

configEnv();

// define validation for all the env vars
const envVarsSchema = Joi.object<EnvironmentInterface>({
  NODE_ENV: Joi.string()
    .valid(
      NODE_ENV.DEVELOPMENT,
      NODE_ENV.PRODUCTION,
      NODE_ENV.STAGING,
      NODE_ENV.TESTING
    )
    .default(NODE_ENV.DEVELOPMENT),

  PORT: Joi.number().default(6060),

  DATA_BASE_HOST: Joi.string()
    .default("localhost")
    .description("Database host name")
    .required(),

  DATA_BASE_DIALECT: Joi.string()
    .default("mysql")
    .description("Database dialect")
    .required(),

  DATA_BASE_PASSWORD: Joi.string()
    .default("password")
    .description("Database password")
    .required(),

  DATA_BASE_USER: Joi.string()
    .default("mysql")
    .description("Database user")
    .required(),

  DATA_BASE_NAME: Joi.string()
    .default("birdie-test")
    .description("Database name")
    .required(),
})
  .unknown()
  .required();

const { error, value: envVariables } = envVarsSchema.validate(process.env, {
  abortEarly: false,
}) as {
  error: Error | undefined;
  value: EnvironmentInterface;
};

if (error) throw new Error(`Config validation error: ${error.message}`);

export default envVariables;
