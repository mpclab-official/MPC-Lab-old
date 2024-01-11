const pageSize = 10;
const startDate = new Date().toISOString();
let page = 1;
let newArticles = false;
let ALLarticlesID = [];

function getArticles(page, newArticles = false) {
    fetch(`/${languageCode}/blog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: page,
            pageSize: 10,
            startDate: new Date(),
            newArticles: newArticles,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Post failed');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            randerArticles(json.articles, () => {
                if (json.noMoreArticles) {
                    console.log("No more articles");
                    page = 1;
                    newArticles = true;
                    getArticles(page, newArticles);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

function randerArticles(articles, callback) {
    const articlesEL = document.getElementById('articles');
    let index = 1;

    // Create Intersection Observer instance
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load more
                page++;
                getArticles(page, newArticles);

                // Stop observing once visible
                observer.disconnect();
            }
        });
    });

    articles.forEach(article => {
        let lastClass = "";
        if (index == articles.length) {
            lastClass = "last-article";
            setTimeout(function () {
                // Start observing once visible
                const observerElement = document.getElementsByClassName('last-article')[document.getElementsByClassName('last-article').length - 1];
                observer.observe(observerElement);
            }, 1000);
        }
        let tagsText = '';
        for (let i = 0; i < article.tags.length; i++) {
            tagsText += `<span>${article.tags[i]}</span>`;
        }
        if (!ALLarticlesID.includes(article.id)) {
            if (article.cover == "0") {
                articlesEL.innerHTML += `
                    <div class="card article-card ${lastClass}" onclick="window.location='/${languageCode}/blog/article/${article.id}'">
                        <table>
                            <tr>
                                <td colspan="3">
                                    <h1>${article.title}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <p>${article.about}</p>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <p>${article.author_name} | ${article.views} ${document.body.dataset.views}   ${article.likes} ${document.body.dataset.likes}      ${tagsText}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
            } else {
                articlesEL.innerHTML += `
                    <div class="card article-card ${lastClass}" onclick="window.location='/${languageCode}/blog/article/${article.id}'">
                        <table>
                            <tr>
                                <td colspan="2">
                                    <h1>${article.title}</h1>
                                </td>
                                <td rowspan="3" class="image-td">
                                    <div class="image-container">
                                        <img src="${article.cover}">
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <p>${article.about}</p>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <p>${article.author_name} | ${article.views} ${document.body.dataset.views}   ${article.likes} ${document.body.dataset.likes}      ${tagsText}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
            }
            ALLarticlesID.push(article.id);
        }
        index++;
    });
    callback();
}

window.addEventListener('load', function () {
    getArticles(page, false);
});