document.getElementById('send').addEventListener('click', function() {
  const selectedText = document.getElementById('selected-text').value;
  const promptText = document.getElementById('prompt').value;
  const fullPrompt = promptText + "\n\n" + selectedText;

  chrome.storage.local.get(['apiKey'], function(result) {
      fetch(`https://api.openai.com/v1/engines/text-davinci-002/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${result.apiKey}`
          },
          body: JSON.stringify({
              prompt: fullPrompt,
              max_tokens: 150
          })
      }).then(response => response.json()).then(data => {
          document.getElementById('response').innerText = data.choices[0].text;
      }).catch(error => console.error('Error:', error));
  });
});
