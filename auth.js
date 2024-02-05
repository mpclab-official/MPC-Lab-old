// auth.js
// This is a database file that contains the code for the authentication system.

// Load config file
const config = require(`${__dirname}/config.js`);

// Load fs module
const fs = require("fs");

// Load crypto module
const crypto = require("crypto");

// Extract the directory path from the database path
const dbDirectory = `${config.db.auth.replace(/\/[^/]+$/, "")}`;

// Create the directory if it doesn't exist
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

// Import sqlite3 module
const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database(`${config.db.auth}`);

class Auth {
  constructor() {
    // Create users table if it doesn't exist
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, email TEXT, password TEXT, banned BOOLEAN DEFAULT 0, hash Text)"
      );
      console.log("Database connected!");
    });
  }

  // User registration function
  register(username, email, password, callback) {
    // Convert username and email to lowercase
    const lowercaseUsername = username.toLowerCase();
    const lowercaseEmail = email.toLowerCase();

    // Check username and email format
    const usernameRegex = /^[a-zA-Z0-9_]{7,21}$/; // Username must be 7 to 21 characters and can only contain letters, numbers, and underscores
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/; // Password format

    let errors = [];

    if (!usernameRegex.test(lowercaseUsername)) {
      errors.push(1); // Invalid username format
    }

    if (!emailRegex.test(lowercaseEmail)) {
      errors.push(2); // Invalid email format
    }

    if (!passwordRegex.test(password)) {
      errors.push(3); // Invalid password format
    }

    // Check if username and email already exist
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [lowercaseUsername],
      (err, rowUsername) => {
        if (rowUsername) {
          errors.push(4); // Username already exists
        }

        db.get(
          "SELECT * FROM users WHERE email = ?",
          [lowercaseEmail],
          (err, rowEmail) => {
            if (rowEmail) {
              errors.push(5); // Email already exists
            }

            if (errors.length > 0) {
              callback(errors);
            } else {
              // Generate a 6-character lowercase alphanumeric string as the user ID
              const userId = this.generateId();

              // Insert user data into the database
              const insertUser = db.prepare(
                "INSERT INTO users (id, username, email, password, hash) VALUES (?, ?, ?, ?, ?)"
              );
              const hash = crypto.createHash("sha256");
              hash.update(
                userId + lowercaseUsername + lowercaseEmail + password + false
              );
              insertUser.run(
                userId,
                lowercaseUsername,
                lowercaseEmail,
                password,
                hash.digest("hex"),
                function (err) {
                  if (err) {
                    errors.push(6); // Unknown error
                    callback(errors);
                  } else {
                    callback([0], userId); // Registration successful
                  }
                }
              );
              insertUser.finalize();
            }
          }
        );
      }
    );
  }

  // User login function
  login(identifier, password, callback) {
    // The identifier can be either an email or a username
    if (!(identifier && password)) {
      callback([1]); // Username/Email or password is incorrect
      return false;
    }
    const query = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.get(
      query,
      [identifier.toLowerCase(), identifier.toLowerCase()],
      (err, row) => {
        if (row) {
          if (row.banned == 1) {
            callback([2]); // User is banned
          } else if (row.password == password) {
            callback([0], row); // Login successful
          } else {
            callback([1]); // Username/Email or password is incorrect
          }
        } else {
          callback([1]); // Username/Email or password is incorrect
        }
      }
    );
  }

  // Delete user
  deleteUser(userId, callback) {
    db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
      if (err) {
        callback([1]); // Delete failed
      } else {
        callback([0]); // Delete successful
      }
    });
  }

  // Ban/unban user
  banUser(userId, isBanned, callback) {
    this.getUserById(userId, (err, row) => {
      const hash = crypto.createHash("sha256");
      hash.update(userId + row.username + row.email + row.password + isBanned);
      const newHash = hash.digest("hex");
      this.updateUser(userId, { banned: isBanned, hash: newHash }, (errors) => {
        if (errors.length > 0) {
          callback(errors);
        } else {
          callback([0]);
        }
      });
    });
  }

  // Update user information
  updateUser(userId, newData, callback) {
    this.getUserById(userId, (err, row) => {
      // Check username and email format
      const usernameRegex = /^[a-zA-Z0-9_]{7,21}$/; // Username must be 7 to 21 characters and can only contain letters, numbers, and underscores
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/; // Password format

      let errors = [];

      if ("username" in newData && !usernameRegex.test(newData.username)) {
        errors.push(1); // Invalid username format
      }

      if ("email" in newData && !emailRegex.test(newData.email)) {
        errors.push(2); // Invalid email format
      }

      if (!passwordRegex.test(newData.password)) {
        errors.push(3); // Invalid password format
      }

      newData.username = newData.username.toLowerCase();
      newData.email = newData.email.toLowerCase();

      const hash = crypto.createHash("sha256");
      hash.update(
        userId +
          newData.username +
          newData.email +
          newData.password +
          row.banned
      );
      newData.hash = hash.digest("hex");

      // Check if username and email already exist
      if ("username" in newData) {
        db.get(
          "SELECT * FROM users WHERE username = ? AND id != ?",
          [newData.username.toLowerCase(), userId],
          (err, rowUsername) => {
            if (rowUsername) {
              errors.push(4); // Username already exists
            }

            if ("email" in newData) {
              db.get(
                "SELECT * FROM users WHERE email = ? AND id != ?",
                [newData.email.toLowerCase(), userId],
                (err, rowEmail) => {
                  if (rowEmail) {
                    errors.push(5); // Email already exists
                  }

                  if (errors.length > 0) {
                    callback(errors);
                  } else {
                    const updateFields = Object.keys(newData)
                      .map((field) => `${field} = ?`)
                      .join(", ");
                    const updateValues = Object.values(newData);
                    updateValues.push(userId);

                    db.run(
                      `UPDATE users SET ${updateFields} WHERE id = ?`,
                      updateValues,
                      (err) => {
                        if (err) {
                          errors.push(6); // Unknown error
                          callback(errors);
                        } else {
                          callback([0]); // Update successful
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  }

  // Reset user password
  resetPassword(identifier, newPassword, callback) {
    let errors = [];
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/; // Password format
    if (!passwordRegex.test(newPassword)) {
      errors.push(2); // Invalid password format
    }
    // Update the user's password in the database based on email or username
    this.getUser(identifier, (err, row) => {
      const hash = crypto.createHash("sha256");
      hash.update(row.id + row.username + row.email + newPassword + row.banned);
      const newHash = hash.digest("hex");
      db.run(
        "UPDATE users SET password = ?, hash = ? WHERE email = ? OR username = ?",
        [newPassword, newHash, identifier, identifier],
        function (err) {
          if (err) {
            errors.push(3);
          } else {
            // Check if any rows were affected (indicating a successful update)
            if (this.changes > 0) {
              errors.push(0);
            } else {
              errors.push(1); // User with the given email or username not found
            }
          }
          callback(errors);
        }
      );
    });
  }

  // Get user information by email or username
  getUser(identifier, callback) {
    db.get(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [identifier, identifier],
      (err, row) => {
        if (err) {
          callback(err);
        } else {
          callback(null, row);
        }
      }
    );
  }

  // Get user information by user ID
  getUserById(userId, callback) {
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        callback(err);
      } else {
        callback(null, row);
      }
    });
  }

  // Generate a 6-character lowercase alphanumeric string
  generateId() {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // Get all users
  getAllUsers(callback) {
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }

    db.all("SELECT * FROM users", (err, rows) => {
      callback(err, rows);
    });
  }

  initialize(callback) {
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, email TEXT, password TEXT, banned BOOLEAN DEFAULT 0)"
      );
      callback();
    });
  }

  // Close database connection
  close() {
    db.close();
    return true;
  }
}

// Export Auth object
module.exports = new Auth();
