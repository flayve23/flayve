import { drizzle } from "drizzle-orm/mysql2";
import { tags } from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const brazilianTags = [
  { name: "Iniciantes", slug: "iniciantes" },
  { name: "Maduras", slug: "maduras" },
  { name: "Trans", slug: "trans" },
  { name: "Pés", slug: "pes" },
  { name: "Dominatrix", slug: "dominatrix" },
  { name: "Casal", slug: "casal" },
  { name: "Loiras", slug: "loiras" },
  { name: "Morenas", slug: "morenas" },
  { name: "Ruivas", slug: "ruivas" },
  { name: "Fitness", slug: "fitness" },
  { name: "Plus Size", slug: "plus-size" },
  { name: "Tatuadas", slug: "tatuadas" },
];

async function seedTags() {
  try {
    console.log("🌱 Seeding tags...");
    
    for (const tag of brazilianTags) {
      await db.insert(tags).values(tag).onDuplicateKeyUpdate({
        set: { name: tag.name }
      });
    }
    
    console.log("✅ Tags seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding tags:", error);
    process.exit(1);
  }
}

seedTags();
