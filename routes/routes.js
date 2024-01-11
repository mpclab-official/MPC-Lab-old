const {
  router,
} = require('./common.js');

const routes = [
  '__favicon',
  '__home_no_languages',
  '__home',
  '__tools',
  '__blog',
  '__login',
  '__register',
  '__verification_code',
  '__forget_password',
  '__user_setup',
  '__blog_post',
  '__post',
];

for (let i = 0; i < routes.length; i++) {
  const route = require(`./${routes[i]}.js`);
  router.use(`/${routes[i]}`, route);
}

// tools
router.use(`/`, require("../tools/routes.js"));

module.exports = router;