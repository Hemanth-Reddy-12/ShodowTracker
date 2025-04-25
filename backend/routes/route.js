import { Router } from "express";
import authRouter from "./auth.route.js";
import cryptoRouter from "./crypto.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/crypto", cryptoRouter);

export default router;
