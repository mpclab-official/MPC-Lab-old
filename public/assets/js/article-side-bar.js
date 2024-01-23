// article-side-bar.js
// This is a client-side script that contains the code for the article side bar.

function likeArticle(articleId) {
  fetch(`/api/like_article`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      articleId: articleId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed");
      }
      // If successful, redirect or perform other actions
      return response.json(); // This returns a Promise
    })
    .then((json) => {
      if (json.code.includes(0) && json.message == "Liked!") {
        document.getElementById("likeArticle").src =
          "/assets/svg/icons/liked.svg";
      } else if (json.code.includes(0) && json.message == "Unliked!") {
        document.getElementById("likeArticle").src =
          "/assets/svg/icons/like.svg";
      } else if (json.code.includes(-1)) {
        location.href = `/${languageCode}/login`;
      }
    })
    .catch((error) => {
      // Handle errors, display error messages, etc.
      console.error("Error:", error.message);
    });
}

function starArticle(articleId) {
  fetch(`/api/star_article`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      articleId: articleId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed");
      }
      // If successful, redirect or perform other actions
      return response.json(); // This returns a Promise
    })
    .then((json) => {
      if (json.code.includes(0) && json.message == "Starred!") {
        document.getElementById("starArticle").src =
          "/assets/svg/icons/starred.svg";
      } else if (json.code.includes(0) && json.message == "Unstarred!") {
        document.getElementById("starArticle").src =
          "/assets/svg/icons/star.svg";
      } else if (json.code.includes(-1)) {
        location.href = `/${languageCode}/login`;
      }
    })
    .catch((error) => {
      // Handle errors, display error messages, etc.
      console.error("Error:", error.message);
    });
}

function coinArticle(articleId, authorId) {
  fetch(`/api/coin_article`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      articleId: articleId,
      authorId: authorId,
    }),
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
        document.getElementById("coinArticle").src =
          "/assets/svg/icons/putted-coin.svg";
      } else if (json.code.includes(-1)) {
        location.href = `/${languageCode}/login`;
      }
    })
    .catch((error) => {
      // Handle errors, display error messages, etc.
      console.error("Error:", error.message);
    });
}

var longPressTimer;
function long_press_the_like_button(start) {
  if (start) {
    setTimeout(function () {
      document.getElementById("likeArticle").classList.add("shaking-element");
      longPressTimer = setTimeout(function () {
        navigator.vibrate([200, 100, 200, 100, 200]);
        document.getElementById("likeArticle").style.pointerEvents = "none";
        setTimeout(function () {
          likeArticle(article.id);
          starArticle(article.id);
          coinArticle(article.id, article.author_id);
          document.getElementById("likeArticle").style.pointerEvents = "auto";
          document
            .getElementById("likeArticle")
            .classList.remove("shaking-element");
        }, 200);
      }, 2000);
    }, 100);
  } else {
    setTimeout(function () {
      clearTimeout(longPressTimer);
      document
        .getElementById("likeArticle")
        .classList.remove("shaking-element");
    }, 100);
  }
}
window.addEventListener("load", () => {
  const likeButton = document.getElementById("likeArticle");

  likeButton.addEventListener("touchstart", () => {
    long_press_the_like_button(true);
  });

  likeButton.addEventListener("touchend", () => {
    long_press_the_like_button(false);
  });

  likeButton.addEventListener("mousedown", () => {
    long_press_the_like_button(true);
  });

  likeButton.addEventListener("mouseup", () => {
    long_press_the_like_button(false);
  });
});

function shareArticle() {
  function copyToClipboard(text) {
    var tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    pageMessage(
      true,
      document.getElementsByClassName("article-side-bar")[0].dataset.copy,
      4000
    );
  }

  copyToClipboard(`${article.title}: ${location.href}`);
}

// Todo: follow author
function followAuthor(authorId) {}
