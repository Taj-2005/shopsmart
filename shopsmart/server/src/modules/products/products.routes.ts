import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "../../config/prisma";
import { ADMIN_ROLES } from "../../constants/roles";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null, active: true },
      include: { category: true },
      take: 100,
    });
    const data = products.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      subtotal: null,
      total: null,
    }));
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id, status: "approved" },
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, data: reviews });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({
      success: true,
      data: {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/analytics", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, deletedAt: null },
      select: { id: true, name: true, slug: true },
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const [orderItems, reviews] = await Promise.all([
      prisma.orderItem.aggregate({ where: { productId: product.id }, _sum: { quantity: true }, _count: true }),
      prisma.review.aggregate({ where: { productId: product.id }, _avg: { rating: true }, _count: true }),
    ]);
    res.json({
      success: true,
      data: {
        ...product,
        unitsSold: orderItems._sum.quantity ?? 0,
        orderCount: orderItems._count,
        avgRating: reviews._avg.rating ? Number(reviews._avg.rating) : null,
        reviewCount: reviews._count,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const body = req.body;
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug ?? body.name.toLowerCase().replace(/\s+/g, "-"),
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        image: body.image ?? "",
        categoryId: body.categoryId,
        inStock: body.inStock ?? true,
        stockQty: body.stockQty ?? 0,
        active: body.active ?? true,
        isNew: body.isNew ?? false,
        isDeal: body.isDeal ?? false,
      },
    });
    res.status(201).json({ success: true, data: product });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const body = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(body.name != null && { name: body.name }),
        ...(body.slug != null && { slug: body.slug }),
        ...(body.description != null && { description: body.description }),
        ...(body.price != null && { price: body.price }),
        ...(body.originalPrice != null && { originalPrice: body.originalPrice }),
        ...(body.image != null && { image: body.image }),
        ...(body.categoryId != null && { categoryId: body.categoryId }),
        ...(body.inStock != null && { inStock: body.inStock }),
        ...(body.stockQty != null && { stockQty: body.stockQty }),
        ...(body.active != null && { active: body.active }),
        ...(body.isNew != null && { isNew: body.isNew }),
        ...(body.isDeal != null && { isDeal: body.isDeal }),
      },
    });
    res.json({ success: true, data: product });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    res.json({ success: true, message: "Product deleted" });
  } catch (e) {
    next(e);
  }
});

export default router;
