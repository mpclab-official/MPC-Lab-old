const e = require('express');
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

// Blog
router.route('/:language/blog')
    .get(checkPageRedirect, (req, res) => {
        getUserData(req.session.userID, (err, data) => {
            if (data) userData = data;
            else userData = { colorTheme: "light" };
            const language_index = languages_list.indexOf(req.params.language);
            if (language_index == -1) res.redirect(`/${languages_list[0]}`);
            const languages_translate_pack = languages_translate[language_index];
            const navigation_translate_pack = language_navigation[language_index];
            res.render(path.join(config.path, 'page', 'blog'), {
                title: config.name, language_code: req.params.language, favicon: config.favicon, logo: config.logo, logo_s: config.logo_s, background_image: config.background_image, navigation_translate_pack, ...languages_translate_pack, pageStyle: {
                    colorTheme: userData.colorTheme,
                }, userData
            });
        });
    })
    .post((req, res) => {
        const params = req.body;
        function processArticlesAndSendResponse(res, json) {
            if (json) {
                if (json.code.includes(-1)) {
                    res.status(500).send("Internal Server Error!");
                } else {
                    // Save all asynchronous operations in an array of Promises
                    const promises = json.articles.map((article) => {
                        return new Promise((resolve, reject) => {
                            getUserData(article.author_id, (err, data) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    article.author_name = data.userName;
                                    resolve();
                                }
                            });
                        });
                    });

                    // Use Promise.all to wait for all asynchronous operations to complete
                    Promise.all(promises)
                        .then(() => {
                            // Send response after all asynchronous operations are completed
                            res.status(200).json({ code: json.code, articles: json.articles, noMoreArticles: json.noMoreArticles });
                        })
                        .catch((err) => {
                            console.error(`Error fetching user data: ${err}`);
                            res.status(500).send("Internal Server Error!");
                        });
                }
            }
        }
        if (req.session.userID) {
            getUserData(req.session.userID, (err, data) => {
                if (data) {
                    if (data.interest.length > 0 && !params.newArticles) {
                        // User has interest tags A
                        Articles.fuzzySearchPaginatedArticlesByInterests(data.interest, params.page, params.pageSize, params.startDate, (json) => {
                            if (json.articles?.length > 0) {
                                // Related interest articles A
                                console.log(json.articles);
                                if (json.articles.length < params.pageSize) {
                                    json.noMoreArticles = true;
                                }
                                processArticlesAndSendResponse(res, json);
                            } else {
                                // All related interest articles have been loaded, load other articles B
                                Articles.getPaginatedArticlesByDate(params.page, params.pageSize, params.startDate, (json) => {
                                    processArticlesAndSendResponse(res, json);
                                });
                            }
                        });
                    } else {
                        // User has no interest tags or requests to load new articles B
                        Articles.getPaginatedArticlesByDate(params.page, params.pageSize, params.startDate, (json) => {
                            processArticlesAndSendResponse(res, json);
                        });
                    }
                } else {
                    // Failed to retrieve user data B
                    Articles.getPaginatedArticlesByDate(params.page, params.pageSize, params.startDate, (json) => {
                        processArticlesAndSendResponse(res, json);
                    });
                }
            });
        } else {
            // User is not logged in B
            Articles.getPaginatedArticlesByDate(params.page, params.pageSize, params.startDate, (json) => {
                processArticlesAndSendResponse(res, json);
            });
        }
    });

module.exports = router;