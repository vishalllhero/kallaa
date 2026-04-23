declare global {
  namespace Express {
    interface Request {
      user?: any; // Use any for now as requested for safe casting/simplicity
    }
  }
}

export {};
