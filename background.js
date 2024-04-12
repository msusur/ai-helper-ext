// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
debugger;
// Listen for a request from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getSelectedText") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getSelectedText
      }, (results) => {
        console.log("Selected text:", results[0].result);

        sendResponse({ text: results[0].result });
      });
    });
    return true; // Required to use sendResponse asynchronously
  }
});

function getSelectedText() {
  return window.getSelection().toString();
}
