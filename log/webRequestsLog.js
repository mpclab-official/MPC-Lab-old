// webRequestsLog.js
// This file contains the code for logging web requests.

// Load config file
const config = require("../config.js");

// Load required modules
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");

// Create a write stream to write logs to a file
const logDirectory = path.join(
  config.log.path,
  config.log.webRequestsLog.folderName
);

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  try {
    fs.mkdirSync(logDirectory, { recursive: true });
  } catch (err) {
    console.error(`Error creating log directory: ${err.message}`);
    // Handle the error as needed
  }
}

const accessLogStream = rfs.createStream(config.log.webRequestsLog.fileName, {
  interval: config.log.webRequestsLog.interval || "1d", // Create a new log file every day (default: every 5 seconds)
  path: logDirectory,
  maxFiles: config.log.webRequestsLog.maxFiles || 7, // Keep logs for the specified number of days (default: 7)
  encoding: config.log.webRequestsLog.encoding || "utf-8", // Set encoding to utf-8
});

// Start logging
function startLog(app) {
  let returnString;
  if (config.log.webRequestsLog.logging) {
    returnString = logDirectory;
    if (!config.log.webRequestsLog.onlyError) {
      app.use(
        morgan(config.log.webRequestsLog.typ, { stream: accessLogStream })
      );
    } else {
      // Use a custom format string to log only error requests
      const format = "[:date[iso]] :remote-addr :status :method :url";
      app.use(
        morgan(format, {
          stream: accessLogStream,
          skip: (req, res) => res.statusCode < 400, // Log requests with status code >= 400 only
        })
      );
    }
  } else {
    returnString = "Not Logging";
  }

  return returnString;
}

// Export the module
module.exports = startLog;
