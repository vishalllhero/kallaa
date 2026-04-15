import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://kallaa:Vishalhero003@cluster0.wsjcmdt.mongodb.net/kallaa?retryWrites=true&w=majority";

async function test() {
  console.log("Starting DB test...");
  try {
    const conn = await Promise.race([
      mongoose.connect(MONGO_URI),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
    ]);
    console.log("Connected!");
  } catch (err) {
    console.error("Test failed:", err.message);
  } finally {
    process.exit(0);
  }
}

test();
