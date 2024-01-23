// config.js
// This is the configuration file for the MPC Lab server.

const config = {
  // Project name
  name: "MPC Lab",

  // Url
  url: "https://mathscichem.com",

  // Path to favicon
  favicon: "/favicon.ico",

  // Path to main logo
  logo: "/assets/svg/-logo-light.svg",

  // Path to small version of the logo
  logo_s: "/assets/svg/-logo-light-s.svg",

  // Path to background image
  background_image: "/assets/img/background.svg",

  // Absolute path to the project directory
  path: __dirname,

  // Project version
  version: "2.2.7-dev",

  // Hostname configuration (auto to automatically detect)
  hostname: "auto",

  // Port to run the application on
  port: 80,

  // Flag to open the test page during startup
  openTestPage: true,

  // Flag to enable HTTPS
  https: false,

  // Certificate
  certificate: {
    // Path to private key
    key: `${__dirname}/certificate/private-key.pem`,

    // Path to certificate
    cert: `${__dirname}/certificate/certificate.pem`,
  },

  // Supported languages with their code and display name
  languages: [
    ["en", "English"],
    ["zh", "简体中文"],
    ["es", "Español"],
  ],

  // Logging configuration
  log: {
    // Path to log files directory
    path: `${__dirname}/logs`,

    // Web requests logging configuration
    webRequestsLog: {
      logging: true,
      typ: "combined" /* combined common dev short tiny */,
      // interval: "1d",
      onlyError: true,
      maxFiles: 0,
      encoding: "utf-8",
      folderName: "webRequestsLogs",
      fileName: "errorRequests.log",
    },

    // Server start logging configuration
    serverStartLog: {
      logging: true,
      folderName: "serverStartLogs",
      fileName: "serverStart.log",
    },
  },

  // Database file paths
  db: {
    auth: `${__dirname}/db/auth.db`,
    user: `${__dirname}/db/user.db`,
    articles: `${__dirname}/db/articles.db`,
  },

  // Session configuration
  session: {
    secret: "test-secret-key",
    resave: false,
    saveUninitialized: true,

    // Cookie configuration
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: false, // Set to true if using HTTPS
    },
  },

  // SendGrid API key for email functionality
  sendgridApiKey: "", // Add your SendGrid API key here
};

module.exports = config;
