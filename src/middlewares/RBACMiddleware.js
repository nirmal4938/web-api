// Sample role guard
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    next();
  };
};

// Example of permission guard (if using permissions list)
export const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];

    const hasPermission = requiredPermissions.every(p =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied: Missing permissions' });
    }

    next();
  };
};
