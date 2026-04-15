declare global {
  namespace Express {
    interface Request {
      user?: any; // 🔥 TEMP but stable
    }
  }
}

export {};
