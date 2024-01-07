const sqlite3 = require('sqlite3').verbose();
const config = require(`../../config.js`);
const db = new sqlite3.Database(`${config.db.user}/usersData.db`);
const Auth = require(`${config.db.auth}/auth.js`);

class User {
    constructor() {
        // Create user data table
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS userData (id TEXT PRIMARY KEY, userId TEXT, data TEXT)");
            console.log("User data database connected!");
        });
    }

    // Update user data module
    updateUserData(authUserId, newData, callback) {
        // Check if user exists
        Auth.getUserById(authUserId, (authErr, authUser) => {
            if (authErr) {
                callback(authErr);
            } else if (!authUser) {
                callback(new Error("Invalid user ID"));
            } else {
                // Check if user data already exists
                db.get("SELECT * FROM userData WHERE userId = ?", [authUserId], (err, row) => {
                    if (row) {
                        // User data already exists, update it
                        this.updateExistingUserData(authUserId, newData, callback);
                    } else {
                        // User data does not exist, create new data
                        this.createNewUserData(authUserId, newData, callback);
                    }
                });
            }
        });
    }

    // Read user data module
    readUserData(authUserId, callback) {
        // Check if user exists
        Auth.getUserById(authUserId, (authErr, authUser) => {
            if (authErr) {
                callback(authErr);
            } else if (!authUser) {
                callback(new Error("Invalid user ID"));
            } else {
                // Get user data
                db.get("SELECT * FROM userData WHERE userId = ?", [authUserId], (err, row) => {
                    if (row?.data) {
                        let data = {
                            ...JSON.parse(row.data),
                            UID: authUserId
                        }
                        callback(err, data);
                    } else {
                        callback(err, null);
                    }
                });
            }
        });
    }

    // Delete user data module
    deleteUserData(authUserId, callback) {
        // Check if user exists
        Auth.getUserById(authUserId, (authErr, authUser) => {
            if (authErr) {
                callback(authErr);
            } else if (!authUser) {
                callback(new Error("Invalid user ID"));
            } else {
                // Delete user data
                db.run("DELETE FROM userData WHERE userId = ?", [authUserId], (err) => {
                    callback(err);
                });
            }
        });
    }

    // Create new user data
    createNewUserData(authUserId, newData, callback) {
        const insertData = db.prepare("INSERT OR REPLACE INTO userData (id, userId, data) VALUES (?, ?, ?)");

        insertData.run(authUserId, authUserId, JSON.stringify(newData), (insertErr) => {
            callback(insertErr, authUserId);
        });

        insertData.finalize();
    }

    // Update existing user data
    updateExistingUserData(authUserId, newData, callback) {
        // Build SET clause
        const setClause = Object.keys(newData).map(field => `${field} = ?`).join(', ');
        const updateValues = Object.values(newData);
        updateValues.push(authUserId);

        // Execute UPDATE statement
        db.run(`UPDATE userData SET ${setClause} WHERE userId = ?`, updateValues, (err) => {
            callback(err);
        });
    }

    // Close database connection
    close() {
        db.close();
        return true;
    }
}

// Export User object
module.exports = new User();
