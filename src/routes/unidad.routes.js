import { Router } from "express";
import { getAllUnidades } from "../controllers/unidad.controller.js";

const router = Router();

router.get("/", getAllUnidades);

export default router;