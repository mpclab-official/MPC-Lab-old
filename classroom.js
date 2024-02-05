// classroom.js
// This is a database file that contains the code for the classroom system.

// Load config file
const config = require(`${__dirname}/config.js`);

// Load fs module
const fs = require("fs");

// Extract the directory path from the database path
const dbDirectory = `${config.db.classroom.replace(/\/[^/]+$/, "")}`;

// Create the directory if it doesn't exist
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

// Import sqlite3 module
const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database(`${config.db.classroom}`);

class Classroom {
  constructor() {
    // Create the database if it doesn't exist
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS classroom (id TEXT PRIMARY KEY, name TEXT, name_formal TEXT, email TEXT, phone TEXT, address TEXT, city TEXT, state TEXT, zip TEXT, country TEXT, website TEXT, logo TEXT, description TEXT, status TEXT, created TEXT, peoples Integer, people_limit Integer, tasks TEXT DEFAULT '[]')"
      );
    });
  }

  // Create a new classroom
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
    people_limit
  ) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO classroom (id ,name, name_formal, email, phone, address, city, state, zip, country, website, logo, description, status, created, peoples, people_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          people_limit,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            db.run(
              "CREATE TABLE IF NOT EXISTS class_" +
                id +
                "_peoples (id TEXT PRIMARY KEY, role TEXT, joined BOOLEAN)",
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  db.run(
                    "CREATE TABLE IF NOT EXISTS class_" +
                      id +
                      "_tasks (id TEXT PRIMARY KEY, title TEXT, description TEXT, start TEXT, due TEXT, type TEXT, status TEXT, created TEXT, mpctaskjson TEXT)",
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

  // Get a classroom by ID
  getClassroomById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM classroom WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get a classroom by name
  getClassroomByName(name) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM classroom WHERE name_formal = ?",
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

  // Generate a new task ID
  generateNewTaskId(classroom_id) {
    return new Promise((resolve, reject) => {
      let id =
        Math.random().toString(36).substr(2, 15) +
        Math.random().toString(36).substr(2, 15);
      db.get(
        "SELECT * FROM classroom_" + classroom_id + "_tasks",
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            let tasks = [];
            for (let i = 0; i < row.length; i++) {
              tasks.push(row[i].id);
            }
            if (tasks.indexOf(id) != -1) {
              resolve(this.generateNewTaskId(classroom_id));
            } else {
              resolve(id);
            }
          }
        }
      );
    });
  }

  // New task
  newTask(id, title, description, start, due, type, status, mpctaskjson) {
    return new Promise((resolve, reject) => {
      this.getClassroomById(id)
        .then((classroom) => {
          let tasks = JSON.parse(classroom.tasks);
          let task_id = this.generateNewTaskId(id);
          tasks.push(task_id);
          if (classroom) {
            db.run(
              "INSERT INTO class_" +
                id +
                "_tasks" +
                " (id, title, description, start, due, type, status, created, mpctaskjson) VALUES (?, ?, ? ,?, ?, ?, ?, ?, ?)",
              [
                task_id,
                title,
                description,
                start,
                due,
                type,
                status,
                new Date().toISOString(),
                mpctaskjson,
              ]
            );
            this.getClassroomPeoples(id).then((peoples) => {
              db.run(
                "CREATE TABLE IF NOT EXISTS class_" +
                  id +
                  "_task_" +
                  task_id +
                  " (id TEXT PRIMARY KEY, status TEXT, view TEXT, finish TEXT, ansers TEXT, score INTEGER)"
              );
              for (let i = 0; i < peoples.length; i++) {
                db.run(
                  "INSERT INTO class_" +
                    id +
                    "_task_" +
                    task_id +
                    " (id, status, view, finish, ansers, score) VALUES (?, ?, ?, ?, ?, ?)",
                  [
                    peoples[i].id,
                    "not_started",
                    "not_viewed",
                    "not_finished",
                    "[]",
                    0,
                  ],
                  function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  }
                );
              }
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Get paginated classrooms
  getClassrooms(page, pageSize) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM classroom LIMIT ? OFFSET ?",
        [pageSize, (page - 1) * pageSize],
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

  // Get classrooms by user ID
  getClassroomsByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM classroom", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          let classrooms = rows;
          let result = [];
          if (classrooms.length == 0) resolve(result);
          for (let i = 0; i < classrooms.length; i++) {
            db.all(
              "SELECT * FROM class_" + classrooms[0].id + "_peoples",
              (err, rows) => {
                if (err) {
                  reject(err);
                } else {
                  for (let j = 0; j < rows.length; j++) {
                    if (rows[j].id == user_id) {
                      result.push({
                        classroom: classrooms[i],
                        role: rows[j].role,
                        joined: rows[j].joined,
                      });
                    }
                    if (i == classrooms.length - 1) {
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

  // Get the classroom peopels
  getClassroomPeoples(id) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM class_" + id + "_peoples ORDER BY joined DESC",
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

  // Add a people to a classroom
  addPeople(id, people_id, role, joined) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO class_" +
          id +
          "_peoples (id, role, joined) VALUES (?, ?, ?)",
        [people_id, role, joined],
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

  // Remove a people from a classroom
  removePeople(id, people_id) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM class_" + id + "_peoples WHERE id = ?",
        [people_id],
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

  // Delete a classroom
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM classroom WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          db.run("DROP TABLE class_" + id + "_peoples");
          resolve();
        }
      });
    });
  }

  // Get the classroom count
  getClassroomCount() {
    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) FROM classroom", (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row["COUNT(*)"]);
        }
      });
    });
  }

  // Change classroom status
  changeStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET status = ? WHERE id = ?",
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

  // Change classroom name_formal
  changeNameFormal(id, name_formal) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET name_formal = ? WHERE id = ?",
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

  // Change classroom name
  changeName(id, name) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET name = ? WHERE id = ?",
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

  // Change classroom email
  changeEmail(id, email) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET email = ? WHERE id = ?",
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

  // Change classroom phone
  changePhone(id, phone) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET phone = ? WHERE id = ?",
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

  // Change classroom Address
  changeAddress(id, address, city, state, zip, country) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET address = ?, city = ?, state = ?, zip = ?, country = ? WHERE id = ?",
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

  // Change classroom website
  changeWebsite(id, website) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET website = ? WHERE id = ?",
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

  // Change classroom logo
  changeLogo(id, logo) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET logo = ? WHERE id = ?",
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

  // Change classroom description
  changeDescription(id, description) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE classroom SET description = ? WHERE id = ?",
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

  // Generate a new classroom ID
  generateNewId() {
    return new Promise((resolve, reject) => {
      let id = Math.random().toString(36).substr(2, 8);
      db.get("SELECT * FROM classroom WHERE id = ?", [id], (err, row) => {
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

  // Create a new classroom
  createClassroom(
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
    people_limit
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
      this.getClassroomByName(name_formal).then((classroom) => {
        if (classroom) {
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
              people_limit
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

  // Join a classroom
  joinClassroom(id, people_id, role, joined) {
    return new Promise((resolve, reject) => {
      this.getClassroomById(id)
        .then((classroom) => {
          if (classroom) {
            if (classroom.status == "active") {
              this.getClassroomPeoples(id)
                .then((peoples) => {
                  for (let i = 0; i < peoples.length; i++) {
                    if (peoples[i].id == people_id) {
                      reject("already_joined");
                      return;
                    }
                  }
                  this.addPeople(id, people_id, role, joined)
                    .then(() => {
                      resolve(classroom.name_formal);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject("classroom_inactive");
            }
          } else {
            reject("classroom_not_exist");
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

module.exports = new Classroom();
