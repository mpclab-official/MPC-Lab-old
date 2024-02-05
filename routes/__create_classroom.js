// __create_classroom.js
// This is a router file that contains the code for the create classroom page.

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

router.get("/:language/class/create", checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) {
      res.redirect(`/${languages_list[0]}`);
      return;
    }
    const languages_translate_pack = languages_translate[language_index];
    const navigation_translate_pack = language_navigation[language_index];
    res.render(path.join(config.path, "page", "create-classroom"), {
      title: `${config.name} | ${languages_translate_pack.lan_creat_classroom}`,
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

router.post("/:language/class/create", (req, res) => {
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
    Classroom.createClassroom(
      req.body.name,
      req.body.name_formal,
      req.body.email,
      req.body.phone,
      req.body.address,
      req.body.address_city,
      req.body.address_state,
      req.body.address_zip,
      req.body.address_country,
      req.body.website,
      req.body.logo,
      req.body.description,
      "active",
      1,
      1000
    )
      .then((id) => {
        Classroom.addPeople(id, req.session.userID, "owner", true);
        res.json({
          id,
          messages: [
            languages_translate_pack.lan_create_classroom_create_code_successfully,
          ],
        });
      })
      .catch((error) => {
        let messages = new Array();
        if (error.includes("name_invalid")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_invalid
          );
        }
        if (error.includes("name_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_too_long
          );
        }
        if (error.includes("name_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_too_short
          );
        }
        if (error.includes("name_formal_invalid")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_formal_invalid
          );
        }
        if (error.includes("name_formal_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_formal_too_long
          );
        }
        if (error.includes("name_formal_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_formal_too_short
          );
        }
        if (error.includes("name_formal_already_exist")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_name_formal_already_exists
          );
        }
        if (error.includes("email_invalid")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_email_invalid
          );
        }
        if (error.includes("phone_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_phone_too_long
          );
        }
        if (error.includes("phone_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_phone_too_short
          );
        }
        if (error.includes("address_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_address_too_long
          );
        }
        if (error.includes("address_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_address_too_short
          );
        }
        if (error.includes("city_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_city_too_long
          );
        }
        if (error.includes("city_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_city_too_short
          );
        }
        if (error.includes("state_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_state_too_long
          );
        }
        if (error.includes("state_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_state_too_short
          );
        }
        if (error.includes("zip_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_zip_too_long
          );
        }
        if (error.includes("zip_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_zip_too_short
          );
        }
        if (error.includes("country_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_country_too_long
          );
        }
        if (error.includes("country_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_country_too_short
          );
        }
        if (error.includes("website_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_website_too_long
          );
        }
        if (error.includes("website_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_website_too_short
          );
        }
        if (error.includes("description_too_long")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_description_too_long
          );
        }
        if (error.includes("description_too_short")) {
          messages.push(
            languages_translate_pack.lan_create_classroom_create_code_description_too_short
          );
        }
        res.json({ error, messages });
      });
  }
});

module.exports = router;
