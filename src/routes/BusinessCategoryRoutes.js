import { Router } from "express";

import BusinessCategoryController from "../controllers/BusinessCategoryController.js";

const router = Router();

router.get("/", BusinessCategoryController.getAll);

export default router;
