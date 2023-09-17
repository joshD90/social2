import { Router } from "express";
import searchController from "../controllers/searchControllers/searchController";
const router = Router();

router.post("/", searchController);

export default router;
