// user-daily-check-in.js
// This is a module that contains the code for the user daily check in.

window.addEventListener("load", function () {
  const last_check_in_date = localStorage.getItem(
    "user-daily-check-in-last-check-in-date"
  );
  if (last_check_in_date === new Date().toDateString()) {
    document.getElementById("check_in").style.display = "none";
    document.getElementById("checked_in").style.display = "block";
    document.getElementById("check_in_successfully").style.display = "none";
  }
  document.getElementById("check_in")?.addEventListener("click", function () {
    fetch(`/api/user-daily-check-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed");
        }
        // If successful, redirect or perform other actions
        return response.json(); // This returns a Promise
      })
      .then((json) => {
        if (json.code.includes(0)) {
          // success
          document.getElementById("check_in").style.display = "none";
          document.getElementById("checked_in").style.display = "none";
          document.getElementById("check_in_successfully").style.display =
            "block";
          document.getElementById("check_in_successfully").dataset.coins +=
            json.coins;
          pageMessage(
            true,
            document.getElementById("check_in_successfully").dataset.coins,
            3000
          );
          localStorage.setItem(
            "user-daily-check-in-last-check-in-date",
            new Date().toDateString()
          );
        } else if (json.code.includes(1)) {
          // user already checked in today
          console.log("Already checked in today");
          document.getElementById("check_in").style.display = "none";
          document.getElementById("checked_in").style.display = "block";
          document.getElementById("check_in_successfully").style.display =
            "none";
          localStorage.setItem(
            "user-daily-check-in-last-check-in-date",
            new Date().toDateString()
          );
        } else if (json.code.includes(-1)) {
          // internal server error
          console.log("failed...");
        } else {
          // unknown error
          console.log("unknown error...");
        }
      })
      .catch((error) => {
        // Handle errors, display error messages, etc.
        console.error("Error:", error.message);
      });
  });
});
