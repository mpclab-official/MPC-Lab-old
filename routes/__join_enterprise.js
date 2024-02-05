// __join_enterprise.js
// This is a router file that contains the code for the join enterprise page.

const {
  router,
  path,
  config,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
  Enterprise,
} = require("./common.js");

router.get("/:language/enterprise/join", checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) {
      res.redirect(`/${languages_list[0]}`);
      return;
    }
    const languages_translate_pack = languages_translate[language_index];
    const navigation_translate_pack = language_navigation[language_index];
    res.render(path.join(config.path, "page", "join-enterprise"), {
      title: `${config.name} | ${languages_translate_pack.lan_join_enterprise}`,
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

router.post("/:language/enterprise/join", (req, res) => {
  const language_index = languages_list.indexOf(req.params.language);
  if (language_index == -1) {
    res.redirect(`/${languages_list[0]}`);
    return;
  }
  const languages_translate_pack = languages_translate[language_index];
  if (!req.session.userID) {
    res.status(403).send("You are not logged in.");
    return;
  } else {
    Enterprise.joinEnterprise(
      req.body.enterpriseCode,
      req.session.userID,
      "member",
      false
    )
      .then((enterprise_name_formal) => {
        res.json({
          message:
            languages_translate_pack.lan_join_enterprise_enterprise_code_successfully,
          enterprise_name_formal,
        });
      })
      .catch((err) => {
        if (err == "enterprise_inactive") {
          res.json({
            message:
              languages_translate_pack.lan_join_enterprise_enterprise_code_enterprise_inactive,
          });
          return;
        } else if (err == "enterprise_not_exist") {
          res.json({
            message:
              languages_translate_pack.lan_join_enterprise_enterprise_code_enterprise_not_exists,
          });
          return;
        } else if (err == "already_joined") {
          res.json({
            message:
              languages_translate_pack.lan_join_enterprise_enterprise_code_already_joined,
          });
          return;
        }
      });
  }
});

module.exports = router;
