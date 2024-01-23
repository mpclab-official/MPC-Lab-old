// articles.js
// This is a database file that contains the code for the articles table.

// Load config file
const config = require(`${__dirname}/config.js`);

// Load fs module
const fs = require("fs");

// Extract the directory path from the database path
const dbDirectory = `${config.db.articles.replace(/\/[^/]+$/, "")}`;

// Create the directory if it doesn't exist
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

// Import sqlite3 module
const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database(`${config.db.articles}`);

class Articles {
  constructor() {
    // Create the 'articles' table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        author_id TEXT,
        title TEXT,
        content TEXT,
        about TEXT,
        tags TEXT,
        cover TEXT,
        language TEXT,
        publish_date TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments TEXT
      );
    `;

    db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Error creating articles table:", err.message);
      }
    });
  }

  // Utility function to generate a random 12-digit ID
  generateRandomId() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }

  // Check if an ID already exists in the 'articles' table
  async isIdExists(id) {
    return new Promise((resolve) => {
      const query = "SELECT COUNT(*) AS count FROM articles WHERE id = ?";
      db.get(query, [id], (err, result) => {
        if (err) {
          console.error("Error checking if ID exists:", err.message);
          resolve(false);
        } else {
          resolve(result.count > 0);
        }
      });
    });
  }

  async addArticle(article, callback) {
    let errorCodes = [];

    if (!(article.title.length >= 10 && article.title.length <= 40)) {
      errorCodes.push(1); // Invalid title length
    }

    if (!(article.tags.length >= 1 && article.tags.length <= 8)) {
      errorCodes.push(2); // Invalid tags length
    } else {
      for (let tag of article.tags) {
        if (!(tag.length >= 4 && tag.length <= 20)) {
          errorCodes.push(2); // Invalid tag length
          break;
        }
      }
    }

    if (!(article.about.length >= 20 && article.about.length <= 150)) {
      errorCodes.push(3); // Invalid about length
    }

    if (errorCodes.length > 0) {
      callback({ code: errorCodes });
      return;
    }

    // Generate a random ID and check if it already exists
    let newId;
    do {
      newId = this.generateRandomId();
    } while (await this.isIdExists(newId));

    article.publish_date = new Date().toISOString();

    // Add a new article to the 'articles' table
    const query =
      "INSERT INTO articles (id, author_id, title, content, about, tags, cover, language, publish_date, views, likes, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.run(
      query,
      [
        newId,
        article.author_id,
        article.title,
        JSON.stringify(article.content),
        article.about,
        JSON.stringify(article.tags),
        article.cover,
        article.language,
        article.publish_date,
        0,
        0,
        JSON.stringify(article.comments),
      ],
      function (err) {
        if (err) {
          callback({ code: [-1], message: err.message });
        } else {
          callback({ code: [0], id: newId });
        }
      }
    );
  }

  // Get all articles
  getAllArticles(callback) {
    const query = "SELECT * FROM articles ORDER BY publish_date DESC";
    db.all(query, (err, articles) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        if (articles && articles.length > 0) {
          articles.forEach((article) => {
            article.content = JSON.parse(article.content);
            article.tags = JSON.parse(article.tags);
            article.comments = JSON.parse(article.comments);
          });
        }
        callback({ code: [0], articles });
      }
    });
  }

  // Get paginated articles
  getPaginatedArticles(page, pageSize, callback) {
    const offset = (page - 1) * pageSize;
    const query = `SELECT * FROM articles ORDER BY publish_date DESC LIMIT ? OFFSET ?`;

    db.all(query, [pageSize, offset], (err, articles) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        if (articles && articles.length > 0) {
          articles.forEach((article) => {
            article.content = JSON.parse(article.content);
            article.tags = JSON.parse(article.tags);
            article.comments = JSON.parse(article.comments);
          });
        }
        callback({ code: [0], articles });
      }
    });
  }

  // Get paginated articles based on publish date within a date range
  getPaginatedArticlesByDate(page, pageSize, startDate, callback) {
    const offset = (page - 1) * pageSize;
    const query =
      "SELECT * FROM articles WHERE publish_date <= ? ORDER BY publish_date DESC LIMIT ? OFFSET ?";

    db.all(query, [startDate, pageSize, offset], (err, articles) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        if (articles && articles.length > 0) {
          articles.forEach((article) => {
            article.content = JSON.parse(article.content);
            article.tags = JSON.parse(article.tags);
            article.comments = JSON.parse(article.comments);
          });
        }
        callback({ code: [0], articles });
      }
    });
  }

  // Get paginated articles by author ID
  getPaginatedArticlesByAuthorId(authorId, page, pageSize, callback) {
    const offset = (page - 1) * pageSize;
    const query =
      "SELECT * FROM articles WHERE author_id = ? ORDER BY publish_date DESC LIMIT ? OFFSET ?";

    db.all(query, [authorId, pageSize, offset], (err, articles) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        if (articles && articles.length > 0) {
          articles.forEach((article) => {
            article.content = JSON.parse(article.content);
            article.tags = JSON.parse(article.tags);
            article.comments = JSON.parse(article.comments);
          });
        }
        callback({ code: [0], articles });
      }
    });
  }

  // Get an article by ID
  getArticleById(articleId, callback) {
    const query = "SELECT * FROM articles WHERE id = ?";
    db.get(query, [articleId], (err, article) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        article.content = JSON.parse(article.content);
        article.tags = JSON.parse(article.tags);
        article.comments = JSON.parse(article.comments);
        callback({ code: [0], article });
      }
    });
  }

  // Delete an article by ID
  deleteArticle(articleId, callback) {
    const query = "DELETE FROM articles WHERE id = ?";
    db.run(query, [articleId], (err) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        callback({ code: [0] });
      }
    });
  }

  // Update an article by ID
  updateArticle(articleId, updatedArticle, callback) {
    let errorCodes = [];

    if (
      !(updatedArticle.title.length >= 10 && updatedArticle.title.length <= 40)
    ) {
      errorCodes.push(1); // Invalid title length
    }

    if (!(updatedArticle.tags.length >= 1 && updatedArticle.tags.length <= 8)) {
      errorCodes.push(2); // Invalid tags length
    }

    if (
      !(updatedArticle.about.length >= 20 && updatedArticle.about.length <= 150)
    ) {
      errorCodes.push(3); // Invalid about length
    }

    if (errorCodes.length > 0) {
      callback({ code: errorCodes });
      return;
    }

    const query =
      "UPDATE articles SET title = ?, content = ?, tags = ?, language = ? WHERE id = ?";
    db.run(
      query,
      [
        updatedArticle.title,
        updatedArticle.content,
        JSON.stringify(updatedArticle.tags),
        updatedArticle.language,
        articleId,
      ],
      (err) => {
        if (err) {
          callback({ code: [-1], message: err.message });
        } else {
          callback({ code: [0] });
        }
      }
    );
  }

  // Find paginated articles by tag starting from a specific date
  findPaginatedArticlesByTag(tag, page, pageSize, startDate, callback) {
    const offset = (page - 1) * pageSize;
    const query =
      "SELECT * FROM articles WHERE instr(tags, ?) > 0 AND publish_date <= ? ORDER BY publish_date DESC LIMIT ? OFFSET ?";

    db.all(query, [tag, startDate, pageSize, offset], (err, articles) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        if (articles && articles.length > 0) {
          articles.forEach((article) => {
            article.content = JSON.parse(article.content);
            article.tags = JSON.parse(article.tags);
            article.comments = JSON.parse(article.comments);
          });
        }
        callback({ code: [0], articles });
      }
    });
  }

  // Fuzzy search paginated articles by user interests starting from a specific date
  fuzzySearchPaginatedArticlesByInterests(
    interests,
    page,
    pageSize,
    startDate,
    callback
  ) {
    const offset = (page - 1) * pageSize;
    const searchQuery = interests
      .map((interest) => `instr(tags, '${interest}') > 0`)
      .join(" OR ");
    const query = `SELECT * FROM articles WHERE ${searchQuery} AND publish_date <= ? ORDER BY publish_date DESC LIMIT ? OFFSET ?`;

    db.all(query, [startDate, pageSize, offset], (err, articles) => {
      if (err) {
        callback({ code: [-1], message: err.message });
      } else {
        if (articles && articles.length > 0) {
          articles.forEach((article) => {
            article.content = JSON.parse(article.content);
            article.tags = JSON.parse(article.tags);
            article.comments = JSON.parse(article.comments);
          });
        }
        callback({ code: [0], articles });
      }
    });
  }

  // Basic fuzzy search paginated algorithm for articles
  fuzzySearchPaginatedArticles(keyword, page, pageSize, startDate, callback) {
    const offset = (page - 1) * pageSize;
    const query =
      "SELECT * FROM articles WHERE (instr(title, ?) > 0 OR instr(content, ?) > 0) AND publish_date <= ? ORDER BY publish_date DESC LIMIT ? OFFSET ?";

    db.all(
      query,
      [keyword, keyword, startDate, pageSize, offset],
      (err, articles) => {
        if (err) {
          callback({ code: [-1], message: err.message });
        } else {
          if (articles && articles.length > 0) {
            articles.forEach((article) => {
              article.content = JSON.parse(article.content);
              article.tags = JSON.parse(article.tags);
              article.comments = JSON.parse(article.comments);
            });
          }
          callback({ code: [0], articles });
        }
      }
    );
  }

  // Function to increment likes for an article
  async incrementLikes(articleId, callback) {
    const query = "UPDATE articles SET likes = likes + 1 WHERE id = ?";

    db.run(query, [articleId], (err) => {
      if (err) {
        callback({
          code: [-1],
          message: `Error incrementing likes for article with ID ${articleId}: ${err.message}`,
        });
      } else {
        callback({ code: [0] });
      }
    });
  }

  // Function to dislike an article
  async decrementLikes(articleId, callback) {
    const query = "UPDATE articles SET likes = likes - 1 WHERE id = ?";

    db.run(query, [articleId], (err) => {
      if (err) {
        callback({
          code: [-1],
          message: `Error decrementing likes for article with ID ${articleId}: ${err.message}`,
        });
      } else {
        callback({ code: [0] });
      }
    });
  }

  // Function to increment views for an article
  async incrementViews(articleId, callback) {
    const query = "UPDATE articles SET views = views + 1 WHERE id = ?";

    db.run(query, [articleId], (err) => {
      if (err) {
        callback({
          code: [-1],
          message: `Error incrementing views for article with ID ${articleId}: ${err.message}`,
        });
      } else {
        callback({ code: [0] });
      }
    });
  }

  // Close database connection
  close() {
    db.close();
    return true;
  }
}

// Export Articles object
module.exports = new Articles();
