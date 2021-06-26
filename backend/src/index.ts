import cors from "cors";
import http from "http";
import helmet from "helmet";
import logger from "morgan";
import express from "express";
import routes from "./routes";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { env, error, database } from "./config";
import { NODE_ENV } from "typings/global_enums";

// express application
const app = express();
const server = new http.Server(app);

if (
  env.NODE_ENV !== NODE_ENV.PRODUCTION &&
  env.NODE_ENV !== NODE_ENV.DEVELOPMENT &&
  env.NODE_ENV !== NODE_ENV.STAGING &&
  env.NODE_ENV !== NODE_ENV.TESTING
) {
  // eslint-disable-next-line no-console
  console.error(
    `NODE_ENV is set to ${env.NODE_ENV}, but only ${NODE_ENV.PRODUCTION} and ${NODE_ENV.DEVELOPMENT} are valid.`
  );
  process.exit(1);
}

// start and connect to database
database.start();

// secure apps by setting various HTTP headers
app.use(
  helmet({ dnsPrefetchControl: false, frameguard: false, ieNoOpen: false })
);

// compress request data for easy transport
app.use(compress());
app.use(methodOverride());

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

// parse body params and attach them to res.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable detailed API logging in dev env
if (env.NODE_ENV === NODE_ENV.DEVELOPMENT) {
  app.use(logger("dev"));
}

// all API versions are marked here within the app
app.use("/api/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

// opens a port if the NODE_ENV environment is not test
if (env.NODE_ENV !== NODE_ENV.TESTING) {
  server.listen(env.PORT, () => {
    console.info(`server started on port ${env.PORT} (${env.NODE_ENV})`); // eslint-disable-line no-console
  });
}

export default app;
