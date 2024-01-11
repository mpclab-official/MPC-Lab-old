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

### Auth Management Module

Start the Auth management module and connect to the Auth database.

```shell
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
  - articles - Location of the articles database
- session - Session configuration
  - secret - Session secret key
- sendgridApiKey - sendgridApiKey for Email API

## Versions

### [V2.2.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.2.0-dev)

- Added blog + article functionality

  - Supports rich text editing
  - Supports custom cover image
  - Supports adding keywords

- Added user interest modeling algorithm

Contributors:

- [Tony Kan](#tony-kan)

### [V2.1.0-dev](https://github.com/mpclab-official/MPC-Lab/releases/tag/v2.1.0-dev)

- Added tool functionality

- Added tools:

  - Two Variable Linear Equation Calculator

- Added user avatar functionality

- Added error reminder when filling in basic information after user login.

- Added articles database

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
