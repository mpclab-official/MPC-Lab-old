const {
    router,
    path,
    config,
    languages_list,
    languages_translate,
    language_navigation,
    checkPageRedirect,
    getUserData,
} = require('./common.js');
const Articles = require(`${config.db.articles}/articles.js`);

// Blog Post
router.route('/:language/blog/post')
    .get(checkPageRedirect, (req, res) => {
        getUserData(req.session.userID, (err, data) => {
            if (data) userData = data;
            else userData = { colorTheme: "light" };
            const language_index = languages_list.indexOf(req.params.language);
            if (language_index == -1) res.redirect(`/${languages_list[0]}`);
            const languages_translate_pack = languages_translate[language_index];
            const navigation_translate_pack = language_navigation[language_index];
            res.render(path.join(config.path, 'page', 'article-post'), {
                title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
                    colorTheme: userData.colorTheme,
                }, userData
            });
        });
    })
    .post((req, res) => {
        if (req.session.userID) {
            const language_index = languages_list.indexOf(req.params.language);
            if (language_index == -1) res.redirect(`/${languages_list[0]}`);
            const languages_translate_pack = languages_translate[language_index];
            const messages = [
                languages_translate_pack.lan_blog_post_code0,
                languages_translate_pack.lan_blog_post_code1,
                languages_translate_pack.lan_blog_post_code2,
                languages_translate_pack.lan_blog_post_code3,
            ];
            const params = req.body;
            let article = params.article;
            article.author_id = req.session.userID;
            Articles.addArticle(article, (json) => {
                if (json) {
                    if (json.code.includes(-1)) {
                        res.status(500).send("Internal Server Error!");
                    } else {
                        res.status(200).json({ code: json.code, messages });
                    }
                }
            });
        } else {
            res.status(403).send("You are not logged in!");
        }
    });

module.exports = router;