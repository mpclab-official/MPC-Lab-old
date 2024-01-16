// __sitemaps.js
// This is a router file that contains the code for the sitemaps xml.

const { router, path, config, Articles, fs } = require("./common.js");

router.get("/sitemaps/navigation", (req, res) => {
  res.set("Content-Type", "application/xml");
  res.render(path.join(config.path, "sitemaps", "navigation"), {
    url: config.url,
    Languages: config.languages,
  });
});

router.get("/sitemaps/toolbox", (req, res) => {
  res.set("Content-Type", "application/xml");
  fs.readFile(
    path.join(config.path, "tools", "tools.json"),
    "utf8",
    (err, data) => {
      if (data) {
        try {
          let Tools = JSON.parse(data);
          res.render(path.join(config.path, "sitemaps", "tools"), {
            url: config.url,
            Languages: config.languages,
            Tools,
          });
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }
      }
    }
  );
});

router.get("/sitemaps/articles", (req, res) => {
  res.set("Content-Type", "application/xml");
  Articles.getAllArticles((json) => {
    if (json.code.includes(0)) {
      res.render(path.join(config.path, "sitemaps", "articles"), {
        url: config.url,
        Languages: config.languages,
        Articles: json.articles,
      });
    } else {
      res.status(500).send(json);
    }
  });
});

module.exports = router;
