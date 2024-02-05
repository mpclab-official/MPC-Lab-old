// auth.js
// This is a module file that contains the code for the authentication.

// Function to mark input fields as invalid and display error messages
function markInvalidInput(inputElement, errorMessage) {
  let newNode = document.createElement("span");
  newNode.innerHTML += `• ${errorMessage} </br>`;
  newNode.className = "errorMessage";
  let parentDiv = inputElement.parentNode;
  parentDiv.insertBefore(newNode, inputElement);
}

// Function to mark input fields with a message
function markInput(inputElement, message) {
  let newNode = document.createElement("span");
  newNode.innerHTML += `• ${message} </br>`;
  newNode.className = "message";
  let parentDiv = inputElement.parentNode;
  parentDiv.insertBefore(newNode, inputElement);
}

// Function to reset input fields as invalid and remove error messages
function resetInvalidInput() {
  let errorMessage = document.getElementsByClassName("errorMessage");
  for (let i = errorMessage.length - 1; i >= 0; i--) {
    errorMessage[i].remove();
  }
}

// Function to submit login form
function submitLoginForm() {
  resetInvalidInput();

  const username =
    document.getElementById("loginForm").elements["username"].value;
  const password =
    document.getElementById("loginForm").elements["password"].value;

  fetch(`/${languageCode}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((json) => {
      if (json.code.includes(0)) {
        const params = new URLSearchParams(window.location.search);
        const targeturl = params.get("targeturl");
        if (targeturl) window.location = targeturl;
        else location.reload();
      } else if (json.code.includes(1)) {
        markInvalidInput(
          document.getElementById("loginForm").elements["username"],
          json.messages[1]
        );
        markInvalidInput(
          document.getElementById("loginForm").elements["password"],
          json.messages[1]
        );
      } else if (json.code.includes(2)) {
        markInvalidInput(
          document.getElementById("loginForm").elements["username"],
          json.messages[2]
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Function to submit register form
function submitRegisterForm() {
  resetInvalidInput();

  const username = form.elements["username"].value;
  const email = form.elements["email"].value;
  const verification_code = form.elements["verification_code"].value;
  const password = form.elements["password"].value;

  fetch(`/${languageCode}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      verification_code,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    })
    .then((json) => {
      if (json.code.includes(0)) {
        location.reload();
      }
      if (json.code.includes(1)) {
        markInvalidInput(form.elements["username"], json.messages[1]);
      }
      if (json.code.includes(2)) {
        markInvalidInput(form.elements["email"], json.messages[2]);
      }
      if (json.code.includes(3)) {
        markInvalidInput(form.elements["password"], json.messages[3]);
      }
      if (json.code.includes(4)) {
        markInvalidInput(form.elements["username"], json.messages[4]);
      }
      if (json.code.includes(5)) {
        markInvalidInput(form.elements["email"], json.messages[5]);
      }
      if (json.code.includes(6)) {
        markInvalidInput(form.elements["password"], json.messages[6]);
      }
      if (json.code.includes(7)) {
        markInvalidInput(form.elements["verification_code"], json.messages[7]);
      }
      if (json.code.includes(8)) {
        markInvalidInput(form.elements["verification_code"], json.messages[8]);
      }
      if (json.code.includes(9)) {
        markInvalidInput(form.elements["verification_code"], json.messages[9]);
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Function to submit reset password form
function submitResetPasswordForm() {
  resetInvalidInput();

  const email = document.getElementById("forget_passwordForm").elements["email"]
    .value;
  const verification_code = document.getElementById("forget_passwordForm")
    .elements["verification_code"].value;
  const password = document.getElementById("forget_passwordForm").elements[
    "password"
  ].value;

  fetch(`/${languageCode}/forget-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      verification_code,
      password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed");
      }
      return response.json();
    })
    .then((json) => {
      if (json.code.includes(0)) {
        pageMessage(true, json.messages[0], 8000);
        setTimeout(() => {
          window.location = `/${languageCode}/login`;
        }, 2000);
      }
      if (json.code.includes(1)) {
        markInvalidInput(form.elements["email"], json.messages[1]);
      }
      if (json.code.includes(2)) {
        markInvalidInput(form.elements["password"], json.messages[2]);
      }
      if (json.code.includes(3)) {
        console.log(json.messages[3]);
      }
      if (json.code.includes(4)) {
        markInvalidInput(form.elements["verification_code"], json.messages[4]);
      }
      if (json.code.includes(5)) {
        markInvalidInput(form.elements["verification_code"], json.messages[5]);
      }
      if (json.code.includes(6)) {
        markInvalidInput(form.elements["verification_code"], json.messages[6]);
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Function to submit verification code
function submitVerificationCode() {
  let email;
  email = form.elements["email"].value;
  if (email) {
    fetch(`/${languageCode}/verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((json) => {
        if (json.code.includes(0)) {
          markInput(form.elements["verification_code"], json.messages[0]);
        } else if (json.code.includes(1)) {
          markInvalidInput(
            form.elements["verification_code"],
            json.messages[1]
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    var repeat = 100;
    var text = document.getElementsByClassName("get-verification-code")[0]
      .innerHTML;
    var timer = setInterval(function () {
      if (repeat == 0) {
        document.getElementsByClassName("get-verification-code")[0].innerHTML =
          text;
        document.getElementsByClassName("get-verification-code")[0].onclick =
          submitVerificationCode;
        clearInterval(timer);
      } else {
        repeat--;
        document.getElementsByClassName("get-verification-code")[0].innerHTML =
          repeat;
        document.getElementsByClassName("get-verification-code")[0].onclick =
          null;
      }
    }, 1000);
  } else {
    markInvalidInput(
      form.elements["email"],
      form.elements["email"].dataset.lan_auth_register_empty_email
    );
  }
}

let form;
window.onload = () => {
  form = document.getElementById("registerForm");
  if (!form) form = document.getElementById("forget_passwordForm");
};
