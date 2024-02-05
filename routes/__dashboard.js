// __dashboard.js
// This is a router file that contains the code for the dashboard page.

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
  Classroom,
  Enterprise,
} = require("./common.js");

router.get("/:language/dashboard", checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    Auth.getUserById(data.UID, (err, auth_data) => {
      userData.email = auth_data.email;
      userData.username = auth_data.username;
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) {
        res.redirect(`/${languages_list[0]}`);
        return;
      }
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      Classroom.getClassroomsByUserId(req.session.userID).then((classrooms) => {
        userData.classrooms = classrooms;
        Enterprise.getEnterprisesByUserId(req.session.userID).then(
          (enterprises) => {
            userData.enterprises = enterprises;
            res.render(path.join(config.path, "page", "dashboard"), {
              title: `${config.name} | ${languages_translate_pack.lan_dashboard}`,
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
          }
        );
      });
    });
  });
});

module.exports = router;
