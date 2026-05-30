import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  console.log("User table columns (from a record):", Object.keys(user));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
