const express = require("express");
const router = express.Router();
const tools = require("./tools.js");

for (let i = 0; i < tools.length; i++) {
  const route = require(`./${tools[i].url}/${tools[i].url}.js`);
  router.use(`/${tools[i].url}`, route);
}

module.exports = router;
