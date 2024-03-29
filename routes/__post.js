// __post.js
// This is a router file that contains the code for the article page.

const {
  router,
  path,
  config,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
  User,
  Articles,
} = require("./common.js");

function updateInterestTags(oldTags, newTags) {
  // Merge old tags and new tags, and ensure uniqueness using Set
  const combinedTagsSet = new Set([...oldTags, ...newTags]);

  // Convert Set back to an array
  const combinedTagsArray = Array.from(combinedTagsSet);

  // If the total number of tags exceeds 80, truncate to the first 80 tags
  const finalTagsArray = combinedTagsArray.slice(0, 80);

  // Return the final array of user interest tags
  return finalTagsArray;
}

router
  .route("/:language/blog/article/:id")
  .get(checkPageRedirect, (req, res) => {
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
      Articles.getArticleById(req.params.id, (json) => {
        getUserData(json.article.author_id, (err, author) => {
          if (!err) {
            if (json.code.includes(0)) {
              // provent to increase view count when user refresh the page
              if (!req.session.viewedArticles) req.session.viewedArticles = [];
              if (!req.session.viewedArticles.includes(req.params.id)) {
                req.session.viewedArticles.push(req.params.id);
                Articles.incrementViews(req.params.id, (json) => {
                  if (!json.code.includes(0)) {
                    console.log(json);
                  }
                });
              }
              res.render(path.join(config.path, "page", "article"), {
                title: json.article.title,
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
                postID: req.params.id,
                article: json.article,
                author,
              });
            }
          }

          // Update user interest tags if user is logged in
          if (data) {
            User.updateExistingUserData(
              req.session.userID,
              {
                interest: updateInterestTags(data.interest, json.article.tags),
              },
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        });
      });
    });
  });

module.exports = router;
