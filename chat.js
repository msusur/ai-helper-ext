chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action == "setText") {
      document.getElementById('response').value = request.text;
      sendResponse({ status: "Text set" });
    }
  }
);