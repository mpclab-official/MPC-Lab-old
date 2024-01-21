// __user.js
// router file for the user page

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

router.route("/:language/user/:id").get(checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    if (data) userData = data;
    else userData = { colorTheme: "light" };
    getUserData(req.params.id, (err, data) => {
      if (data) targetData = data;
      else {
        res.status(404).send("User not found");
        return;
      }
      Auth.getUserById(data.UID, (err, data) => {
        targetData.email = data.email;
        targetData.username = data.username;
        const language_index = languages_list.indexOf(req.params.language);
        if (language_index == -1) {
          res.redirect(`/${languages_list[0]}`);
          return;
        }
        const languages_translate_pack = languages_translate[language_index];
        const navigation_translate_pack = language_navigation[language_index];
        res.render(path.join(config.path, "page", "user"), {
          title: `${config.name} | ${targetData.userName}`,
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
          targetData,
        });
      });
    });
  });
});

module.exports = router;
