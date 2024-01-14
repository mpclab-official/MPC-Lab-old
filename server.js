// server.js
// This is the main file of the server.

// Load config file
const config = require(`${__dirname}/config.js`);

// Import required modules
const express = require("express"); // call express
const session = require("express-session"); // call express-session
const path = require("path"); // call path
const bodyParser = require("body-parser"); // call body-parser

// Load routes
const routes = require("./routes/routes.js"); // call routes.js

// Load database modules
const Auth = require(`./auth.js`);
const User = require(`./user.js`);
const Articles = require(`./articles.js`);

// Create express application
const app = express();
const port = config.port;

// Get hostname
let hostname;
if (config.hostname == "auto") {
  const os = require("os");

  function getIpAddress() {
    let ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
      let iface = ifaces[dev];
      for (let i = 0; i < iface.length; i++) {
        let { family, address, internal } = iface[i];
        if (family === "IPv4" && address !== "127.0.0.1" && !internal) {
          if (address) {
            return address;
          }
        } else if (address === "127.0.0.1") return "127.0.0.1";
      }
    }
  }
  hostname = getIpAddress();
} else hostname = config.hostname;

// Server class
class Server {
  static start() {
    // Use middlewares

    // Configure session middleware
    app.use(
      session({
        ...config.session,
      })
    );

    // Use body-parser middleware
    app.use(
      bodyParser.json({
        limit: "10mb",
      })
    );
    app.use(
      bodyParser.urlencoded({
        limit: "10mb",
        extended: true,
      })
    );

    // startLog
    const webRequestsLog = require("./log/webRequestsLog.js");

    // Web requests logger
    webRequestsLog(app);

    // Serve static files
    app.use(express.static(path.join(__dirname, "public")));

    // Set view engine to ejs and use routes
    app.use("/", routes);
    app.set("view engine", "ejs");

    // Start the server
    app.listen(port, hostname, () => {
      console.log(
        `MPC Lab web-server is running on host ${hostname}, port ${port}`,
        ` | ${hostname}:${port}`
      );
      if (config.openTestPage) openTestPage(`http://${hostname}:${port}`);
    });

    // Process

    // Close database connections when the application exits
    process.on("exit", () => {
      console.log("Closing database connection...");
      console.log(`Auth database closed: ${Auth.close()}`);
      console.log(`User database closed: ${User.close()}`);
      console.log(`Articles database closed: ${Articles.close()}`);
      console.log("Database connection closed!");
      console.log("MPC Lab web-server is closed!");
      console.log("Goodbye!");
    });

    // Handle application termination with Ctrl+C
    process.on("SIGINT", () => {
      process.exit();
    });

    // Error handling
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });

    // Promise rejection handling
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });
  }

  static stop() {
    // Stop the server
    app.close(() => {
      console.log("Server stopped");
    });
  }
}

// Function to open a test page in the default browser
function openTestPage(url) {
  var c = require("child_process");
  c.exec(`start ${url}`);
}

// Start the server
Server.start();
