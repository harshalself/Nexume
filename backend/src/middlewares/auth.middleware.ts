import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabaseClient";
import HttpException from "../exceptions/HttpException";

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    // List of public routes to bypass authentication
    const publicRoutes = [
      { method: "POST", path: "/auth/signup" },
      { method: "POST", path: "/auth/signin" },
    ];
    // If the current route is public, skip authentication
    if (
      publicRoutes.some((r) => r.method === req.method && req.path === r.path)
    ) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpException(401, "No token provided"));
    }
    const token = authHeader.split(" ")[1];
    supabase.auth
      .getUser(token)
      .then(({ data, error }) => {
        if (error || !data.user) {
          return next(new HttpException(401, "Invalid or expired token"));
        }
        (req as any).user = data.user;
        next();
      })
      .catch(() => {
        next(new HttpException(401, "Unauthorized"));
      });
  }
}
