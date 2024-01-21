const {
  router,
  path,
  config,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
  fs,
} = require("../../routes/common.js");

router.get(
  "/:language/tools/two_variable_linear_equation_calculator",
  checkPageRedirect,
  (req, res) => {
    fs.readFile(
      path.join(config.path, "tools", "tools.json"),
      "utf8",
      (err, data) => {
        if (data) {
          const Tools = JSON.parse(data);
          let thisTool;
          for (let i = 0; i < Tools.length; i++) {
            if (Tools[i].url == "two_variable_linear_equation_calculator")
              thisTool = Tools[i];
          }
          getUserData(req.session.userID, (err, data) => {
            if (data) userData = data;
            else userData = { colorTheme: "light" };
            const language_index = languages_list.indexOf(req.params.language);
            if (language_index == -1) res.redirect(`/${languages_list[0]}`);
            const languages_translate_pack =
              languages_translate[language_index];
            const navigation_translate_pack =
              language_navigation[language_index];
            res.render(path.join(config.path, "page", "tool"), {
              title: `${config.name} | ${thisTool.name[req.params.language]}`,
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
              thisTool,
            });
          });
        }
      }
    );
  }
);

router.post(
  "/:language/tools/two_variable_linear_equation_calculator",
  checkPageRedirect,
  (req, res) => {
    const params = req.body;

    const a1 = Number(params.a1);
    const a2 = Number(params.a2);
    const b1 = Number(params.b1);
    const b2 = Number(params.b2);
    const c1 = Number(params.c1);
    const c2 = Number(params.c2);

    let json = {};

    if (
      !isNaN(a1) &&
      !isNaN(a2) &&
      !isNaN(b1) &&
      !isNaN(b2) &&
      !isNaN(c1) &&
      !isNaN(c2)
    ) {
      const detA = a1 * b2 - a2 * b1;

      if (detA !== 0) {
        const detDx = c1 * b2 - c2 * b1;
        const detDy = a1 * c2 - a2 * c1;

        const x = detDx / detA;
        const y = detDy / detA;

        json = {
          code: 0,
          solution: {
            x: x,
            y: y,
          },
        };
      } else if (detA === 0 && b1 / a1 === b2 / a2 && c1 / a1 === c2 / a2) {
        // Infinite solutions (same line)
        json = {
          code: 1,
        };
      } else {
        // No solution (parallel lines)
        json = {
          code: 2,
        };
      }
    } else {
      // Invalid input
      json = {
        code: -1,
      };
    }

    res.json(json);
  }
);

module.exports = router;
