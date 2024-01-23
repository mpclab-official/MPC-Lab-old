// __article_side_bar.js
// This is a server-side script that contains the code for the article side bar.

const { router, Articles, User } = require("./common.js");

router.route("/api/like_article").post((req, res) => {
  if (req.session.userID) {
    User.readUserData(req.session.userID, (err, data) => {
      if (data) {
        let uniqueLikes;
        if (data.Blog.likes.includes(req.body.articleId)) {
          uniqueLikes = new Set([...data.Blog.likes]);
          uniqueLikes.delete(req.body.articleId);
        } else {
          uniqueLikes = new Set([...data.Blog.likes, req.body.articleId]);
        }
        let updatedLikesArray = Array.from(uniqueLikes);
        User.updateUserData(
          req.session.userID,
          {
            Blog: {
              likes: updatedLikesArray,
              stars: data.Blog.stars,
              puttedCoins: data.Blog.puttedCoins,
            },
          },
          (err) => {
            if (err) {
              console.log(err);
              res.send({ code: [1], message: "Failed to like/unlike!" });
            } else {
              if (data.Blog.likes.includes(req.body.articleId)) {
                Articles.decrementLikes(req.body.articleId, (json) => {
                  if (json.code.includes(0)) {
                    res.send({ code: [0], message: "Unliked!" });
                  } else {
                    res.send({ code: [1], message: "Failed to unlike!" });
                  }
                });
              } else {
                Articles.incrementLikes(req.body.articleId, (json) => {
                  if (json.code.includes(0)) {
                    res.send({ code: [0], message: "Liked!" });
                  } else {
                    res.send({ code: [1], message: "Failed to like!" });
                  }
                });
              }
            }
          }
        );
      }
    });
  } else {
    res.send({ code: [-1], message: "Not logged in!" });
  }
});

router.route("/api/star_article").post((req, res) => {
  if (req.session.userID) {
    User.readUserData(req.session.userID, (err, data) => {
      if (data) {
        let uniqueStars;
        let message;
        if (data.Blog.stars.includes(req.body.articleId)) {
          uniqueStars = new Set([...data.Blog.stars]);
          uniqueStars.delete(req.body.articleId);
          message = "Unstarred!";
        } else {
          uniqueStars = new Set([...data.Blog.stars, req.body.articleId]);
          message = "Starred!";
        }
        let updatedStarsArray = Array.from(uniqueStars);
        User.updateUserData(
          req.session.userID,
          {
            Blog: {
              likes: data.Blog.likes,
              stars: updatedStarsArray,
              puttedCoins: data.Blog.puttedCoins,
            },
          },
          (err) => {
            if (err) {
              console.log(err);
              res.send({ code: [1], message: "Failed to like/unlike!" });
            } else {
              res.send({ code: [0], message: message });
            }
          }
        );
      }
    });
  } else {
    res.send({ code: [-1], message: "Not logged in!" });
  }
});

router.route("/api/coin_article").post((req, res) => {
  let authorId = req.body.authorId;
  if (req.session.userID) {
    User.readUserData(req.session.userID, (err, data) => {
      if (data) {
        let uniqueCoins;
        let message;
        if (data.Blog.puttedCoins.includes(authorId)) {
          uniqueCoins = new Set([...data.Blog.puttedCoins]);
          message = "Already putted!";
          res.send({ code: [0], message: message });
          return;
        } else if (data.coins < 1) {
          message = "Not enough coins!";
          res.send({ code: [0], message: message });
        } else {
          uniqueCoins = new Set([...data.Blog.puttedCoins, authorId]);
          message = "Putted!";
        }
        let uniqueCoinsArray = Array.from(uniqueCoins);
        User.updateUserData(
          req.session.userID,
          {
            Blog: {
              likes: data.Blog.likes,
              stars: data.Blog.stars,
              puttedCoins: uniqueCoinsArray,
            },
            coins: data.coins - 1,
          },
          (err) => {
            if (err) {
              console.log(err);
              res.send({ code: [1], message: "Failed to put coin!" });
            } else {
              User.readUserData(authorId, (err, data) => {
                User.updateUserData(
                  authorId,
                  { coins: data.coins + 1 },
                  (err) => {
                    if (err) {
                      console.log(err);
                      res.send({ code: [1], message: "Failed to put coin!" });
                    } else {
                      res.send({ code: [0], message: message });
                    }
                  }
                );
              });
            }
          }
        );
      }
    });
  } else {
    res.send({ code: [-1], message: "Not logged in!" });
  }
});

module.exports = router;
