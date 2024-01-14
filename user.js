// user.js
// This is a module file that contains the code for the user data.

// Load config file
const config = require(`${__dirname}/config.js`);

// Load Auth module
const Auth = require(`./auth.js`);

// Load fs module
const fs = require("fs");

// Extract the directory path from the database path
const dbDirectory = `${config.db.user.replace(/\/[^/]+$/, "")}`;

// Create the directory if it doesn't exist
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

// Import sqlite3 module
const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database(`${config.db.user}`);

class User {
  constructor() {
    // Create user data table
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS userData (id TEXT PRIMARY KEY, userId TEXT, data TEXT)"
      );
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
        db.get(
          "SELECT * FROM userData WHERE userId = ?",
          [authUserId],
          (err, row) => {
            if (row) {
              // User data already exists, update it
              this.updateExistingUserData(authUserId, newData, callback);
            } else {
              // User data does not exist, create new data
              this.createNewUserData(authUserId, newData, callback);
            }
          }
        );
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
        db.get(
          "SELECT * FROM userData WHERE userId = ?",
          [authUserId],
          (err, row) => {
            if (row?.data) {
              let data = {
                ...JSON.parse(row.data),
                UID: authUserId,
              };
              callback(err, data);
            } else {
              callback(err, null);
            }
          }
        );
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
    const insertData = db.prepare(
      "INSERT OR REPLACE INTO userData (id, userId, data) VALUES (?, ?, ?)"
    );

    insertData.run(
      authUserId,
      authUserId,
      JSON.stringify(newData),
      (insertErr) => {
        callback(insertErr, authUserId);
      }
    );

    insertData.finalize();
  }

  // Update existing user data
  updateExistingUserData(authUserId, newData, callback) {
    this.readUserData(authUserId, (err, oldData) => {
      // Merge old and new data
      newData = {
        ...oldData,
        ...newData,
      };

      // Build SET statement
      const updateValues = JSON.stringify(newData);

      // Execute UPDATE statement
      db.run(
        `UPDATE userData SET data = ? WHERE userId = ?`,
        updateValues,
        authUserId,
        (err) => {
          callback(err);
        }
      );
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
