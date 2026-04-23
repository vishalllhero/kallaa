import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

async function testProductCreation() {
  const form = new FormData();
  form.append("title", "Test Product");
  form.append("price", "100");
  form.append("description", "Test description");
  form.append("story", "Test story");
  form.append("mood", "happy");
  // For testing, we'll create a dummy file
  form.append("image", Buffer.from("dummy image content"), "test.jpg");

  try {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: form,
      headers: {
        Cookie: "token=dummy", // Mock auth
      },
    });

    const result = await response.json();
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

testProductCreation();
