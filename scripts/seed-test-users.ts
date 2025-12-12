import { getDb } from "../server/db";

async function seedTestUsers() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  try {
    console.log("🌱 Seeding test users...");

    // Streamer Test User
    await db.insert(users).values({
      openId: "test-streamer-001",
      name: "Mariana Silva",
      email: "streamer@test.com",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }).onDuplicateKeyUpdate({
      set: {
        name: "Mariana Silva",
        email: "streamer@test.com",
        lastSignedIn: new Date(),
      },
    });

    // Viewer Test User
    await db.insert(users).values({
      openId: "test-viewer-001",
      name: "João Cliente",
      email: "viewer@test.com",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }).onDuplicateKeyUpdate({
      set: {
        name: "João Cliente",
        email: "viewer@test.com",
        lastSignedIn: new Date(),
      },
    });

    // Admin Test User
    await db.insert(users).values({
      openId: "test-admin-001",
      name: "Admin Flayve",
      email: "admin@test.com",
      loginMethod: "test",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }).onDuplicateKeyUpdate({
      set: {
        name: "Admin Flayve",
        email: "admin@test.com",
        lastSignedIn: new Date(),
        role: "admin",
      },
    });

    console.log("✅ Test users seeded successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("Streamer: streamer@test.com / Test@123456");
    console.log("Viewer: viewer@test.com / Test@123456");
    console.log("Admin: admin@test.com / Test@123456");

  } catch (error) {
    console.error("❌ Error seeding test users:", error);
  }
}

seedTestUsers();
