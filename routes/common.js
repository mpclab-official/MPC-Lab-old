// common.js
// common.js is a file that contains common code for all routes.

// Load config file
const config = require(`../config.js`);

// Import required modules
const express = require("express");
const router = express.Router();

// Load http module
const http = require("http");

// Load url module
const url = require("url");

// Load fs module
const fs = require("fs");

// Load path module
const path = require("path");

// Load database modules
const Auth = require(path.join(config.path, "auth.js"));

// Load user module
const User = require(path.join(config.path, "user.js"));

// Load articles module
const Articles = require(path.join(config.path, "articles.js"));

// Load classroom module
const Classroom = require(path.join(config.path, "classroom.js"));

// Load enterprise module
const Enterprise = require(path.join(config.path, "enterprise.js"));

// Load email verification module
const emailVerification = require(path.join(
  config.path,
  "mail",
  "emailVerification.js"
));

// Load Big module
const Big = require("big.js");

// Load language modules
const languages = [];
const languages_list = [];
const languages_translate = [];
const language_navigation = [];

// Load language modules and populate language arrays
for (let i = 0; i < config.languages.length; i++) {
  languages[
    i
  ] = require(`${config.path}/languages/${config.languages[i][0]}.js`);
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
  } else if (req.url != `/${req.params.language}/user-setup`) {
    if (req.session.userID) {
      User.readUserData(req.session.userID, (err, data) => {
        if (data) {
          next();
        } else {
          res.redirect(`/${req.params.language}/user-setup`);
        }
      });
    } else {
      if (
        req.url === `/${req.params.language}/blog/post` ||
        req.url === `/${req.params.language}/my` ||
        req.url === `/${req.params.language}/my/edit` ||
        req.url === `/${req.params.language}/dashboard` ||
        req.url === `/${req.params.language}/logout` ||
        req.url === `/${req.params.language}/enterprise/create` ||
        req.url === `/${req.params.language}/class/create` ||
        req.url === `/${req.params.language}/enterprise/join` ||
        req.url === `/${req.params.language}/class/join` ||
        req.url === `/${req.params.language}/class/${req.params.classID}` ||
        req.url ===
          `/${req.params.language}/enterprise/${req.params.enterpriseID}`
      ) {
        if (!req.session.userID) {
          res.redirect(`/${req.params.language}/login?targeturl=${req.url}`);
        } else {
          next();
        }
      } else {
        next();
      }
    }
  }
};

// Middleware: Check if verification code has expired
const checkVerificationCodeExpiration = (req, res, next) => {
  const now = Date.now();
  if (
    req.session.verificationCodeExpiration &&
    req.session.verificationCodeExpiration < now
  ) {
    // Verification code has expired, clear related information from the session
    req.session.verificationCode = null;
    req.session.verificationCodeExpiration = null;
  }
  next();
};

// Get user data from database by userID
function getUserData(userID, callback) {
  User.readUserData(userID, (err, data) => {
    if (data) {
      callback(null, data);
    } else {
      callback(err, null);
    }
  });
}

module.exports = {
  express,
  http,
  url,
  fs,
  router,
  path,
  config,
  User,
  Articles,
  languages,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
  Auth,
  emailVerification,
  checkVerificationCodeExpiration,
  Big,
  Classroom,
  Enterprise,
};
