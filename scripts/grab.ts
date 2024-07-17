import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  try {
    // Fetch all data from each table
    const categories = await prisma.category.findMany();
    // Add more tables as needed

    // Format the data as needed (example format)
    const formattedData = {
      categories,
      // Add more tables as needed
    };

    // Convert data to JSON string
    const jsonData = JSON.stringify(formattedData, null, 2);

    // Write data to seed file
    await fs.writeFile("seedData.json", jsonData, "utf8");

    console.log("Data fetched and saved successfully.");
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
