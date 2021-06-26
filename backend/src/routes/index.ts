/**************************************************************************************** *
 * ******************************                    ************************************ *
 * ******************************   ALL APP ROUTES   ************************************ *
 * ******************************                    ************************************ *
 * ************************************************************************************** */

import healthRoute from "./health.routes";
import { Router } from "express";

const router = Router();

// mount health check routes
router.use("/health-check", healthRoute);

export default router;