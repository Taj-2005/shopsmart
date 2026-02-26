import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { prisma } from "../../config/prisma";
import type { AuthRequest } from "../../middleware/authenticate";
import * as authController from "../auth/auth.controller";

const router = Router();

router.use(authenticate);

router.get("/me", authController.me);

router.patch("/me", async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Authentication required" });
    const { fullName, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(fullName != null && { fullName }), ...(avatarUrl != null && { avatarUrl }) },
      select: { id: true, email: true, fullName: true, role: true, avatarUrl: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

export default router;
