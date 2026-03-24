import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { uniqueId: "ADMIN-001" },
  });

  if (existing) {
    console.log("Admin already exists, skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      department: "CSE",
      role: "ADMIN",
      password: hashedPassword,
      status: "APPROVED",
      uniqueId: "ADMIN-001",
    },
  });

  console.log("Admin created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });