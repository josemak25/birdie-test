/**************************************************************************************** *
 * ************************                             ********************************* *
 * ************************   HEALTH CHECK APP ROUTES   ********************************* *
 * ************************                             ********************************* *
 * ************************************************************************************** */

import { Request, Response, Router } from "express";
import httpStatus from "http-status";

const router = Router();

router
  .route("/")
  .get((_req: Request, res: Response) =>
    res.status(httpStatus.OK).json({ check: "birdie server started ok" })
  );

// this is just a test, but basically the expectation is to test all your app routes here
router.route("/hello").get((_req: Request, res: Response) =>
  res.status(httpStatus.OK).json({
    greetings: `Thank you for spending some time on this test. All the best 🙌`,
  })
);

export default router;
