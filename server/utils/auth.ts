import express, { NextFunction, Request, Response } from 'express'

export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  // const roles = (req as any).user?.roles || [];
  // console.log("in checkAuthenticated, user: ", req.user)
  if (!req.isAuthenticated()) {
    // response with message Unauthorized
    res.status(401).json({ message: "Unauthorized" })
    return
  }
  
  next()
}

export function checkRole(requiredRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const roles = (req.user as any)?.roles || [];
    const hasRequiredRole = roles.some((role: string) => requiredRoles.includes(role));
    console.log("hasRequiredRole", hasRequiredRole)
    if (hasRequiredRole) {
      next(); // User has one of the required roless, proceed
    } else {
      console.log("hasRequiredRole2", hasRequiredRole)

      res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
  };
}