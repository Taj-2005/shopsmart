import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "../../config/prisma";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
    });
    res.json({ success: true, data: categories });
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
        description,
      },
    });
    res.status(201).json({ success: true, data: category });
  } catch (e) {
    next(e);
  }
});

export default router;
