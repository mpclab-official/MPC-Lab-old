<img src="https://mathscichem.com/assets/svg/-logo-light.svg" style="max-hight='200px'">

# MPC Lab Development Documentation

This is the development documentation for MPC Lab, including user guides, versions, configurations, and other information...

## Developers

### Tony Kan

- [GitHub](https://github.com/tkanx)

### Devin Liang

- [GitHub](https://github.com/244196806qq)

## Usage

### Installation

1. Install Node.js development environment.

2. Clone this repository using GIT or download it directly.

```shell
git clone https://github.com/mpclab-official/MPC-Lab.git

cd ./MPC-Lab

npm install
```

### Start the server

Start the server and connect to the database.

```shell
node server
```

Stop the connection to the server and database with `^C`.

PS: Forever is required in a production environment to ensure durable operation.

```shell
forever start server.js

disown
```

## Configuration

```javascript
const config = {
  // Project name
  name: "MPC Lab",

  // Url
  url: "https://mathscichem.com/",

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
  version: "2.3.1-dev",

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
    key: `${__dirname}/certificate/mathscichem.com.key`,

    // Path to certificate
    cert: `${__dirname}/certificate/mathscichem.com_bundle.pem`,
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
    path: `${__dirname}/log/logs`,

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
    enterprise: `${__dirname}/db/enterprise.db`,
    classroom: `${__dirname}/db/classroom.db`,
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
```

Please set the `robots.txt` file at `/public/robots.txt`.

The configuration information is located in the `config.js` configuration file.

## Site Maps

- Main page sitemap: `/sitemaps/navigation`

- Toolbox sitemap: `/sitemaps/toolbox`

- Articles sitemap: `/sitemaps/articles`

## Versions

### [V2.3.1-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.3.1-dev)

- Add functionality for users to view their liked articles.

- Add functionality for users to view their stars articles.

- Fix the issue where some content of articles was not displaying.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.3.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.3.0-dev)

- Add enterprise functionality (demo/basic).

- Add classroom functionality (demo/basic).

- Hash comparison between session and Auth modules.

- Optimize loading animation.

- Add user dashboard.

- Add `robots.txt`.

- Create a new 404 processing route.

- Fixed article sitemap rendering bug.

- Optimize page loading speed by locally loading KaTeX instead of using CDN.

- Fixed the issue where `Personal Information > Date of Birth` cannot be modified.

- Added redirection to the login page when not logged in, and automatic redirection back to the target page after logging in.

- Optimize the automatic hiding of the sign-in bar after daily check-in.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.7-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.7-dev)

- Add support for https.

- Add loading animation.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.6-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.6-dev)

- Add article likes, collections, forwarding, and coin-voting functions.

- Fixed vulnerabilities related to the format, size, and compliance of article covers during publishing.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.5-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.5-dev)

- Display and modification of user information.

- Fixed some security vulnerabilities.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.4-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.4-dev)

- Add the function of daily check-in for users to obtain coins.

- Add error/success notification.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.3-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.3-dev)

- Fixed the issue of incorrect redirection when modifying language requests.

- Improved SEO:
  - Added site map
  - Page titles

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.2-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.2-dev)

- Organize project structure.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.1-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.1-dev)

- Fixed the issue with incorrect display and navigation of articles on the homepage.

- Modify the logic of pageviews to increase by up to 1 per session.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.2.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.0-dev)

- Added blog + article functionality.

  - Supports rich text editing.
  - Supports custom cover image.
  - Supports adding keywords.

- Added user interest modeling algorithm.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.1.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.1.0-dev)

- Added tool functionality.

- Added tools:

  - Two Variable Linear Equation Calculator.

- Added user avatar functionality.

- Added error reminder when filling in basic information after user login.

- Added articles database.

Contributors:

- [Tony Kan](#tony-kan)

### [V2.0.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.0.0-dev)

- The first version of MPC Lab's second generation, still under development.

- Refactored the project using Node.js and Express.js to implement the basic frontend and backend framework.

- Supports user login, registration, password reset, and email verification code sending.

- Basic page layout and styling framework.

Contributors:

- [Tony Kan](#tony-kan)

### [V1.0.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v1.0.0)

- The initial development/testing version of MPC Lab, still under development.

- Built-in rich mathematical and scientific calculation and learning tools.

- Built-in hundreds of mathematical and scientific question generators with thousands of parameters.

- Supports student and teacher account registration, classroom creation, exam and assignment assignments, etc.

- Includes a celestial physics simulator using Unity.

Contributors:

- [Tony Kan](#tony-kan)
- [Devin Liang](#devin-liang)

## Acknowledgements

We extend our sincere gratitude to the following open-source projects and communities for their invaluable contributions to the enhancement of mathematical expression rendering on our website:

![Quill](https://img.shields.io/badge/Quill-52B0E7?style=for-the-badge&logo=apache&logoColor=white)
![Khan Academy](https://img.shields.io/badge/KhanAcademy-%2314BF96.svg?style=for-the-badge&logo=KhanAcademy&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

- KaTeX: Grateful for the KaTeX team's exceptional solution in rendering mathematical expressions, enhancing our website with clear and aesthetically pleasing notations.

- Quill: Appreciation to the Quill project and its community for contributing the WYSIWYG editor, which plays a pivotal role in ensuring a seamless and user-friendly content creation experience on our platform.

- SQLite: Thanks to SQLite for providing a reliable and efficient database module, enhancing data management capabilities on our website.
