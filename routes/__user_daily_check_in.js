// __user_daily_check_in.js
// Router for user daily check in

const { router, User } = require("./common.js");

router.route("/api/user-daily-check-in").post((req, res) => {
  User.readUserData(req.session.userID, (err, userData) => {
    if (!err) {
      if (!userData.dailyCheckIn) {
        userData.dailyCheckIn = {
          lastCheckInDate: "",
          checkInCount: 0,
        };
      }
      if (userData.dailyCheckIn.lastCheckInDate == new Date().toDateString()) {
        res
          .status(200)
          .json({ message: "Already checked in today", code: [1] });
        return;
      } else {
        User.updateUserData(
          req.session.userID,
          {
            dailyCheckIn: {
              lastCheckInDate: new Date().toDateString(),
              checkInCount: userData.dailyCheckIn.checkInCount + 1,
            },
            coins: userData.coins + 1,
          },
          (err) => {
            if (!err) {
              res.status(200).json({
                message: "Successfully checked in",
                code: [0],
                coins: userData.coins + 1,
              });
              return;
            } else {
              res.status(500).json({
                error: err,
                message: "Internal server error",
                code: [-1],
              });
              return;
            }
          }
        );
      }
    } else {
      res
        .status(500)
        .json({ error: err, message: "Internal server error", code: [-1] });
    }
  });
});

module.exports = router;
