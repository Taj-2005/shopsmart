import "dotenv/config";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcryptjs";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Customer" },
  });
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Admin" },
  });
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: { name: "SUPER_ADMIN", description: "Super Admin" },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics", description: "Gadgets and electronics" },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: { name: "Fashion", slug: "fashion", description: "Apparel and accessories" },
    }),
    prisma.category.upsert({
      where: { slug: "home" },
      update: {},
      create: { name: "Home", slug: "home", description: "Home and living" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports", description: "Sports and fitness" },
    }),
  ]);

  const hash = await bcrypt.hash("Admin123!", SALT_ROUNDS);
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@shopsmart.test" },
    update: {},
    create: {
      email: "admin@shopsmart.test",
      passwordHash: hash,
      fullName: "Super Admin",
      roleId: superAdminRole.id,
      emailVerified: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@shopsmart.example.com" },
    update: {},
    create: {
      email: "admin@shopsmart.example.com",
      passwordHash: hash,
      fullName: "Admin User",
      roleId: adminRole.id,
      emailVerified: true,
    },
  });

  const customerHash = await bcrypt.hash("Customer1!", SALT_ROUNDS);
  const users: { id: string }[] = [superAdmin, adminUser];
  for (let i = 1; i <= 48; i++) {
    const u = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        passwordHash: customerHash,
        fullName: `Customer ${i}`,
        roleId: customerRole.id,
        emailVerified: i <= 10,
      },
    });
    users.push(u);
  }

  const categoryIds = categories.map((c) => c.id);
  const productData = [
    { name: "Wireless Headphones", slug: "wireless-headphones", cat: 0, price: 4999, orig: 6999, isNew: true, isDeal: true },
    { name: "Running Shoes", slug: "running-shoes", cat: 3, price: 6499, orig: null, isNew: true, isDeal: false },
    { name: "Table Lamp", slug: "table-lamp", cat: 2, price: 2299, orig: 2999, isNew: false, isDeal: true },
    { name: "Smart Watch", slug: "smart-watch", cat: 0, price: 12999, orig: 15999, isNew: false, isDeal: true },
    { name: "Cotton T-Shirt", slug: "cotton-tshirt", cat: 1, price: 1299, orig: null, isNew: false, isDeal: false },
    { name: "Desk Organiser", slug: "desk-organiser", cat: 2, price: 1799, orig: null, isNew: false, isDeal: false },
  ];
  const images = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop",
  ];
  const products: { id: string }[] = [];
  for (let i = 0; i < 100; i++) {
    const p = productData[i % productData.length];
    const catId = categoryIds[p.cat % categoryIds.length];
    const slug = `${p.slug}-${i}`;
    const prod = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: `${p.name} ${i}`,
        slug,
        description: `Product ${i}`,
        price: p.price + (i % 5) * 100,
        originalPrice: p.orig ?? undefined,
        image: images[i % images.length],
        categoryId: catId,
        inStock: true,
        stockQty: 50 + (i % 100),
        active: true,
        isNew: p.isNew && i < 20,
        isDeal: p.isDeal && i < 30,
      },
    });
    products.push(prod);
  }

  for (let i = 0; i < 30; i++) {
    const userId = users[(i % users.length)].id;
    const productId = products[i % products.length].id;
    const qty = (i % 3) + 1;
    const price = 1000 + (i % 5) * 500;
    await prisma.order.create({
      data: {
        userId,
        status: STATUSES[i % 4],
        subtotal: price * qty,
        discount: 0,
        shipping: 99,
        total: price * qty + 99,
        items: {
          create: [{ productId, quantity: qty, price }],
        },
      },
    });
  }

  for (let i = 0; i < 40; i++) {
    await prisma.review.create({
      data: {
        userId: users[(i % users.length)].id,
        productId: products[i % products.length].id,
        rating: (i % 5) + 1,
        body: `Review text ${i}.`,
        status: i % 3 === 0 ? "pending" : "approved",
      },
    });
  }

  console.log("Seed completed: roles, categories, 50 users, 100 products, 30 orders, 40 reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
