import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import type { AuthRequest } from "../../middleware/authenticate";
import { OrderStatus } from "@prisma/client";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { addressId, items } = req.body as { addressId?: string; items: { productId: string; quantity: number }[] };
    if (!items?.length) return next(new AppError(400, "items required", "VALIDATION_ERROR"));
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, deletedAt: null, active: true } });
    let subtotal = 0;
    const orderItems = items.map((oi: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === oi.productId);
      if (!product) throw new AppError(400, "Product not found: " + oi.productId, "VALIDATION_ERROR");
      const price = Number(product.price);
      subtotal += price * oi.quantity;
      return { productId: product.id, quantity: oi.quantity, price };
    });
    const order = await prisma.order.create({
      data: {
        userId,
        addressId: addressId || null,
        status: OrderStatus.PENDING,
        subtotal,
        discount: 0,
        shipping: 0,
        total: subtotal,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });
    res.status(201).json({
      success: true,
      data: {
        ...order,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shipping: Number(order.shipping),
        total: Number(order.total),
        items: order.items.map((i) => ({ ...i, price: Number(i.price) })),
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: { include: { product: { select: { id: true, name: true, image: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const data = orders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      shipping: Number(o.shipping),
      total: Number(o.total),
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
    }));
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { items: { include: { product: true } }, address: true },
    });
    if (!order) return next(new AppError(404, "Order not found", "NOT_FOUND"));
    res.json({
      success: true,
      data: {
        ...order,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shipping: Number(order.shipping),
        total: Number(order.total),
        items: order.items.map((i) => ({ ...i, price: Number(i.price) })),
      },
    });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/status", authenticate, authorize("ADMIN", "SUPER_ADMIN"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Object.values(OrderStatus).includes(status)) return next(new AppError(400, "Invalid status", "VALIDATION_ERROR"));
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true },
    });
    res.json({ success: true, data: { ...order, subtotal: Number(order.subtotal), total: Number(order.total) } });
  } catch (e) {
    next(e);
  }
});

export default router;
