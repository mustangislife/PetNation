import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

if (
  process.env.NODE_ENV === "production" ||
  process.env.ALLOW_TUTORIAL_SEED !== "1"
) {
  throw new Error(
    "Tutorial seeding is disabled. Use an isolated development database and set ALLOW_TUTORIAL_SEED=1.",
  );
}

const userData: Prisma.UserCreateInput = {
  email: "example@gmail.com",
  hashedPassword: "",
  pets: {
    create: [
      {
        name: "Benjamin",
        ownerName: "John Doe",
        imageUrl: "https://i.postimg.cc/tgZrm3Xs/benjamin.png",
        age: 2,
        notes:
          "Doesn't like to be touched on the belly. Plays well with other dogs.",
      },
      {
        name: "Richard",
        ownerName: "Josephine Dane",
        imageUrl: "https://i.postimg.cc/QM26LFtY/richard.png",
        age: 5,
        notes: "Needs medication twice a day.",
      },
      {
        name: "Anna",
        ownerName: "Frank Doe",
        imageUrl: "https://i.postimg.cc/k4WT776v/anna.png",
        age: 4,
        notes: "Allergic to chicken.",
      },
    ],
  },
};

async function main() {
  console.log(`Start seeding ...`);

  const password = process.env.TUTORIAL_SEED_PASSWORD;
  if (!password || password.length < 16)
    throw new Error(
      "Set a unique TUTORIAL_SEED_PASSWORD of at least 16 characters.",
    );
  const hashedPassword = await bcrypt.hash(password, 12);
  userData.hashedPassword = hashedPassword;

  await prisma.user.create({
    data: userData,
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
