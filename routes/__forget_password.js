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
} = require('./common.js');

// Forget Password
router.route('/:language/forget-password')
    .get(checkPageRedirect, (req, res) => {
        getUserData(req.session.userID, (err, data) => {
            if (data) userData = data;
            else userData = { colorTheme: "light" };
            const language_index = languages_list.indexOf(req.params.language);
            if (language_index == -1) res.redirect(`/${languages_list[0]}`);
            const languages_translate_pack = languages_translate[language_index];
            const navigation_translate_pack = language_navigation[language_index];
            res.render(path.join(config.path, 'page', 'forget-password'), {
                title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
                    colorTheme: userData.colorTheme
                }, userData
            });
        });
    })
    .post(checkVerificationCodeExpiration, (req, res) => {
        const language_index = languages_list.indexOf(req.params.language);
        if (language_index == -1) res.redirect(`/${languages_list[0]}`);
        const languages_translate_pack = languages_translate[language_index];
        /**
         * Array of messages for forget password functionality.
         * Each element represents a different message code.
         * @type {string[]}
         */
        const messages = [
            languages_translate_pack.lan_auth_forget_password_code0,
            languages_translate_pack.lan_auth_forget_password_code1,
            languages_translate_pack.lan_auth_forget_password_code2,
            languages_translate_pack.lan_auth_forget_password_code3,
            languages_translate_pack.lan_auth_forget_password_code4,
            languages_translate_pack.lan_auth_forget_password_code5,
            languages_translate_pack.lan_auth_forget_password_code6
        ];

        const params = req.body; // Use req.body to get POST request data
        if (req.session.verificationCode && req.session.verificationEmail == params.email) {
            if (params.verification_code) {
                if (req.session.verificationCode == params.verification_code) {
                    Auth.resetPassword(params.email, params.password, (code) => {
                        if (code) {
                            if (code == 0) {
                                req.session.verificationCode = null;
                                req.session.verificationCodeExpiration = null;
                            }
                            res.status(200).json({ code, messages });
                        }
                    });
                } else {
                    let code = [6]; // Incorrect verification code
                    res.status(200).json({ code, messages });
                }
            } else {
                let code = [5]; // Verification code not entered
                res.status(200).json({ code, messages });
            }
        } else {
            let code = [4]; // Verification code not obtained or expired
            res.status(200).json({ code, messages });

            req.session.verificationCode = null;
            req.session.verificationCodeExpiration = null;
        }
    });

module.exports = router;