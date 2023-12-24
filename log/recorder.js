const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const config = require('../config.js');

// Create a write stream to write logs to a file
const logDirectory = path.join(__dirname, config.log.requestsLog.folderName);
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream(config.log.requestsLog.fileName, {
  interval: config.log.requestsLog.interval || '1d', // Create a new log file every day (default: every 5 seconds)
  path: logDirectory,
  maxFiles: config.log.requestsLog.maxFiles || 7, // Keep logs for the specified number of days (default: 7)
  encoding: config.log.requestsLog.encoding || 'utf-8', // Set encoding to utf-8
});

function startLog(app) {
  let returnString;
  if (config.log.requestsLog.logging) {
    returnString = logDirectory;
    if (!config.log.requestsLog.onlyError) {
      app.use(morgan(config.log.requestsLog.typ, { stream: accessLogStream }));
    } else {
      // Use a custom format string to log only error requests
      const format = '[:date[iso]] :remote-addr :status :method :url';
      app.use(morgan(format, {
        stream: accessLogStream,
        skip: (req, res) => res.statusCode < 400, // Log requests with status code >= 400 only
      }));
    }
  } else {
    returnString = `Not Logging`;
  }

  return returnString;
}

// If app object is not needed elsewhere, export only the startLog function
module.exports = startLog;
