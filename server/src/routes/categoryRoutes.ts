import express from "express";
import { findAllCategories } from "../controllers/categoryControllers/FindAllCategories";

const router = express.Router();

router.get("/", findAllCategories);

export default router;
