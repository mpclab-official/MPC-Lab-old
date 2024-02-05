// __register.js
// This is a router file that contains the code for the register page.

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
  checkVerificationCodeExpiration,
} = require("./common.js");

router
  .route("/:language/register")
  .get(checkPageRedirect, (req, res) => {
    getUserData(req.session.userID, (err, data) => {
      if (data) userData = data;
      else
        userData = {
          colorTheme: "light",
        };
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) {
        res.redirect(`/${languages_list[0]}`);
        return;
      }
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      res.render(path.join(config.path, "page", "register"), {
        title: `${config.name} | ${languages_translate_pack.lan_register}`,
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
  .post(checkVerificationCodeExpiration, (req, res) => {
    const language_index = languages_list.indexOf(req.params.language);
    if (language_index == -1) {
      res.redirect(`/${languages_list[0]}`);
      return;
    }
    const languages_translate_pack = languages_translate[language_index];
    const messages = [
      languages_translate_pack.lan_auth_register_code0,
      languages_translate_pack.lan_auth_register_code1,
      languages_translate_pack.lan_auth_register_code2,
      languages_translate_pack.lan_auth_register_code3,
      languages_translate_pack.lan_auth_register_code4,
      languages_translate_pack.lan_auth_register_code5,
      languages_translate_pack.lan_auth_register_code6,
      languages_translate_pack.lan_auth_register_code7,
      languages_translate_pack.lan_auth_register_code8,
      languages_translate_pack.lan_auth_register_code9,
    ];

    const params = req.body; // Use req.body to get POST request data
    if (
      req.session.verificationCode &&
      req.session.verificationEmail == params.email
    ) {
      if (params.verification_code) {
        if (req.session.verificationCode == params.verification_code) {
          Auth.register(
            params.username,
            params.email,
            params.password,
            (code, id) => {
              if (code) {
                if (code == 0) {
                  Auth.getUserById(id, (err, data) => {
                    req.session.userID = id;
                    req.session.hash = data.hash;
                    req.session.hash_created_at = Date.now();

                    req.session.verificationCode = null;
                    req.session.verificationCodeExpiration = null;

                    res.status(200).json({
                      code,
                      messages,
                    });
                  });
                } else {
                  res.status(200).json({
                    code,
                    messages,
                  });
                }
              }
            }
          );
        } else {
          let code = [9]; // Incorrect verification code
          res.status(200).json({
            code,
            messages,
          });
        }
      } else {
        let code = [8]; // Verification code not entered
        res.status(200).json({
          code,
          messages,
        });
      }
    } else {
      let code = [7]; // Verification code not obtained or expired
      res.status(200).json({
        code,
        messages,
      });

      req.session.verificationCode = null;
      req.session.verificationCodeExpiration = null;
    }
  });

module.exports = router;
