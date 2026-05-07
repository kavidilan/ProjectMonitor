const protect = (req, res, next) => {
  // In a real app, verify JWT tokens here
  const role = req.headers['x-user-role'];
  if (!role) {
    return res.status(401).json({ message: 'Not authorized, no role provided' });
  }
  req.userRole = String(role).trim();
  next();
};

const authorizeRoles = (...allowedRoles) => {
  const allowed = new Set(allowedRoles.map((r) => String(r).trim().toLowerCase()));

  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const role = String(req.userRole).trim().toLowerCase();
    // Always allow the admin user to write.
    if (role === 'admin') return next();
    if (!allowed.has(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };