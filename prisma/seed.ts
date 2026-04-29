import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const coffee = await prisma.category.create({
    data: {
      name: "Coffee Gear",
      slug: "coffee-gear",
    },
  });

  const desk = await prisma.category.create({
    data: {
      name: "Desk Accessories",
      slug: "desk-accessories",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Ceramic Pour Over Dripper",
        slug: "ceramic-pour-over-dripper",
        description: "A clean ceramic dripper for manual brewing.",
        price: 2800,
        imageUrl: "/Peter_Griffin.png",
        categoryId: coffee.id,
        inStock: true,
      },
      {
        name: "Gooseneck Kettle",
        slug: "gooseneck-kettle",
        description: "Precision pouring kettle for pour over coffee.",
        price: 6900,
        imageUrl: "/Peter_Griffin.png",
        categoryId: coffee.id,
        inStock: true,
      },
      {
        name: "Walnut Desk Tray",
        slug: "walnut-desk-tray",
        description: "Minimal tray for organizing your desk essentials.",
        price: 4200,
        imageUrl: "/Peter_Griffin.png",
        categoryId: desk.id,
        inStock: true,
      },
      {
        name: "Metal Pen Stand",
        slug: "metal-pen-stand",
        description: "Compact pen stand with matte finish.",
        price: 1800,
        imageUrl: "/Peter_Griffin.png",
        categoryId: desk.id,
        inStock: true,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });