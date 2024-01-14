// __verification_code.js
// This is a router file that contains the code for the verification code.

const {
  router,
  languages_list,
  languages_translate,
  emailVerification,
} = require("./common.js");

// Verification code
router.post("/:language/verification", (req, res) => {
  const language_index = languages_list.indexOf(req.params.language);
  if (language_index == -1) res.redirect(`/${languages_list[0]}`);
  const languages_translate_pack = languages_translate[language_index];
  const messages = [
    languages_translate_pack.lan_auth_register_verification0,
    languages_translate_pack.lan_auth_register_verification1,
  ];

  const params = req.body; // Use req.body to get POST request data
  const email = params.email;

  emailVerification.sendVerificationEmail(
    email,
    languages_translate_pack.lan_get_verification_email_title,
    languages_translate_pack.lan_get_verification_email_text,
    (error, verificationCode) => {
      if (error) {
        res.status(200).json({ code: [1], messages });
      } else {
        req.session.verificationCode = verificationCode;
        req.session.verificationEmail = email;
        req.session.verificationCodeExpiration = Date.now() + 10 * 60 * 1000; // Set verification code expiration to 10 minutes

        res.status(200).json({ code: [0], messages });
      }
    }
  );
});

module.exports = router;
