import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { generateImg } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate", protectRoute, generateImg)

export default router;