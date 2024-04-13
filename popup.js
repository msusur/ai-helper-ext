document.addEventListener('DOMContentLoaded', displayHistory);

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
                // max_tokens: 150
            })
        }).then(response => response.json()).then(data => {
            const responseText = data.choices[0].message.content.trim();
            document.getElementById('response').innerText = responseText;
            saveHistory(promptText, responseText);
            displayHistory();
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

function saveHistory(prompt, response) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ prompt, response });
    localStorage.setItem('history', JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = ''; // Clear existing history display

    history.forEach((item, index) => {
        const entry = document.createElement('div');
        entry.className = 'history-entry';

        const promptHeader = document.createElement('div');
        promptHeader.className = 'history-header';
        promptHeader.textContent = `Prompt ${index + 1}: Click to Expand`;
        promptHeader.onclick = function () {
            const isVisible = responseDiv.style.display === 'block';
            responseDiv.style.display = isVisible ? 'none' : 'block';
            promptHeader.textContent = `Prompt ${index + 1}: Click to ${isVisible ? 'Expand' : 'Collapse'}`;
        };

        const responseDiv = document.createElement('div');
        responseDiv.className = 'history-response';
        responseDiv.style.display = 'none';
        responseDiv.innerHTML = `<b>Prompt:</b> ${item.prompt} <br> <b>Response:</b> ${item.response}`;

        entry.appendChild(promptHeader);
        entry.appendChild(responseDiv);
        historyElement.appendChild(entry);
    });
}

// Request the selected text from the background page when popup is opened
window.onload = function () {
    chrome.runtime.sendMessage({ message: "getSelectedText" }, function (response) {
        if (response.text.trim().length === 0) {
            document.getElementById('no-text-selected').className = 'visible';
            document.getElementById('interaction-area').className = 'hidden';
        } else {
            document.getElementById('selected-text').textContent = `${response.text.slice(0, 500)}...`;
            document.getElementById('no-text-selected').className = 'hidden';
            document.getElementById('interaction-area').className = 'visible';
        }
    });
};
