import FormData from "form-data";
import fs from "fs";

// Test the upload endpoint
async function testUpload() {
  const form = new FormData();
  // Create a simple test image buffer
  const testImageBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  form.append("image", testImageBuffer, "test.png");

  try {
    console.log("Testing upload endpoint...");

    const response = await fetch("http://localhost:5000/api/products/upload", {
      method: "POST",
      body: form,
      // Note: In production, you'd need proper auth headers
    });

    const result = await response.json();
    console.log("Upload response:", response.status, result);

    if (response.ok) {
      console.log("✅ Upload successful!");
      console.log("Image URL:", result.url);
    } else {
      console.log("❌ Upload failed:", result.error);
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

testUpload();
