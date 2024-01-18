// error-success-notification.js
// This is a module that contains the code for displaying error and success messages.

function MessageQueue() {
  let queue = [];
  let isProcessing = false; // Add a flag to indicate if there is currently a message being processed

  function showMessage(div, time) {
    document.body.appendChild(div);
    let timerId = setTimeout(() => {
      div.remove();
      isProcessing = false; // Set the flag to false after message processing is complete
      dequeue(); // Process the next message
    }, time);
  }

  function dequeue() {
    if (!isProcessing && queue.length > 0) {
      isProcessing = true; // Set the flag to true to indicate that a message is being processed
      let { div, time } = queue.shift();
      showMessage(div, time);
    }
  }

  return function pageMessage(success, message, time) {
    let showMessageFn = (div) => {
      queue.push({ div, time });
      dequeue(); // Immediately attempt to process the message after adding it
    };

    if (success) {
      let successMessageDiv = document.createElement("div");
      successMessageDiv.classList.add("success-message");
      successMessageDiv.innerHTML = message;
      showMessageFn(successMessageDiv);
    } else {
      let errorMessageDiv = document.createElement("div");
      errorMessageDiv.classList.add("error-message");
      errorMessageDiv.innerHTML = message;
      showMessageFn(errorMessageDiv);
    }
  };
}

// Create a message queue and use MessageQueue
const pageMessage = MessageQueue();
