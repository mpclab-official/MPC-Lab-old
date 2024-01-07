# MPC Lab Development Documentation

This is the development documentation for MPC Lab, including user guides, versions, configurations, and other information...

## Developers

- Tony Kan

  - [GitHub](https://github.com/tonyblog)

- Devin Liang
  - [GitHub](https://github.com/244196806qq)

## Usage

### Installation

1. Install Node.js development environment.

2. Clone this repository using GIT or download it directly.

```
git clone https://github.com/mpclab-official/MPC-Lab.git

cd ./MPC-Lab

npm install
```

### Start the server

Start the server and connect to the database.

```
node server
```

Stop the connection to the server and database with `^C`.

PS: Forever is required in a production environment to ensure durable operation.

### Auth Management Module

Start the Auth management module and connect to the Auth database.

```
node auth
```

Stop the connection to the Auth module and Auth database with `^C`.

## Configuration

The configuration information is located in the `config.js` configuration file.

- name - The name of the project
- favicon - Website favicon
- logo - Website logo
- logo_s - Website small logo
- background_image - Website background image
- version - Version number
- hostname - Server IP
- port - Port number
- startDelay - Startup delay
- openTestPage - Open the test page in the default browser
- languages - Language configuration, please add language packs in the `languages` folder of the project
- log - Server log configuration
  - requestsLog - Client request log
    - logging - Whether to log client requests
    - typ - Log type
    - onlyError - Only log error requests (4**, 5**)
    - maxFiles - Maximum number of rotating files
    - encoding - Encoding format
    - folderName - Log folder name
    - fileName - Main log file name
- db - Database configuration
  - auth - Location of the auth database
  - user - Location of the user database
- session - Session configuration
  - secret - Session secret key

## Versions

### V2.1.0-dev

- Added tool functionality

- Added tools:

  - Two Variable Linear Equation Calculator

- Added user avatar functionality

- Added error reminder when filling in basic information after user login.

- Added articles database

### V2.0.0-dev

- The first version of MPC Lab's second generation, still under development.

- Refactored the project using Node.js and Express.js to implement the basic frontend and backend framework.

- Supports user login, registration, password reset, and email verification code sending.

- Basic page layout and styling framework.

### V1.0.0-dev

- The initial development/testing version of MPC Lab, still under development.

- Built-in rich mathematical and scientific calculation and learning tools.

- Built-in hundreds of mathematical and scientific question generators with thousands of parameters.

- Supports student and teacher account registration, classroom creation, exam and assignment assignments, etc.

- Includes a celestial physics simulator using Unity.

## Acknowledgements

We extend our sincere gratitude to the following open-source projects and communities for their invaluable contributions to the enhancement of mathematical expression rendering on our website:

- KaTeX: We appreciate the exceptional solution provided by the KaTeX team for rendering mathematical expressions. The open-source contributions of KaTeX have empowered us to present clear and aesthetically pleasing mathematical notations on our website.
