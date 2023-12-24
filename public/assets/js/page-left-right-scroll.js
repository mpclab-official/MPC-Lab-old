window.addEventListener('load', () => {
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let pageHight = document.offsetHeight;
    let leftElHight = document.getElementById("leftScroll").offsetHeight;
    let rightElHight = document.getElementById("rightScroll").offsetHeight;
    let mainTopbarHight = document.getElementsByClassName("main-header")[0].offsetHeight;
    if (leftElHight > rightElHight && leftElHight > pageHight) {
        let fixedPosition = false;
        window.addEventListener('scroll', () => {
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            pageHight = document.body.offsetHeight;
            // rightElHight = document.getElementById("rightScroll").offsetHeight;
            mainTopbarHight = document.getElementsByClassName("main-header")[0].offsetHeight;
            if (scrollY >= ((rightElHight - pageHight) + mainTopbarHight)) {
                if (!fixedPosition) {
                    fixedPosition = true;
                    let rightEl = document.getElementById("rightScroll");
                    rightEl.style.zIndex = "-1";
                    rightEl.style.position = "fixed";
                    rightEl.style.top = String((rightElHight - pageHight) * -1) + "px";
                    rightEl.style.right = "0";
                    rightEl.style.height = "auto";
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
        });
    }
});