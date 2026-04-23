// Test Cloudinary connection
async function testCloudinary() {
  try {
    console.log("Testing Cloudinary connection...");
    const response = await fetch(
      "http://localhost:5000/api/products/test-cloudinary"
    );
    const result = await response.json();
    console.log("Test result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testCloudinary();
