document.getElementById('send').addEventListener('click', function () {
    const button = this;
    button.textContent = 'Loading...';
    button.disabled = true;

    const selectedText = document.getElementById('selected-text').textContent;
    const promptText = document.getElementById('prompt').value;
    const fullPrompt = `You are an chrome plugin assistant and your job is to "${promptText}" for the following content: \n\n${selectedText}`;

    chrome.storage.local.get(['apiKey'], function (result) {
        fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${result.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: fullPrompt
                }],
                max_tokens: 150
            })
        }).then(response => response.json()).then(data => {
            document.getElementById('response').innerText = data.choices[0].message.content;
            button.textContent = 'Send to GPT-4';
            button.disabled = false;
        }).catch(error => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'Failed to fetch response. See console for details.';
            button.textContent = 'Send to GPT-4';
            button.disabled = false;
        });
    });
});


// Request the selected text from the background page when popup is opened
window.onload = function () {
    chrome.runtime.sendMessage({ message: "getSelectedText" }, function (response) {
        // Display only the first 100 characters of the selected text
        document.getElementById('selected-text').textContent = response.text.slice(0, 1000);
    });
};
