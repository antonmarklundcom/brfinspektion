import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.SEED_OWNER_EMAIL;
  const ownerPassword = process.env.SEED_OWNER_PASSWORD;

  if (!ownerEmail || !ownerPassword) {
    throw new Error("SEED_OWNER_EMAIL and SEED_OWNER_PASSWORD must be set to run the seed");
  }

  const passwordHash = await bcrypt.hash(ownerPassword, 12);

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      passwordHash,
      name: "Anton",
      role: "OWNER",
      active: true,
    },
  });

  console.info(`Seeded OWNER user: ${ownerEmail}`);

  // Partner org records only — no login users, no real names or
  // certifications (plan.md D10, D2: revenue-share terms and credentials
  // are not finalized). These exist so leads/projects can be assigned to
  // a partner in the admin UI before real partner logins are created.
  await prisma.partner.upsert({
    where: { name: "Partner A — KA/besiktning" },
    update: {},
    create: {
      name: "Partner A — KA/besiktning",
      services: [
        "KONTROLLANSVARIG",
        "ENTREPRENADBESIKTNING",
        "GARANTIBESIKTNING_2AR",
        "GARANTIBESIKTNING_5AR",
        "OVK",
      ],
    },
  });

  await prisma.partner.upsert({
    where: { name: "Partner B — Statusbedömning" },
    update: {},
    create: {
      name: "Partner B — Statusbedömning",
      services: ["STATUSBESIKTNING", "UPPHANDLINGSSTOD", "UNDERHALLSPLAN"],
    },
  });

  console.info("Seeded Partner A and Partner B org records (no logins)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
