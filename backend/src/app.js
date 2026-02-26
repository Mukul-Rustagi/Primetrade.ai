const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const { accessLogStream } = require("./config/logger");
const setupSwagger = require("./docs/swagger");
const apiV1Router = require("./routes/v1");
const sanitizeInput = require("./middleware/sanitize.middleware");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(sanitizeInput);
app.use(morgan("combined", { stream: accessLogStream }));

if (env.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/v1", apiV1Router);
setupSwagger(app);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
