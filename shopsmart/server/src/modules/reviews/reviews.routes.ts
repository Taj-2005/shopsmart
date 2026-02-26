import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { ADMIN_ROLES } from "../../constants/roles";

import type { AuthRequest } from "../../middleware/authenticate";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { productId, rating, body } = req.body;
    if (!productId || rating == null) return next(new AppError(400, "productId and rating required", "VALIDATION_ERROR"));
    if (rating < 1 || rating > 5) return next(new AppError(400, "rating must be 1-5", "VALIDATION_ERROR"));
    const product = await prisma.product.findFirst({ where: { id: productId, deletedAt: null } });
    if (!product) return next(new AppError(404, "Product not found", "NOT_FOUND"));
    const review = await prisma.review.create({
      data: { userId: req.user!.id, productId, rating, body: body || null },
      include: { user: { select: { id: true, fullName: true } } },
    });
    res.status(201).json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Review deleted" });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/status", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const { status } = req.body as { status?: string };
    const allowed = ["pending", "approved", "rejected", "flagged"];
    if (!status || !allowed.includes(status)) return next(new AppError(400, "status must be one of: " + allowed.join(", "), "VALIDATION_ERROR"));
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: { select: { id: true, fullName: true } }, product: { select: { id: true, name: true } } },
    });
    res.json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
});

export default router;
