const config = require(`./config.js`);
const Auth = require(`${config.db.auth}/auth.js`);

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const PAGE_SIZE = 5;

function addUser() {
    rl.question('Enter username: ', (username) => {
        rl.question('Enter email: ', (email) => {
            rl.question('Enter password: ', (password) => {
                Auth.register(username, email, password, (code, userId) => {
                    if (code.includes(0)) {
                        console.log('User added successfully! UserID:', userId);
                    }
                    if (code.includes(1)) {
                        console.error('Invalid username format.');
                    }
                    if (code.includes(2)) {
                        console.error('Invalid email format.');
                    }
                    if (code.includes(3)) {
                        console.error('Invalid password format.');
                    }
                    if (code.includes(4)) {
                        console.error('Username already exists.');
                    }
                    if (code.includes(5)) {
                        console.error('Email already exists.');
                    }
                    if (code.includes(6)) {
                        console.error('Unknown error occurred.');
                    }
                    mainMenu();
                });
            });
        });
    });
}

function listUsers(page) {
    const offset = (page - 1) * PAGE_SIZE;
    Auth.getAllUsers((err, users) => {
        if (err) {
            console.error('Error listing users:', err.message);
        } else {
            console.log('\n=== User List ===');
            console.table(users.slice(offset, offset + PAGE_SIZE));
        }
        mainMenu();
    });
}

function findUser() {
    rl.question('Enter username or email to search: ', (searchTerm) => {
        Auth.getAllUsers((err, users) => {
            if (err) {
                console.error('Error finding user:', err.message);
            } else {
                const filteredUsers = users.filter(user =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
                console.log(filteredUsers.length > 0 ? 'User(s) found:' : 'User not found');
                console.table(filteredUsers);
            }
            mainMenu();
        });
    });
}

function updateUser() {
    rl.question('Enter user ID to update: ', (userId) => {
        // Check if the user exists
        Auth.getAllUsers((err, users) => {
            const userExists = users.some(user => user.id === userId);
            if (!userExists) {
                console.error('User not found!');
                mainMenu();
                return;
            }

            // Prompt for new information
            rl.question('Enter new username: ', (newUsername) => {
                rl.question('Enter new email: ', (newEmail) => {
                    rl.question('Enter new password: ', (newPassword) => {
                        // Prepare an object with the updated information
                        const updatedInfo = {};
                        if (newUsername) updatedInfo.username = newUsername;
                        if (newEmail) updatedInfo.email = newEmail;
                        if (newPassword) updatedInfo.password = newPassword;

                        // Update the user
                        Auth.updateUser(userId, updatedInfo, (code) => {
                            if (code.includes(0)) {
                                console.log('User added successfully! UserID:', userId);
                            }
                            if (code.includes(1)) {
                                console.error('Invalid username format.');
                            }
                            if (code.includes(2)) {
                                console.error('Invalid email format.');
                            }
                            if (code.includes(3)) {
                                console.error('Invalid password format.');
                            }
                            if (code.includes(4)) {
                                console.error('Username already exists.');
                            }
                            if (code.includes(5)) {
                                console.error('Email already exists.');
                            }
                            if (code.includes(6)) {
                                console.error('Unknown error occurred.');
                            }
                            mainMenu();
                        });
                    });
                });
            });
        });
    });
}

function deleteUser() {
    rl.question('Enter user ID to delete: ', (userId) => {
        // Check if the user exists
        Auth.getAllUsers((err, users) => {
            const userExists = users.some(user => user.id === userId);
            if (!userExists) {
                console.error('User not found!');
                mainMenu();
                return;
            }

            Auth.deleteUser(userId, (code) => {
                if (code.includes(0)) {
                    console.log('User deleted successfully!');
                } else if (code.includes(1)) {
                    console.error('Deletion failed.');
                }
                mainMenu();
            });
        });
    });
}

function banUser() {
    rl.question('Enter user ID to ban/unban: ', (userId) => {
        // Check if the user exists
        Auth.getAllUsers((err, users) => {
            const userExists = users.some(user => user.id === userId);
            if (!userExists) {
                console.error('User not found!');
                mainMenu();
                return;
            }

            rl.question('Ban user/Un-Ban user (true/false): ', (isBanned) => {
                Auth.banUser(userId, isBanned === 'true', (code) => {
                    if (code.includes(0)) {
                        console.log('User ban status updated successfully!');
                    } else if (code.includes(1)) {
                        console.error('Ban/Unban operation failed.');
                    }
                    mainMenu();
                });
            });
        });
    });
}

function mainMenu() {
    console.log('\n=== User Management ===');
    console.log('1. Add User');
    console.log('2. List Users');
    console.log('3. Find User');
    console.log('4. Update User');
    console.log('5. Delete User');
    console.log('6. Ban/Unban User');
    console.log('7. Exit');

    rl.question('Select an option: ', (option) => {
        switch (option) {
            case '1':
                addUser();
                break;
            case '2':
                rl.question('Enter page number: ', (page) => listUsers(page));
                break;
            case '3':
                findUser();
                break;
            case '4':
                updateUser();
                break;
            case '5':
                deleteUser();
                break;
            case '6':
                banUser();
                break;
            case '7':
                rl.close();
                break;
            default:
                console.log('Invalid option. Try again.');
                mainMenu();
                break;
        }
    });
}

// Initialize Auth and start the main menu
Auth.initialize(() => {
    mainMenu();
});

rl.on('close', () => {
    console.log('Exiting User Management Program.');
    Auth.close();
    process.exit(0);
});
