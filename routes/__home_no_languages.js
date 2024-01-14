// __home_no_languages.js
// This is a router file that contains the code for the home page without languages.

const { router, languages_list } = require("./common.js");

router.get("/", (req, res) => {
  res.redirect(`/${languages_list[0]}`);
});

module.exports = router;
