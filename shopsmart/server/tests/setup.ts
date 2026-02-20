// Ensure env has required vars for tests (avoid throwing in config)
process.env.DATABASE_URL = process.env.DATABASE_URL || "mysql://test:test@localhost:3306/test";
process.env.NODE_ENV = "test";
