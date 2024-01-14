// Load config file
const config = require(`../config.js`);

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

fs.readFile(
  path.join(config.path, "tools", "tools.json"),
  "utf8",
  (err, data) => {
    if (data) {
      tools = JSON.parse(data);
      for (let i = 0; i < tools.length; i++) {
        const route = require(`./${tools[i].url}/${tools[i].url}.js`);
        router.use(`/${tools[i].url}`, route);
      }
    }
  }
);

module.exports = router;
