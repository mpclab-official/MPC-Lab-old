// follow-unfollow.js
// This is a module file that contains the code for the follow and unfollow functionality.

// Function to follow or unfollow a user
function followUnfollowUser(targetUID, follow_ui, followed_ui) {
  fetch("/api/follow_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUID,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to follow/unfollow!");
      }
      return response.json();
    })
    .then((json) => {
      if (json.code.includes(0)) {
        updateFollowingUI(targetUID, follow_ui, followed_ui);
      } else {
        console.log(json.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to check if a user is following another user
function checkFollowing(targetUID, callback) {
  fetch("/api/follow_user/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUID,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to check following!");
      }
      return response.json();
    })
    .then((json) => {
      callback(json.code.includes(0));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to update the UI based on the following status
function updateFollowingUI(targetUID, follow_ui, followed_ui) {
  checkFollowing(targetUID, (isFollowing) => {
    if (isFollowing) {
      follow_ui.style.display = "none";
      followed_ui.style.display = "block";
    } else {
      follow_ui.style.display = "block";
      followed_ui.style.display = "none";
    }
  });
}
