document.getElementById('save').addEventListener('click', function() {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.local.set({apiKey: apiKey}, function() {
      console.log('API Key saved');
  });
});
