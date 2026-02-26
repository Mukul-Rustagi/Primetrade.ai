const fs = require("fs");
const path = require("path");

const logsDir = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

const writeErrorLog = (error) => {
  const message = error && error.stack ? error.stack : String(error);
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(path.join(logsDir, "error.log"), line, () => {});
};

module.exports = {
  accessLogStream,
  writeErrorLog,
  logsDir,
};

