// __my.js
// This is a router file that contains the code for the user page.

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
  Articles,
} = require("./common.js");

router.route("/:language/my").get(checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    Auth.getUserById(data.UID, (err, data) => {
      userData.email = data.email;
      userData.username = data.username;
      let likesArticles = [];
      let staredArticles = [];
      if (userData.Blog.likes.length > 0) {
        for (let i = 0; i < userData.Blog.likes.length; i++) {
          Articles.getArticleById(userData.Blog.likes[i], (json) => {
            if (json.code.includes(0)) {
              likesArticles[i] = json.article;
            }
            if (i == userData.Blog.likes.length - 1) {
              userData.Blog.likes.reverse();
              getStaredArticles();
            }
          });
        }
      } else {
        getStaredArticles();
      }
      function getStaredArticles() {
        if (userData.Blog.stars.length > 0) {
          for (let i = 0; i < userData.Blog.stars.length; i++) {
            Articles.getArticleById(userData.Blog.stars[i], (json) => {
              if (json.code.includes(0)) {
                staredArticles[i] = json.article;
              }
              if (i == userData.Blog.stars.length - 1) {
                userData.Blog.stars.reverse();
                send();
              }
            });
          }
        } else {
          send();
        }
      }
      function send() {
        const language_index = languages_list.indexOf(req.params.language);
        if (language_index == -1) {
          res.redirect(`/${languages_list[0]}`);
          return;
        }
        const languages_translate_pack = languages_translate[language_index];
        const navigation_translate_pack = language_navigation[language_index];
        res.render(path.join(config.path, "page", "my"), {
          title: `${config.name} | ${userData.userName}`,
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
          likesArticles,
          staredArticles,
        });
      }
    });
  });
});

router.route("/:language/my/following").get(checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    Auth.getUserById(data.UID, (err, data) => {
      userData.email = data.email;
      userData.username = data.username;
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) {
        res.redirect(`/${languages_list[0]}`);
        return;
      }
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      let followingData = [];
      if (userData.following.length == 0) send();
      for (let i = 0; i < userData.following.length; i++) {
        getUserData(userData.following[i], (err, data) => {
          followingData.push(data);
          if (i == userData.following.length - 1) {
            userData.following = followingData;
            send();
          }
        });
      }
      function send() {
        res.render(path.join(config.path, "page", "my-following"), {
          title: `${config.name} | ${userData.userName}`,
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
    });
  });
});

router.route("/:language/my/followers").get(checkPageRedirect, (req, res) => {
  getUserData(req.session.userID, (err, data) => {
    let userData = data;
    Auth.getUserById(data.UID, (err, data) => {
      userData.email = data.email;
      userData.username = data.username;
      const language_index = languages_list.indexOf(req.params.language);
      if (language_index == -1) {
        res.redirect(`/${languages_list[0]}`);
        return;
      }
      const languages_translate_pack = languages_translate[language_index];
      const navigation_translate_pack = language_navigation[language_index];
      let followersData = [];
      if (userData.followers.length == 0) send();
      for (let i = 0; i < userData.followers.length; i++) {
        getUserData(userData.followers[i], (err, data) => {
          followersData.push(data);
          if (i == userData.followers.length - 1) {
            userData.followers = followersData;
            send();
          }
        });
      }
      function send() {
        res.render(path.join(config.path, "page", "my-followers"), {
          title: `${config.name} | ${userData.userName}`,
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
    });
  });
});

module.exports = router;
