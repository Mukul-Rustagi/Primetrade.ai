const AppError = require("../utils/AppError");
const { writeErrorLog } = require("../config/logger");

const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational || statusCode < 500
      ? err.message
      : "Internal server error";

  if (statusCode >= 500) {
    // Surface server errors in logs for debugging and post-submission traceability.
    // eslint-disable-next-line no-console
    console.error(err);
    writeErrorLog(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
