import env from "./env";
import { reportError } from "../helpers";
import { NODE_ENV } from "typings/global_enums";
import { Dialect, PoolOptions, Sequelize } from "sequelize";

const pool: PoolOptions = { max: 5, min: 0, idle: 10000 };
export let sequelize: Sequelize;

// initialize sequelize database based on the environment the app ran
const initializeDB = () => {
  if (sequelize) return;

  switch (process.env.NODE_ENV) {
    case NODE_ENV.STAGING:
    case NODE_ENV.PRODUCTION:
    case NODE_ENV.DEVELOPMENT:
      sequelize = new Sequelize({
        pool,
        host: env.DATA_BASE_HOST,
        database: env.DATA_BASE_NAME,
        username: env.DATA_BASE_USER,
        password: env.DATA_BASE_PASSWORD,
        dialect: env.DATA_BASE_DIALECT as Dialect,
      });
      break;

    case NODE_ENV.TESTING:
      sequelize = new Sequelize({
        host: "localhost",
        dialect: "sqlite",
        username: "birdie",
        password: "password",
        database: "birdie-test",
        storage: "../../database.sqlite",
      });
      break;

    default:
      break;
  }
};

// authenticate the sequelize database
const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    reportError(error);
  }
};

// start the sequelize database
export const start = async () => {
  initializeDB();
  authenticateDB();
};
