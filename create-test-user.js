// Simple test to create admin user with hashed password
import bcrypt from "bcryptjs";
import fs from "fs";

async function createTestUser() {
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    name: "Admin User",
    email: "admin@kallaa.com",
    password: hashedPassword,
    role: "admin",
  };

  // Save to a JSON file for testing
  fs.writeFileSync("test-user.json", JSON.stringify(user, null, 2));
  console.log("Test user created:", user);
  console.log("Hashed password:", hashedPassword);
}

createTestUser();
