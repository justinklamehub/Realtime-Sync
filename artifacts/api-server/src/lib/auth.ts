import type { Request, Response, NextFunction } from "express";

export type Role =
  | "comet_admin"
  | "comet_leitstand"
  | "comet_lager"
  | "comet_viewer"
  | "speditions_admin"
  | "speditions_bearbeiter"
  | "speditions_viewer";

export const COMET_ROLES: Role[] = [
  "comet_admin",
  "comet_leitstand",
  "comet_lager",
  "comet_viewer",
];

export const SPEDITION_ROLES: Role[] = [
  "speditions_admin",
  "speditions_bearbeiter",
  "speditions_viewer",
];

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: Role;
    speditionId: number | null;
    username: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return next();
}

export function requireRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.session.role as Role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

export function requireCometAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRoles("comet_admin")(req, res, next);
}

export function requireCometOrAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRoles(
    "comet_admin",
    "comet_leitstand",
    "comet_lager",
    "comet_viewer"
  )(req, res, next);
}

export function isCometRole(role: string): boolean {
  return COMET_ROLES.includes(role as Role);
}

export function isSpeditionRole(role: string): boolean {
  return SPEDITION_ROLES.includes(role as Role);
}
