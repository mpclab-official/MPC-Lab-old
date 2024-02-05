// join_classroom.js
// This is a router file that contains the code for the join classroom page.

const {
  router,
  path,
  config,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
  Classroom,
} = require("./common.js");

router.get("/:language/class/join", checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) {
      res.redirect(`/${languages_list[0]}`);
      return;
    }
    const languages_translate_pack = languages_translate[language_index];
    const navigation_translate_pack = language_navigation[language_index];
    res.render(path.join(config.path, "page", "join-classroom"), {
      title: `${config.name} | ${languages_translate_pack.lan_join_classroom}`,
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

router.post("/:language/class/join", (req, res) => {
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
    Classroom.joinClassroom(
      req.body.classCode,
      req.session.userID,
      "student",
      false
    )
      .then((class_name_formal) => {
        res.json({
          message:
            languages_translate_pack.lan_join_classroom_classroom_code_successfully,
          class_name_formal,
        });
      })
      .catch((err) => {
        if (err == "classroom_inactive") {
          res.json({
            message:
              languages_translate_pack.lan_join_classroom_classroom_code_classroom_inactive,
          });
          return;
        } else if (err == "classroom_not_exist") {
          res.json({
            message:
              languages_translate_pack.lan_join_classroom_classroom_code_classroom_not_exists,
          });
          return;
        } else if (err == "already_joined") {
          res.json({
            message:
              languages_translate_pack.lan_join_classroom_classroom_code_already_joined,
          });
          return;
        }
      });
  }
});

module.exports = router;
