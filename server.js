// server.js

// Import required modules
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config.js');
const startLog = require('./log/recorder.js');
const Auth = require(`${config.db.auth}/auth.js`);
const User = require(`${config.db.user}/user.js`);

// Create express application
const app = express();
const port = config.port;
const hostname = config.hostname;

// Configure session middleware
app.use(session({
  ...config.session
}));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Function to start the server
function startServer() {
  let startTable = new Object();
  console.clear();

  console.log("MPC Lab web-server is starting...");

  let startTime = new Date();

  // Header
  startTable.Name = config.name;
  startTable.Version = config.version;
  startTable.Start_Time = `${startTime.getFullYear()}/${(startTime.getMonth() + 1)}/${startTime.getDay()} - ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}.${startTime.getMilliseconds()}`;

  // startLog
  startTable.Web_Requests_Logs = startLog(app);

  // Serve static files
  app.use(express.static(path.join(__dirname, '/public')));

  // Set view engine to ejs and use routes
  app.use('/', routes);
  app.set('view engine', 'ejs');

  // Start the server
  app.listen(port, hostname, () => {
    console.log(`MPC Lab web-server is running on host ${hostname}, port ${port}`, ` | ${hostname}:${port}`);
    if (config.openTestPage) openTestPage(`http://${hostname}:${port}`);
  });

  console.table(startTable);

  // Close database connections when the application exits
  process.on('exit', () => {
    Auth.close();
    User.close();
    console.log('Closing database connection.');
  });

  // Handle application termination with Ctrl+C
  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });  
}

// Function to open a test page in the default browser
function openTestPage(url) {
  var c = require('child_process');
  c.exec(`start ${url}`);
}

// Function to delay server start
function preStart() {
  var timesRun = 0;
  var interval = setInterval(function () {
    timesRun += 1;
    console.log("Server start in " + (config.startDelay - timesRun) + "...");
    if (timesRun === config.startDelay) {
      clearInterval(interval);
      startServer();
    }
  }, 1000);
}

// Call the preStart function to start the server
preStart();