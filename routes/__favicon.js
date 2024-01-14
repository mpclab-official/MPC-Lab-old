// __favicon.js
// This is a router file that contains the code for the favicon.

const { fs, router } = require("./common.js");

router.get("/favicon.ico", (req, res) => {
  res.writeHead(200, { "Content-Type": "image/x-icon" });
  res.end(fs.readFileSync("./favicon.ico"), "binary");
});

module.exports = router;
