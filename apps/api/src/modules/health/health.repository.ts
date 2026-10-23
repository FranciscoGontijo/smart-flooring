import { db } from "../../lib/prisma-errors.js";
import { prisma } from "../../lib/prisma.js";

export const healthRepository = {
  async ping(): Promise<void> {
    await db(() => prisma.$queryRaw`SELECT 1`);
  },
};
