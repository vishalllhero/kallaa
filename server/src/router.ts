import express, { Request, Response } from "express";

const router = express.Router();

// ✅ signup
router.post("/api/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  res.json({
    token: "demo-token",
    user: { name, email },
  });
});

// ✅ login
router.post("/api/login", async (req: Request, res: Response) => {
  const { email } = req.body;

  res.json({
    token: "demo-token",
    user: { email },
  });
});

export default router;