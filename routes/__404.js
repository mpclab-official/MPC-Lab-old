// __404.js
// A router file that contains the code for the 404 page.

const { router, config, path, getUserData } = require("./common.js");

router.route("*").get((req, res) => {
  getUserData(req.session.userID, (err, data) => {
    if (data) userData = data;
    else userData = { colorTheme: "light" };
    res.status(404).render(path.join(config.path, "page", "404"), {
      title: `${config.name} | 404`,
      favicon: config.favicon,
      logo: config.logo,
      logo_s: config.logo_s,
      pageStyle: {
        colorTheme: userData.colorTheme,
      },
    });
  });
});

module.exports = router;
