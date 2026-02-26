const AppError = require("../utils/AppError");

const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Forbidden: insufficient permissions", 403));
  }
  return next();
};

module.exports = { allowRoles };

