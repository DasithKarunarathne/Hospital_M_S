function rbac(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action'
      });
      return;
    }

    next();
  };
}

module.exports = rbac;
