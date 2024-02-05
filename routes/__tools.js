// __tools.js
// This is a router file that contains the code for the tools page.

const {
  router,
  path,
  config,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
} = require("./common.js");

router.get("/:language/tools", checkPageRedirect, (req, res) => {
  let Tools = require(`../tools/tools.js`);
  getUserData(req.session.userID, (err, data) => {
    let inTags = false;
    if (req.query.tag) {
      inTags = true;
      let tagedTools = new Array();
      for (let i = 0; i < Tools.length; i++) {
        for (let j = 0; j < Tools[i].tags.length; j++) {
          if (Tools[i].tags[j][req.params.language] == req.query.tag) {
            tagedTools.push(Tools[i]);
            break;
          }
        }
      }
      Tools = tagedTools;
    }
    if (data) userData = data;
    else userData = { colorTheme: "light" };
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) {
      res.redirect(`/${languages_list[0]}`);
      return;
    }
    const languages_translate_pack = languages_translate[language_index];
    const navigation_translate_pack = language_navigation[language_index];
    res.render(path.join(config.path, "page", "tools"), {
      title: `${config.name} | ${navigation_translate_pack[1].name}`,
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
      Tools,
      inTags,
    });
  });
});

module.exports = router;
