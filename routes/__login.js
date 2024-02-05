// __login.js
// This is a router file that contains the code for the login page.

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

router
  .route("/:language/login")
  .get(checkPageRedirect, (req, res) => {
    getUserData(req.session.userID, (err, data) => {
      if (data) userData = data;
      else userData = { colorTheme: "light" };
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) {
        res.redirect(`/${languages_list[0]}`);
        return;
      }
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(config.path, "page", "login"), {
        title: `${config.name} | ${languages_translate_pack.lan_login}`,
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
  })
  .post((req, res) => {
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) {
      res.redirect(`/${languages_list[0]}`);
      return;
    }
    const languages_translate_pack = languages_translate[language_index];
    const messages = [
      languages_translate_pack.lan_auth_login_code0,
      languages_translate_pack.lan_auth_login_code1,
      languages_translate_pack.lan_auth_login_code2,
    ];
    const params = req.body; // Use req.body to get POST request data
    Auth.login(params.username, params.password, (code, user) => {
      if (code) {
        if (code == 0) {
          req.session.userID = user.id;
          req.session.hash = user.hash;
          req.session.hash_created_at = Date.now();
        }
        res.status(200).json({ code, messages });
      }
    });
  });

module.exports = router;
