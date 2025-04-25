import { Router } from "express";
import {
  verify2FA,
  getF2ADetails,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyCookie } from "../services/cookie.service.js";

const router = Router();

router.post("/verify-2fa", verify2FA);
router.get("/verify-cookie", verifyCookie);
router.get("/F2A-details", verifyCookie, getF2ADetails);
router.get("/check-auth", verifyCookie, checkAuth);

export default router;
