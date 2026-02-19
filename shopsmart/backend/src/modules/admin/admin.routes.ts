import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import type { AuthRequest } from "../../middleware/authenticate";
import { hashPassword } from "../../utils/hash";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", async (_req, res, next) => {
  try {
    const [userCount, productCount, orderCount, totalRevenue] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED" } }),
    ]);
    res.json({
      success: true,
      data: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        revenue: totalRevenue._sum.total ? Number(totalRevenue._sum.total) : 0,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/revenue", async (_req, res, next) => {
  try {
    const result = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "DELIVERED" },
    });
    res.json({ success: true, data: { total: result._sum.total ? Number(result._sum.total) : 0 } });
  } catch (e) {
    next(e);
  }
});

router.get("/users/stats", async (_req, res, next) => {
  try {
    const total = await prisma.user.count({ where: { deletedAt: null } });
    const byRole = await prisma.user.groupBy({
      by: ["roleId"],
      _count: true,
      where: { deletedAt: null },
    });
    const roles = await prisma.role.findMany();
    const data = {
      total,
      byRole: byRole.map((r) => ({
        roleId: r.roleId,
        roleName: roles.find((x) => x.id === r.roleId)?.name,
        count: r._count,
      })),
    };
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/products/stats", async (_req, res, next) => {
  try {
    const total = await prisma.product.count({ where: { deletedAt: null } });
    const active = await prisma.product.count({ where: { deletedAt: null, active: true } });
    res.json({ success: true, data: { total, active } });
  } catch (e) {
    next(e);
  }
});

router.get("/orders/stats", async (_req, res, next) => {
  try {
    const byStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });
    res.json({ success: true, data: byStatus });
  } catch (e) {
    next(e);
  }
});

router.post("/create-admin", authorize("SUPER_ADMIN"), async (req: AuthRequest, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) return next(new AppError(400, "email and password required", "VALIDATION_ERROR"));
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    if (!adminRole) return next(new AppError(500, "ADMIN role not found", "INTERNAL_ERROR"));
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return next(new AppError(409, "User already exists", "CONFLICT"));
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName || email,
        roleId: adminRole.id,
        emailVerified: true,
      },
      select: { id: true, email: true, fullName: true, role: true },
    });
    res.status(201).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

router.get("/logs", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { id: true, email: true } } },
    });
    res.json({ success: true, data: logs });
  } catch (e) {
    next(e);
  }
});

export default router;
