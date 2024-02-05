// enterprise.js
// This is a database file that contains the code for the enterprise system.

// Load config file
const config = require(`${__dirname}/config.js`);

// Load fs module
const fs = require("fs");

// Extract the directory path from the database path
const dbDirectory = `${config.db.enterprise.replace(/\/[^/]+$/, "")}`;

// Create the directory if it doesn't exist
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

// Import sqlite3 module
const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database(`${config.db.enterprise}`);

class Enterprise {
  constructor() {
    // Create the database if it doesn't exist
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS enterprise (id TEXT PRIMARY KEY, name TEXT, name_formal TEXT, email TEXT, phone TEXT, address TEXT, city TEXT, state TEXT, zip TEXT, country TEXT, website TEXT, logo TEXT, description TEXT, status TEXT, created TEXT, peoples Integer, peoples_limit Integer, classes Integer, classes_limit Integer)"
      );
    });
  }

  // Create a new enterprise
  create(
    id,
    name,
    name_formal,
    email,
    phone,
    address,
    city,
    state,
    zip,
    country,
    website,
    logo,
    description,
    status,
    created,
    peoples,
    peoples_limit,
    classes,
    classes_limit
  ) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO enterprise (id ,name, name_formal, email, phone, address, city, state, zip, country, website, logo, description, status, created, peoples, peoples_limit, classes, classes_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          name,
          name_formal,
          email,
          phone,
          address,
          city,
          state,
          zip,
          country,
          website,
          logo,
          description,
          status,
          created,
          peoples,
          peoples_limit,
          classes,
          classes_limit,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            db.run(
              "create table if not exists enterprise_" +
                id +
                "_peoples (id TEXT PRIMARY KEY, role TEXT, joined BOOLEAN)",
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  db.run(
                    "create table if not exists enterprise_" +
                      id +
                      "_classes (id TEXT PRIMARY KEY)",
                    (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(id);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  }

  // Get a enterprise by ID
  getEnterpriseById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM enterprise WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get a enterprise by name
  getEnterpriseByName(name) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM enterprise WHERE name_formal = ?",
        [name],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  // Get paginated enterprises
  getPaginatedEnterprises(page, pageSize) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM enterprise ORDER BY id LIMIT ?, ?",
        [(page - 1) * pageSize, pageSize],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Get enterprise by user ID
  getEnterprisesByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM enterprise", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          let enterprise = rows;
          let result = [];
          if (enterprise.length == 0) resolve(result);
          for (let i = 0; i < enterprise.length; i++) {
            db.all(
              "SELECT * FROM enterprise_" + enterprise[0].id + "_peoples",
              (err, rows) => {
                if (err) {
                  reject(err);
                } else {
                  for (let i = 0; i < rows.length; i++) {
                    if (rows[i].id == user_id) {
                      result.push({
                        enterprise: enterprise[i],
                        role: rows[i].role,
                        joined: rows[i].joined,
                      });
                    }
                    if (i == enterprise.length - 1) {
                      resolve(result);
                    }
                  }
                }
              }
            );
          }
        }
      });
    });
  }

  // Get enterprise peopels
  getEnterprisePeoples(id) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM enterprise_" + id + "_peoples ORDER BY joined DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Create a new class to a enterprise
  createClass(id, class_id) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO enterprise_" + id + "_classes (id) VALUES (?)",
        [class_id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(id);
          }
        }
      );
    });
  }

  // Remove a class from a enterprise
  removeClass(id, class_id) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM enterprise_" + id + "_classes WHERE id = ?",
        [class_id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Add a people to a enterprise
  addPeople(id, people_id, role, joined) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO enterprise_" +
          id +
          "_peoples (id, role, joined) VALUES (?, ?, ?)",
        [people_id, role, joined],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(id);
          }
        }
      );
    });
  }

  // Remove a people from a enterprise
  removePeople(id, people_id) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM enterprise_" + id + "_peoples WHERE id = ?",
        [people_id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Delete a enterprise
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM enterprise WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          db.run("DROP TABLE enterprise_" + id + "_peoples");
          db.run("DROP TABLE enterprise_" + id + "_classes");
          resolve();
        }
      });
    });
  }

  // Get the enterprise count
  getCount() {
    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) FROM enterprise", (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row["COUNT(*)"]);
        }
      });
    });
  }

  // Get the enterprise peoples count
  getPeoplesCount(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT COUNT(*) FROM enterprise_" + id + "_peoples",
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row["COUNT(*)"]);
          }
        }
      );
    });
  }

  // Get the enterprise classes count
  getClassesCount(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT COUNT(*) FROM enterprise_" + id + "_classes",
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row["COUNT(*)"]);
          }
        }
      );
    });
  }

  // Change enterprise status
  changeStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise name_formal
  changeNameFormal(id, name_formal) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET name_formal = ? WHERE id = ?",
        [name_formal, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise name
  changeName(id, name) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET name = ? WHERE id = ?",
        [name, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise email
  changeEmail(id, email) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET email = ? WHERE id = ?",
        [email, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise phone
  changePhone(id, phone) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET phone = ? WHERE id = ?",
        [phone, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise address
  changeAddress(id, address, city, state, zip, country) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET address = ?, city = ?, state = ?, zip = ?, country = ? WHERE id = ?",
        [address, city, state, zip, country, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise website
  changeWebsite(id, website) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET website = ? WHERE id = ?",
        [website, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise logo
  changeLogo(id, logo) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET logo = ? WHERE id = ?",
        [logo, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise description
  changeDescription(id, description) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET description = ? WHERE id = ?",
        [description, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise peoples limit
  changePeoplesLimit(id, peoples_limit) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET peoples_limit = ? WHERE id = ?",
        [peoples_limit, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Change enterprise classes limit
  changeClassesLimit(id, classes_limit) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE enterprise SET classes_limit = ? WHERE id = ?",
        [classes_limit, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Get the enterprise peoples limit
  getPeoplesLimit(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT peoples_limit FROM enterprise WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.peoples_limit);
          }
        }
      );
    });
  }

  // Get the enterprise classes limit
  getClassesLimit(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT classes_limit FROM enterprise WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.classes_limit);
          }
        }
      );
    });
  }

  // Get the enterprise peoples
  getPeoples(id) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM enterprise_" + id + "_peoples ORDER BY joined DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Get the enterprise classes
  getClasses(id) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM enterprise_" + id + "_classes ORDER BY id DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Generate a new enterprise ID
  generateNewId() {
    return new Promise((resolve, reject) => {
      let id = Math.random().toString(36).substr(2, 6);
      db.get("SELECT * FROM enterprise WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(this.generateNewId());
          } else {
            resolve(id);
          }
        }
      });
    });
  }

  // Create a new enterprise
  createEnterprise(
    name,
    name_formal,
    email,
    phone,
    address,
    city,
    state,
    zip,
    country,
    website,
    logo,
    description,
    status,
    peoples,
    peoples_limit
  ) {
    return new Promise((resolve, reject) => {
      let errors = [];
      const usernameFormalRegex = /^[a-zA-Z0-9_]{7,21}$/;
      function userNameTest(tester) {
        if (tester[0] == " " || tester[tester.length - 1] == " ") return false;
        return true;
      }
      if (!userNameTest(name)) {
        errors.push("name_invalid");
      }
      if (name.length > 40) {
        errors.push("name_too_long");
      }
      if (name.length < 6) {
        errors.push("name_too_short");
      }
      if (!usernameFormalRegex.test(name_formal)) {
        errors.push("name_formal_invalid");
      }
      if (name_formal.length > 40) {
        errors.push("name_formal_too_long");
      }
      if (name_formal.length < 8) {
        errors.push("name_formal_too_short");
      }
      this.getEnterpriseByName(name_formal).then((enterprise) => {
        if (enterprise) {
          errors.push("name_formal_already_exist");
        }
        function isEmail(email) {
          var regex =
            /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          return regex.test(email);
        }
        if (!isEmail(email)) {
          errors.push("email_invalid");
        }
        if (phone.length > 20) {
          errors.push("phone_too_long");
        }
        /*if (phone.length < 6) {
          errors.push("phone_too_short");
        }*/ //Not required
        if (address.length > 100) {
          errors.push("address_too_long");
        }
        if (address.length < 6) {
          errors.push("address_too_short");
        }
        if (city.length > 40) {
          errors.push("city_too_long");
        }
        if (city.length < 2) {
          errors.push("city_too_short");
        }
        if (state.length > 40) {
          errors.push("state_too_long");
        }
        if (state.length < 2) {
          errors.push("state_too_short");
        }
        if (zip.length > 20) {
          errors.push("zip_too_long");
        }
        if (zip.length < 2) {
          errors.push("zip_too_short");
        }
        if (country.length > 40) {
          errors.push("country_too_long");
        }
        if (country.length < 2) {
          errors.push("country_too_short");
        }
        if (website.length > 100) {
          errors.push("website_too_long");
        }
        /*if (website.length < 6) {
          errors.push("website_too_short");
        }*/ //Not required
        if (description.length > 1000) {
          errors.push("description_too_long");
        }
        if (description.length < 6) {
          errors.push("description_too_short");
        }
        if (status != "active" && status != "inactive") {
          errors.push("status_invalid");
        }
        if (errors.length == 0) {
          this.generateNewId().then((id) => {
            this.create(
              id,
              name,
              name_formal,
              email,
              phone,
              address,
              city,
              state,
              zip,
              country,
              website,
              logo,
              description,
              status,
              new Date().toISOString(),
              peoples,
              peoples_limit,
              0,
              1000
            )
              .then(() => {
                resolve(id);
              })
              .catch((err) => {
                reject(err);
              });
          });
        } else {
          reject(errors);
        }
      });
    });
  }

  // Join a enterprise
  joinEnterprise(id, people_id, role, joined) {
    return new Promise((resolve, reject) => {
      this.getEnterpriseById(id)
        .then((enterprise) => {
          if (enterprise) {
            if (enterprise.status == "active") {
              this.getEnterprisePeoples(id)
                .then((peoples) => {
                  for (let i = 0; i < peoples.length; i++) {
                    if (peoples[i].id == people_id) {
                      reject("already_joined");
                      return;
                    }
                  }
                  this.addPeople(id, people_id, role, joined)
                    .then(() => {
                      resolve(enterprise.name_formal);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject("enterprise_inactive");
            }
          } else {
            reject("enterprise_not_exist");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Close database connection
  close() {
    db.close();
    return true;
  }
}

module.exports = new Enterprise();
