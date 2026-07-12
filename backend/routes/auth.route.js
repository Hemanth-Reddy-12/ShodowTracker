import { Router } from "express";
import { checkAuth } from "../controllers/auth.controller.js";
import { verifyCookie } from "../services/cookie.service.js";

const router = Router();

router.get("/check-auth", verifyCookie, checkAuth);

export default router;
