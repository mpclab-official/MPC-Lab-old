// page-left-right-scroll.js
// This is a script file that contains the code for the left and right scroll.

window.addEventListener("load", () => {
  if (
    document.getElementById("leftScroll") &&
    document.getElementById("rightScroll")
  ) {
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let pageHight = document.body.offsetHeight;
    let leftElHight = document.getElementById("leftScroll").offsetHeight;
    let rightElHight = document.getElementById("rightScroll").offsetHeight;
    let mainTopbarHight =
      document.getElementsByClassName("main-header")[0].offsetHeight;
    if (leftElHight > rightElHight && leftElHight > pageHight) {
      let fixedPosition = false;
      window.addEventListener("scroll", () => {
        scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        pageHight = document.body.offsetHeight;
        leftElHight = document.getElementById("leftScroll").offsetHeight;
        rightElHight = document.getElementById("rightScroll").offsetHeight;
        mainTopbarHight =
          document.getElementsByClassName("main-header")[0].offsetHeight;
        if (document.body.offsetWidth > 1000) {
          if (scrollY >= rightElHight - pageHight + mainTopbarHight) {
            if (!fixedPosition) {
              if (rightElHight >= pageHight - mainTopbarHight) {
                fixedPosition = true;
                let rightEl = document.getElementById("rightScroll");
                rightEl.style.zIndex = "1";
                rightEl.style.position = "fixed";
                rightEl.style.top =
                  String((rightElHight - pageHight) * -1) + "px";
                rightEl.style.right = "0";
                rightEl.style.height = "auto";
              } else {
                fixedPosition = true;
                let rightEl = document.getElementById("rightScroll");
                rightEl.style.zIndex = "1";
                rightEl.style.position = "fixed";
                rightEl.style.top = String(mainTopbarHight) + "px";
                rightEl.style.right = "0";
                rightEl.style.height = "auto";
              }
            }
          } else {
            if (fixedPosition) {
              fixedPosition = false;
              let rightEl = document.getElementById("rightScroll");
              rightEl.style.position = "";
              rightEl.style.top = "";
              rightEl.style.right = "";
              rightEl.style.height = "100%";
            }
          }
        } else {
          fixedPosition = false;
          let rightEl = document.getElementById("rightScroll");
          rightEl.style.position = "";
          rightEl.style.top = "";
          rightEl.style.right = "";
          rightEl.style.height = "100%";
        }
      });
    } else {
      document.body.style.height = "auto";
    }
  } else {
    document.body.style.height = "auto";
  }
});
