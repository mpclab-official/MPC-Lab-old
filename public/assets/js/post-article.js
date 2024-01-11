// Function to mark input fields as invalid and display error messages
function markInvalidInput(inputElement, errorMessage) {
    let newNode = document.createElement("span");
    newNode.innerHTML += `• ${errorMessage} </br>`;
    newNode.className = "errorMessage";
    let parentDiv = inputElement.parentNode;
    parentDiv.insertBefore(newNode, inputElement);
}

// Function to remove all error messages
function removeInvalidInput() {
    let errorMessages = document.getElementsByClassName("errorMessage");
    while (errorMessages.length > 0) {
        errorMessages[0].parentNode.removeChild(errorMessages[0]);
    }
}

function convertImageToBase64(callback) {
    const fileInput = document.getElementById('cover');

    // Ensure a file is selected
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        // Read the file as Data URL (base64)
        reader.readAsDataURL(file);

        reader.onload = function () {
            callback(reader.result);
        };

        reader.onerror = function (error) {
            console.error('Error reading the file:', error);
        };
    } else {
        callback(false);
    }
}

window.addEventListener('load', function () {
    document.getElementById('upload').addEventListener('click', function () {

        // Remove all error messages
        removeInvalidInput();

        // Get the language code from the URL
        let tagsInput = document.getElementById('tags').value;
        let tags = [];
        let currentTag = '';

        tagsInput += ' ';
        for (let i = 0; i < tagsInput.length; i++) {
            if (tagsInput[i] !== ' ') {
                // If the current character is not a space, append it to the current tag
                currentTag += tagsInput[i];
            } else {
                if (currentTag.length > 0) {
                    // If the current character is a space, add the current tag to the tags array
                    tags.push(currentTag);
                    // Reset the current tag
                    currentTag = '';
                }
            }
        }

        // Merge tags with the same name
        let newTags = [];
        for (const tag of tags) {
            if (!newTags.includes(tag)) {
                newTags.push(tag);
            }
        }
        tags = newTags;

        // Remove empty tags
        convertImageToBase64((base64IMG) => {
            if (base64IMG !== null && base64IMG !== undefined) {
                fetch(`/${languageCode}/blog/post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        article: {
                            title: document.getElementById('title').value,
                            tags: tags,
                            about: document.getElementById('description').value,
                            content: quill.getContents(),
                            language: document.getElementById('language').value,
                            cover: base64IMG,
                        }
                    }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Post failed');
                        }
                        return response.json();
                    })
                    .then(json => {
                        if (json.code.includes(0)) {
                            location.href = `/${languageCode}/blog`;
                        }
                        if (json.code.includes(1)) {
                            markInvalidInput(document.getElementById('title'), json.messages[1]);
                        }
                        if (json.code.includes(2)) {
                            markInvalidInput(document.getElementById('tags'), json.messages[2]);
                        }
                        if (json.code.includes(3)) {
                            markInvalidInput(document.getElementById('description'), json.messages[3]);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error.message);
                    });
            }
        });
    });
});