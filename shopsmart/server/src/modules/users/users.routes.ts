import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { allowSelfOrAdmin } from "../../middleware/allowSelfOrAdmin";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import type { AuthRequest } from "../../middleware/authenticate";
import { ADMIN_ROLES } from "../../constants/roles";

const router = Router();

router.get("/", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, email: true, fullName: true, role: true, active: true, createdAt: true },
      take: 50,
    });
    res.json({ success: true, data: users });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, allowSelfOrAdmin("id"), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, deletedAt: null },
      select: { id: true, email: true, fullName: true, role: true, avatarUrl: true, createdAt: true },
    });
    if (!user) return next(new AppError(404, "User not found", "NOT_FOUND"));
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", authenticate, allowSelfOrAdmin("id"), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { ...(fullName != null && { fullName }), ...(avatarUrl != null && { avatarUrl }) },
      select: { id: true, email: true, fullName: true, role: true, avatarUrl: true },
    });
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, allowSelfOrAdmin("id"), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.update({ where: { id }, data: { deletedAt: new Date(), active: false } });
    res.json({ success: true, message: "User deleted" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/orders", authenticate, allowSelfOrAdmin("id"), async (req: AuthRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.id },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const data = orders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      shipping: Number(o.shipping),
      total: Number(o.total),
    }));
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/cart", authenticate, allowSelfOrAdmin("id"), async (req: AuthRequest, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.params.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart) return res.json({ success: true, data: null });
    res.json({
      success: true,
      data: {
        ...cart,
        items: cart.items.map((i) => ({ ...i, product: i.product ? { ...i.product, price: Number(i.product.price) } : null })),
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
