// __user_setup.js
// This is a router file that contains the code for the user setup page.

const {
  fs,
  router,
  path,
  config,
  User,
  languages_list,
  languages_translate,
  language_navigation,
  checkPageRedirect,
  getUserData,
} = require("./common.js");

router
  .route("/:language/user-setup")
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
      res.render(path.join(config.path, "page", "user-setup"), {
        title: config.name,
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
  .post((req, res) => {
    // Check if the user is logged in
    if (!req.session.userID) {
      res.status(401).json({ code: [-1] });
      return;
    }

    const params = req.body;

    if (params.UserData) {
      const UserData = params.UserData;
      const userID = req.session.userID;

      UserData.joinDate = new Date().toISOString();

      // If the user uploads an avatar file
      if (UserData.userAvatar) {
        // Extract MIME type
        const mimeInfo = UserData.userAvatar.match(
          /^data:(image\/\w+);base64,/
        );

        // Base 64 data
        const mimeType = mimeInfo[1];
        const base64Data = UserData.userAvatar.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const buffer = Buffer.from(base64Data, "base64");

        // Check if the folder exists, if not, create it
        const avatarFolderPath = path.join(
          config.path,
          "public",
          "users-avatar"
        );
        if (!fs.existsSync(avatarFolderPath)) {
          fs.mkdirSync(avatarFolderPath, { recursive: true });
        }

        // Get file extension
        const fileExtension = mimeType.split("/").pop();

        // Build new file path
        const avatarFileName = `${userID}.${fileExtension}`; // Use the specified extension, assuming it is PNG here
        const avatarFilePath = path.join(avatarFolderPath, avatarFileName);

        // Write buffer to file
        fs.writeFileSync(avatarFilePath, buffer);

        // Update avatarUrl in UserData
        UserData.avatarUrl = `${avatarFileName}`;

        // Delete the avatar image in UserData
        delete UserData.userAvatar;

        // Update user data
        User.updateUserData(userID, UserData, (err) => {
          if (err) {
            res.status(500).json({ code: [-1], err });
          } else {
            // Return updated user data
            getUserData(userID, (err, data) => {
              res.status(200).json({ code: [0], userData: data });
            });
          }
        });
      } else {
        // User did not upload an avatar file, update UserData directly
        UserData.avatarUrl = "default_avatar.png";

        // Update user data
        User.updateUserData(userID, UserData, (err) => {
          if (err) {
            res.status(500).json({ code: [-1], err });
          } else {
            // Return updated user data
            getUserData(userID, (err, data) => {
              res.status(200).json({ code: [0], userData: data });
            });
          }
        });
      }
    } else {
      res.status(400).json({ code: [1] });
    }
  });

module.exports = router;
