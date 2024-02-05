// __classroom.js
// This is a router file that contains the code for the classroom page.

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

router.get("/:language/class/:classID", checkPageRedirect, (req, res) => {
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
    Classroom.getClassroomById(req.params.classID).then((classroom) => {
      if (!classroom) {
        res.status(404).redirect(`/${req.params.language}/404`);
        return;
      }
      res.render(path.join(config.path, "page", "classroom"), {
        title: `${config.name} | ${classroom.name}`,
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
        classroom,
      });
    });
  });
});

module.exports = router;
