const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const config = require('./config.js');
const User = require(`${config.db.user}/user.js`);

const languages = [];
const languages_list = [];
const languages_translate = [];
const language_navigation = [];

// Load language modules and populate language arrays
for (let i = 0; i < config.languages.length; i++) {
  languages[i] = require(`./languages/${config.languages[i][0]}.js`);
  languages_list[i] = config.languages[i][0];
  languages_translate[i] = languages[i].translate;
  language_navigation[i] = languages[i].navigation;
}

// Middleware: Check redirect
const checkPageRedirect = (req, res, next) => {
  if (
    req.url === `/${req.params.language}/login` ||
    req.url === `/${req.params.language}/register` ||
    req.url === `/${req.params.language}/forget-password`
  ) {
    User.readUserData(req.session.userID, (err, data) => {
      if (req.session.userID && data) {
        res.redirect(`/${req.params.language}`);
      } else if (req.session.userID && !data) {
        res.redirect(`/${req.params.language}/user-setup`);
      } else {
        next();
      }
    });
  } else if (req.url === `/${req.params.language}/user-setup`) {
    User.readUserData(req.session.userID, (err, data) => {
      if (!req.session.userID || data) {
        res.redirect(`/${req.params.language}`);
      } else {
        next();
      }
    });
  } else {
    next();
  }
};

// get user data from database by userID
function getUserData(userID, callback) {
  User.readUserData(userID, (err, data) => {
    if (data) {
      callback(null, data);
    } else {
      callback(err, null);
    }
  });
}

// Favicon.ico
router.get('/favicon.ico', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/x-icon' });
  res.end(fs.readFileSync('./favicon.ico'), 'binary');
});

// HOME - No languages
router.get('/', (req, res) => {
  res.redirect(`/${languages_list[0]}`);
});

// HOME
router.get('/:language', checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    console.log(data);
    if (data) userData = data;
    else userData = { colorTheme: "light" };
    console.log(userData);
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) res.redirect(`/${languages_list[0]}`);
    const languages_translate_pack = languages_translate[language_index];
    const navigation_translate_pack = language_navigation[language_index];
    res.render(path.join(__dirname, 'page', 'home'), {
      title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
        colorTheme: userData.colorTheme,
      }, userData
    });
  });
});

const Auth = require(`${config.db.auth}/auth.js`);
const emailVerification = require('./mail/emailVerification.js');

// Middleware: Check if verification code has expired
const checkVerificationCodeExpiration = (req, res, next) => {
  const now = Date.now();
  if (req.session.verificationCodeExpiration && req.session.verificationCodeExpiration < now) {
    // Verification code has expired, clear related information from the session
    req.session.verificationCode = null;
    req.session.verificationCodeExpiration = null;
  }
  next();
};

// Login
router.route('/:language/login')
  .get(checkPageRedirect, (req, res) => {
    getUserData(req.session.userID, (err, data) => {
      if (data) userData = data;
      else userData = { colorTheme: "light" };
      console.log(userData);
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) res.redirect(`/${languages_list[0]}`);
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(__dirname, 'page', 'login'), {
        title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
          colorTheme: userData.colorTheme,
        }, userData
      });
    });
  })
  .post((req, res) => {
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) res.redirect(`/${languages_list[0]}`);
    const languages_translate_pack = languages_translate[language_index];
    const messages = [
      languages_translate_pack.lan_auth_login_code0,
      languages_translate_pack.lan_auth_login_code1,
      languages_translate_pack.lan_auth_login_code2
    ];
    const params = req.body; // Use req.body to get POST request data
    Auth.login(params.username, params.password, (code, user) => {
      if (code) {
        if (code == 0) {
          req.session.userID = user.id;
        }
        res.status(200).json({ code, messages });
      }
    });
  });

// Register
router.route('/:language/register')
  .get(checkPageRedirect, (req, res) => {
    getUserData(req.session.userID, (err, data) => {
      if (data) userData = data;
      else userData = { colorTheme: "light" };
      console.log(userData);
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) res.redirect(`/${languages_list[0]}`);
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(__dirname, 'page', 'register'), {
        title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
          colorTheme: userData.colorTheme
        }, userData
      });
    });
  })
  .post(checkVerificationCodeExpiration, (req, res) => {
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) res.redirect(`/${languages_list[0]}`);
    const languages_translate_pack = languages_translate[language_index];
    const messages = [
      languages_translate_pack.lan_auth_register_code0,
      languages_translate_pack.lan_auth_register_code1,
      languages_translate_pack.lan_auth_register_code2,
      languages_translate_pack.lan_auth_register_code3,
      languages_translate_pack.lan_auth_register_code4,
      languages_translate_pack.lan_auth_register_code5,
      languages_translate_pack.lan_auth_register_code6,
      languages_translate_pack.lan_auth_register_code7,
      languages_translate_pack.lan_auth_register_code8,
      languages_translate_pack.lan_auth_register_code9
    ];

    const params = req.body; // Use req.body to get POST request data
    if (req.session.verificationCode && req.session.verificationEmail == params.email) {
      if (params.verification_code) {
        if (req.session.verificationCode == params.verification_code) {
          Auth.register(params.username, params.email, params.password, (code, id) => {
            if (code) {
              if (code == 0) {
                req.session.userID = id;

                req.session.verificationCode = null;
                req.session.verificationCodeExpiration = null;
              }
              res.status(200).json({ code, messages });
            }
          });
        } else {
          let code = [9]; // Incorrect verification code
          res.status(200).json({ code, messages });
        }
      } else {
        let code = [8]; // Verification code not entered
        res.status(200).json({ code, messages });
      }
    } else {
      let code = [7]; // Verification code not obtained or expired
      res.status(200).json({ code, messages });

      req.session.verificationCode = null;
      req.session.verificationCodeExpiration = null;
    }
  });

// Verification code
router.post('/:language/verification', (req, res) => {
  const language_index = languages_list.indexOf(req.params.language);
  if (language_index == -1) res.redirect(`/${languages_list[0]}`);
  const languages_translate_pack = languages_translate[language_index];
  const messages = [
    languages_translate_pack.lan_auth_register_verification0,
    languages_translate_pack.lan_auth_register_verification1
  ];

  const params = req.body; // Use req.body to get POST request data
  const email = params.email;

  emailVerification.sendVerificationEmail(email, languages_translate_pack.lan_get_verification_email_title, languages_translate_pack.lan_get_verification_email_text, (error, verificationCode) => {
    if (error) {
      res.status(200).json({ code: [1], messages });
    } else {
      req.session.verificationCode = verificationCode;
      req.session.verificationEmail = email;
      req.session.verificationCodeExpiration = Date.now() + 10 * 60 * 1000; // Set verification code expiration to 10 minutes

      res.status(200).json({ code: [0], messages });
    }
  });
});

// Forget Password
router.route('/:language/forget-password')
  .get(checkPageRedirect, (req, res) => {
    getUserData(req.session.userID, (err, data) => {
      if (data) userData = data;
      else userData = { colorTheme: "light" };
      console.log(userData);
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) res.redirect(`/${languages_list[0]}`);
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(__dirname, 'page', 'forget-password'), {
        title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
          colorTheme: userData.colorTheme
        }, userData
      });
    });
  })
  .post(checkVerificationCodeExpiration, (req, res) => {
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) res.redirect(`/${languages_list[0]}`);
    const languages_translate_pack = languages_translate[language_index];
    const messages = [
      languages_translate_pack.lan_auth_forget_password_code0,
      languages_translate_pack.lan_auth_forget_password_code1,
      languages_translate_pack.lan_auth_forget_password_code2,
      languages_translate_pack.lan_auth_forget_password_code3,
      languages_translate_pack.lan_auth_forget_password_code4,
      languages_translate_pack.lan_auth_forget_password_code5,
      languages_translate_pack.lan_auth_forget_password_code6
    ];

    const params = req.body; // Use req.body to get POST request data
    if (req.session.verificationCode && req.session.verificationEmail == params.email) {
      if (params.verification_code) {
        if (req.session.verificationCode == params.verification_code) {
          Auth.resetPassword(params.email, params.password, (code) => {
            if (code) {
              if (code == 0) {
                req.session.verificationCode = null;
                req.session.verificationCodeExpiration = null;
              }
              res.status(200).json({ code, messages });
            }
          });
        } else {
          let code = [6]; // Incorrect verification code
          res.status(200).json({ code, messages });
        }
      } else {
        let code = [5]; // Verification code not entered
        res.status(200).json({ code, messages });
      }
    } else {
      let code = [4]; // Verification code not obtained or expired
      res.status(200).json({ code, messages });

      req.session.verificationCode = null;
      req.session.verificationCodeExpiration = null;
    }
  });

// User Setup
router.route('/:language/user-setup')
  .get(checkPageRedirect, (req, res) => {
    getUserData(req.session.userID, (err, data) => {
      if (data) userData = data;
      else userData = { colorTheme: "light" };
      console.log(userData);
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) res.redirect(`/${languages_list[0]}`);
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(__dirname, 'page', 'user-setup'), {
        title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
          colorTheme: userData.colorTheme
        }, userData
      });
    });
  })
  .post((req, res) => {
    const params = req.body; // Use req.body to get POST request data
    if (params.UserData) {
      let UserData = params.UserData;
      UserData.colorTheme = "light";
      User.updateUserData(req.session.userID, UserData, (err) => {
        if (err) {
          res.status(500).json({ code: [-1], err });
        } else {
          getUserData(req.session.userID, (err, data) => {
            res.status(200).json({ code: [0], userData: data });
          });
        }
      });
    } else {
      res.status(400).json({ code: [1] });
    }
  });

// my
router.get('/:language/my', (req, res) => {
  // TODO: Implement logic for '/:language/my' route
});

module.exports = router;