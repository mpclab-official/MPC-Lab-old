let userSetup = new Object();
let UserData = new Object();

function startSetup() {

    function fadeIn(e) {
        e.style.display = "block";
        setTimeout(function () {
            e.style.opacity = 1;
        }, 100);
    }

    function fadeOut(e) {
        e.style.opacity = 0;
        setTimeout(function () {
            e.style.display = 'none';
        }, 500);
    }

    function userNameTest(tester) {
        const regex = /^[^\s].{0,20}[^\s]$/u;
        return regex.test(tester);
    }

    fadeIn(userSetup.userName);

    userSetup.userName.getElementsByTagName("button")[0].addEventListener("click", () => {
        if (userNameTest(userSetup.userName.getElementsByTagName("input")[0].value)) {
            UserData.userName = userSetup.userName.getElementsByTagName("input")[0].value;
            fadeOut(userSetup.userName);
            setTimeout(() => {
                fadeIn(userSetup.userGender);
                userSetup.userGender.getElementsByTagName("button")[0].addEventListener("click", () => {
                    let selectIndex = userSetup.userGender.getElementsByTagName("select")[0].selectedIndex;
                    let selectValue = userSetup.userGender.getElementsByTagName("select")[0].options[selectIndex].value;
                    UserData.userGender = selectValue;
                    fadeOut(userSetup.userGender);
                    setTimeout(() => {
                        fadeIn(userSetup.userLanguage);
                        userSetup.userLanguage.getElementsByTagName("button")[0].addEventListener("click", () => {
                            selectIndex = userSetup.userLanguage.getElementsByTagName("select")[0].selectedIndex;
                            selectValue = userSetup.userLanguage.getElementsByTagName("select")[0].options[selectIndex].value;
                            UserData.userLanguage = selectValue;
                            fadeOut(userSetup.userLanguage);
                            setTimeout(() => {
                                fadeIn(userSetup.userEducated);
                                userSetup.userEducated.getElementsByTagName("button")[0].addEventListener("click", () => {
                                    selectIndex = userSetup.userEducated.getElementsByTagName("select")[0].selectedIndex;
                                    selectValue = userSetup.userEducated.getElementsByTagName("select")[0].options[selectIndex].value;
                                    UserData.userEducated = selectValue;
                                    fadeOut(userSetup.userEducated);
                                    setTimeout(() => {
                                        fadeIn(userSetup.userAge);
                                        userSetup.userAge.getElementsByTagName("button")[0].addEventListener("click", () => {
                                            const userDateOfBirth = userSetup.userAge.getElementsByTagName("input")[0].value;
                                            if (userDateOfBirth) {
                                                UserData.userAge = userDateOfBirth;
                                                fadeOut(userSetup.userAge);
                                                setTimeout(() => {
                                                    fadeIn(userSetup.userBio);
                                                    userSetup.userBio.getElementsByTagName("button")[0].addEventListener("click", () => {
                                                        const userBio = userSetup.userBio.getElementsByTagName("textarea")[0].value;
                                                        UserData.userBio = userBio;
                                                        fadeOut(userSetup.userBio);
                                                        setTimeout(() => {
                                                            fadeIn(userSetup.userAvatar);
                                                            userSetup.userAvatar.getElementsByTagName("button")[0].addEventListener("click", () => {
                                                                const avatarInput = userSetup.userAvatar.getElementsByTagName("input")[0];
                                                                const file = avatarInput.files[0];

                                                                if (file) {
                                                                    const img = new Image();

                                                                    img.onload = function () {
                                                                        const width = img.width;
                                                                        const height = img.height;

                                                                        if (width > 0 && height > 0) {
                                                                            if (file.size <= 5 * 1024 * 1024) {
                                                                                const reader = new FileReader();

                                                                                reader.onload = function (e) {
                                                                                    const base64Data = e.target.result;

                                                                                    UserData.userAvatar = base64Data;
                                                                                    fadeOut(userSetup.userAvatar);

                                                                                    UserData.colorTheme = "light";

                                                                                    UserData.following = new Array();
                                                                                    UserData.followers = new Array();

                                                                                    UserData.Blog = new Object();
                                                                                    UserData.Blog.articles = new Array();
                                                                                    UserData.Blog.stars = new Array();

                                                                                    UserData.interest = new Array();

                                                                                    sendData();
                                                                                };

                                                                                reader.readAsDataURL(file);
                                                                            } else {
                                                                                alert('File size exceeds the maximum allowed size (5 MB).');
                                                                            }
                                                                        } else {
                                                                            alert('Invalid image file.');
                                                                        }
                                                                    };

                                                                    img.src = URL.createObjectURL(file);
                                                                } else {
                                                                    alert('Please select a file.');
                                                                }
                                                            });
                                                        }, 500);
                                                    });
                                                }, 500);
                                            } else {

                                            }
                                        });
                                    }, 500);
                                });
                            }, 500);
                        });
                    }, 500);
                });
            }, 500);
        } else {

        }
    });

}

function sendData() {
    fetch(`/${languageCode}/user-setup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            UserData
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('failed');
            }
            // If successful, redirect or perform other actions
            return response.json(); // This returns a Promise
        })
        .then(json => {
            if (json.code.includes(0)) {
                console.log("Good!");
                location.reload();
            } else if (json.code.includes(1)) {
                console.log("failed...");
            }
        })
        .catch(error => {
            // Handle errors, display error messages, etc.
            console.error('Error:', error.message);
        });
}

window.onload = () => {
    userSetup = {
        userName: document.getElementById("user-name"),
        userGender: document.getElementById("user-gender"),
        userLanguage: document.getElementById("user-language"),
        userEducated: document.getElementById("user-educated"),
        userAge: document.getElementById("user-age"),
        userBio: document.getElementById("user-bio"),
        userAvatar: document.getElementById("user-avatar")
    }
    startSetup();
}