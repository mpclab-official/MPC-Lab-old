// routes.js
// This is a router file that contains the code to load all the other router files.

const { router } = require("./common.js");

const routes = [
  "__favicon",
  "__home_no_languages",
  "__home",
  "__tools",
  "__blog",
  "__login",
  "__register",
  "__verification_code",
  "__forget_password",
  "__user_setup",
  "__blog_post",
  "__post",
  "__sitemaps",
  "__user_daily_check_in",
  "__user",
  "__my",
  "__my_edit",
  "__article_side_bar",
  "__class",
  "__enterprises",
  "__dashboard",
  "__logout",
  "__create_classroom",
  "__create_enterprise",
  "__join_classroom",
  "__join_enterprise",
  "__classroom",
  "__enterprise",
  "__follow_unfollow",
];

for (let i = 0; i < routes.length; i++) {
  const route = require(`./${routes[i]}.js`);
  router.use(`/${routes[i]}`, route);
}

// tools
router.use(`/`, require("../tools/routes.js"));

// 404 page
router.use(`*`, require(`./__404.js`));

module.exports = router;
