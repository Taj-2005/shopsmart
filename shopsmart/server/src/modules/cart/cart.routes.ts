import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import type { AuthRequest } from "../../middleware/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) return res.json({ success: true, data: { id: null, items: [] } });
    const data = { ...cart, items: cart.items.map((i) => ({ ...i, product: i.product ? { ...i.product, price: Number(i.product.price) } : null })) };
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity = 1 } = req.body;
    if (!productId) return next(new AppError(400, "productId required", "VALIDATION_ERROR"));
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity },
    });
    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
    res.status(201).json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
});

router.patch("/item/:id", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { quantity } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return next(new AppError(404, "Cart not found", "NOT_FOUND"));
    const item = await prisma.cartItem.findFirst({ where: { id: req.params.id, cartId: cart.id } });
    if (!item) return next(new AppError(404, "Cart item not found", "NOT_FOUND"));
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
      return res.json({ success: true, data: { removed: true } });
    }
    const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
});

router.delete("/item/:id", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return next(new AppError(404, "Cart not found", "NOT_FOUND"));
    const item = await prisma.cartItem.findFirst({ where: { id: req.params.id, cartId: cart.id } });
    if (!item) return next(new AppError(404, "Cart item not found", "NOT_FOUND"));
    await prisma.cartItem.delete({ where: { id: item.id } });
    res.json({ success: true, message: "Item removed" });
  } catch (e) {
    next(e);
  }
});

export default router;
