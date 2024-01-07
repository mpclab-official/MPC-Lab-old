const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`${__dirname}/articles.db`);

class Articles {
    constructor() {
        // Create the 'articles' table if it doesn't exist
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        author_id TEXT,
        title TEXT,
        content TEXT,
        tags TEXT,
        language TEXT,
        publish_date TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments TEXT
      );
    `;

        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating articles table:', err.message);
            } else {
                console.log('Articles table created successfully.');
            }
        });
    }

    // Utility function to generate a random 12-digit ID
    generateRandomId() {
        return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    }

    // Check if an ID already exists in the 'articles' table
    async isIdExists(id) {
        return new Promise(resolve => {
            const query = 'SELECT COUNT(*) AS count FROM articles WHERE id = ?';
            db.get(query, [id], (err, result) => {
                if (err) {
                    console.error('Error checking if ID exists:', err.message);
                    resolve(false);
                } else {
                    resolve(result.count > 0);
                }
            });
        });
    }

    async addArticle(article, callback) {
        // Generate a random ID and check if it already exists
        let newId;
        do {
            newId = this.generateRandomId();
        } while (await this.isIdExists(newId));

        // Add a new article to the 'articles' table
        const query = 'INSERT INTO articles (id, author_id, title, content, tags, language, publish_date, views, likes, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        db.run(
            query,
            [newId, article.author_id, article.title, article.content, JSON.stringify(article.tags), article.language, article.publish_date, 0, 0, JSON.stringify(article.comments)],
            function (err) {
                if (err) {
                    console.error('Error adding article:', err.message);
                    callback(err, null);
                } else {
                    callback(null, { id: newId });
                }
            }
        );
    }

    // Get all articles
    getAllArticles(callback) {
        const query = 'SELECT * FROM articles ORDER BY publish_date DESC';
        db.all(query, (err, articles) => {
            if (err) {
                console.error('Error fetching articles:', err.message);
                callback(err, null);
            } else {
                callback(null, articles);
            }
        });
    }

    // Get an article by ID
    getArticleById(articleId, callback) {
        const query = 'SELECT * FROM articles WHERE id = ?';
        db.get(query, [articleId], (err, article) => {
            if (err) {
                console.error('Error fetching article by ID:', err.message);
                callback(err, null);
            } else {
                callback(null, article);
            }
        });
    }

    // Delete an article by ID
    deleteArticle(articleId, callback) {
        const query = 'DELETE FROM articles WHERE id = ?';
        db.run(query, [articleId], (err) => {
            if (err) {
                console.error('Error deleting article:', err.message);
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    // Update an article by ID
    updateArticle(articleId, updatedArticle, callback) {
        const query = 'UPDATE articles SET title = ?, content = ?, tags = ?, language = ? WHERE id = ?';
        db.run(query, [updatedArticle.title, updatedArticle.content, JSON.stringify(updatedArticle.tags), updatedArticle.language, articleId], (err) => {
            if (err) {
                console.error('Error updating article:', err.message);
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    // Find articles by tag
    findArticlesByTag(tag, callback) {
        const query = 'SELECT * FROM articles WHERE instr(tags, ?) > 0';
        db.all(query, [tag], (err, articles) => {
            if (err) {
                console.error('Error finding articles by tag:', err.message);
                callback(err, null);
            } else {
                callback(null, articles);
            }
        });
    }

    // Fuzzy search articles by user interests
    fuzzySearchArticlesByInterests(interests, callback) {
        const searchQuery = interests.map(interest => `instr(tags, '${interest}') > 0`).join(' OR ');
        const query = `SELECT * FROM articles WHERE ${searchQuery}`;

        db.all(query, (err, articles) => {
            if (err) {
                console.error('Error fuzzy searching articles by interests:', err.message);
                callback(err, null);
            } else {
                callback(null, articles);
            }
        });
    }

    // Basic fuzzy search algorithm for articles
    fuzzySearchArticles(keyword, callback) {
        const query = 'SELECT * FROM articles WHERE instr(title, ?) > 0 OR instr(content, ?) > 0';
        db.all(query, [keyword, keyword], (err, articles) => {
            if (err) {
                console.error('Error fuzzy searching articles:', err.message);
                callback(err, null);
            } else {
                callback(null, articles);
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

// Example usage:
// const articles = new Articles();

/*setTimeout(() => {
    // Example: Add a new article
    const newArticle1 = {
        author_id: 'user123',
        title: 'Introduction to Quantum Entanglement',
        content: 'In quantum mechanics, entanglement is a phenomenon where particles become correlated...',
        tags: ['quantum', 'physics'],
        language: 'en',
        publish_date: new Date().toISOString(),
        comments: [
            { author: 'commenter1', content: 'Interesting topic!' },
            { author: 'commenter2', content: 'I would love to learn more.' }
        ]
    };

    articles.addArticle(newArticle1, (err, addedArticle1) => {
        if (err) {
            console.error('Error adding new article 1:', err);
        } else {
            console.log('Added article 1:', addedArticle1);

            // Example: Add another new article
            const newArticle2 = {
                author_id: 'user456',
                title: 'Newton\'s Laws of Motion',
                content: 'Sir Isaac Newton formulated three laws of motion that describe the relationship...',
                tags: ['physics', 'laws', 'motion'],
                language: 'en',
                publish_date: new Date().toISOString(),
                comments: [
                    { author: 'commenter3', content: 'Classic physics content!' },
                    { author: 'commenter1', content: 'Newton was a genius.' }
                ]
            };

            articles.addArticle(newArticle2, (err, addedArticle2) => {
                if (err) {
                    console.error('Error adding new article 2:', err);
                } else {
                    console.log('Added article 2:', addedArticle2);

                    // Example: Update an article by ID
                    const articleIdToUpdate = addedArticle2.id; // Use the ID of the second added article
                    const updatedArticleData = {
                        title: 'Updated Title',
                        content: 'Updated content.',
                        tags: ['量子纠缠', '裙子'],
                        language: 'en'
                    };
                    articles.updateArticle(articleIdToUpdate, updatedArticleData, (err) => {
                        if (err) {
                            console.error(`Error updating article with ID ${articleIdToUpdate}:`, err);
                        } else {
                            console.log(`Updated article with ID ${articleIdToUpdate}`);

                            // Example: Find articles by tag
                            const tagToFind = 'tag1';
                            articles.findArticlesByTag(tagToFind, (err, foundArticles) => {
                                if (err) {
                                    console.error(`Error finding articles by tag ${tagToFind}:`, err);
                                } else {
                                    console.log(`Articles with tag ${tagToFind}:`, foundArticles);

                                    // Example: Fuzzy search articles by user interests
                                    const userInterests = ["tag43", "tag12", "tage78"];
                                    articles.fuzzySearchArticlesByInterests(userInterests, (err, foundArticles) => {
                                        if (err) {
                                            console.error('Error fuzzy searching articles by interests:', err);
                                        } else {
                                            console.log('Articles matching user interests:', foundArticles);

                                            // Example: Fuzzy search articles by keyword
                                            const searchKeyword = 'tag78';
                                            articles.fuzzySearchArticles(searchKeyword, (err, foundArticles) => {
                                                if (err) {
                                                    console.error(`Error fuzzy searching articles by keyword '${searchKeyword}':`, err);
                                                } else {
                                                    console.log(`Articles matching keyword '${searchKeyword}':`, foundArticles);

                                                    // Example: Delete an article by ID
                                                    const articleIdToDelete = addedArticle1.id; // Use the ID of the first added article
                                                    articles.deleteArticle(articleIdToDelete, (err) => {
                                                        if (err) {
                                                            console.error(`Error deleting article with ID ${articleIdToDelete}:`, err);
                                                        } else {
                                                            console.log(`Deleted article with ID ${articleIdToDelete}`);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

}, 1000);*/