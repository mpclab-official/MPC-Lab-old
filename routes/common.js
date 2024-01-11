const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const config = require(`../config.js`);
const User = require(`${config.db.user}/user.js`);

const Big = require('big.js');

const languages = [];
const languages_list = [];
const languages_translate = [];
const language_navigation = [];

// Load language modules and populate language arrays
for (let i = 0; i < config.languages.length; i++) {
    languages[i] = require(`${config.path}/languages/${config.languages[i][0]}.js`);
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
    } else if (req.url === `/${req.params.language}/blog/post`) {
        if (!req.session.userID) {
            res.redirect(`/${req.params.language}/login`);
        } else {
            next();
        }
    }
    else {
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

// Authentication
const Auth = require(`${config.db.auth}/auth.js`);

const emailVerification = require('../mail/emailVerification.js');

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

module.exports = {
    express,
    http,
    url,
    fs,
    router,
    path,
    config,
    User,
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
};
