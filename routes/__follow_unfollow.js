// __follow_unfollow.js
// This is a router file that contains the code for the follow and unfollow API.

const { router, User } = require("./common.js");

router.route("/api/follow_user").post((req, res) => {
  if (req.body.targetUID && req.session.userID) {
    User.readUserData(req.session.userID, (err, data) => {
      if (data) {
        if (!data.following.includes(req.body.targetUID)) {
          User.updateUserData(
            req.session.userID,
            { following: data.following.concat(req.body.targetUID) },
            (err) => {
              if (err) {
                res.send({ code: [-1], message: "Failed to follow!" });
              } else {
                User.readUserData(req.body.targetUID, (err, data) => {
                  if (data) {
                    User.updateUserData(
                      req.body.targetUID,
                      {
                        followers: data.followers.concat(req.session.userID),
                      },
                      (err) => {
                        if (err) {
                          res.send({
                            code: [-1],
                            message: "Failed to follow!",
                          });
                        } else {
                          res.send({ code: [0], message: "Followed!" });
                        }
                      }
                    );
                  }
                });
              }
            }
          );
        } else {
          User.updateUserData(
            req.session.userID,
            {
              following: data.following.filter(
                (item) => item !== req.body.targetUID
              ),
            },
            (err) => {
              if (err) {
                res.send({ code: [-1], message: "Failed to unfollow!" });
              } else {
                User.readUserData(req.body.targetUID, (err, data) => {
                  if (data) {
                    User.updateUserData(
                      req.body.targetUID,
                      {
                        followers: data.followers.filter(
                          (item) => item !== req.session.userID
                        ),
                      },
                      (err) => {
                        if (err) {
                          res.send({
                            code: [-1],
                            message: "Failed to unfollow!",
                          });
                        } else {
                          res.send({ code: [0], message: "Unfollowed!" });
                        }
                      }
                    );
                  }
                });
              }
            }
          );
        }
      }
    });
  } else {
    res.send({ code: [-1], message: "Not logged in!" });
  }
});

router.route("/api/follow_user/check").post((req, res) => {
  if (req.body.targetUID && req.session.userID) {
    User.readUserData(req.session.userID, (err, data) => {
      if (data) {
        if (data.following.includes(req.body.targetUID)) {
          res.send({ code: [0], message: "Following!" });
        } else {
          res.send({ code: [1], message: "Not following!" });
        }
      }
    });
  } else {
    res.send({ code: [-1], message: "Not logged in!" });
  }
});

module.exports = router;
