const isProd = process.env.NODE_ENV === "production";

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    if (isProd) return;
    console.log(JSON.stringify({ level: "info", msg, ...meta }));
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    if (isProd) return;
    console.warn(JSON.stringify({ level: "warn", msg, ...meta }));
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    console.error(JSON.stringify({ level: "error", msg, ...meta }));
  },
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (isProd) return;
    console.debug(JSON.stringify({ level: "debug", msg, ...meta }));
  },
};
