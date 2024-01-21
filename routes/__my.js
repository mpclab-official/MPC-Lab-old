// __my.js
// This is a router file that contains the code for the user page.

const {
  router,
  path,
  config,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
  Auth,
} = require("./common.js");

router.route("/:language/my").get(checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    if (data) userData = data;
    else userData = { colorTheme: "light" };
    Auth.getUserById(data.UID, (err, data) => {
      userData.email = data.email;
      userData.username = data.username;
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) {
        res.redirect(`/${languages_list[0]}`);
        return;
      }
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(config.path, "page", "my"), {
        title: `${config.name} | ${userData.userName}`,
        language_code: req.params.language,
        favicon: config.favicon,
        logo: config.logo,
        logo_s: config.logo_s,
        background_image: config.background_image,
        navigation_translate_pack,
        ...languages_translate_pack,
        pageStyle: {
          colorTheme: userData.colorTheme,
        },
        userData,
      });
    });
  });
});

module.exports = router;
