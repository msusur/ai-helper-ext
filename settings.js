document.getElementById('save').addEventListener('click', function() {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.local.set({apiKey: apiKey}, function() {
      alert('API Key saved successfully!');
  });
});

// Load the saved API key when the settings page loads
window.onload = function() {
  chrome.storage.local.get(['apiKey'], function(result) {
      if (result.apiKey) {
          document.getElementById('apiKey').value = result.apiKey;
      }
  });
};
