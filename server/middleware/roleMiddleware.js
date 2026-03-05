// middleware/roleMiddleware.js

/**
 * Role-based access control middleware
 * Usage: roleMiddleware("admin")
 * Usage: roleMiddleware("admin", "member")
 */

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware must run before this
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

export default roleMiddleware;
