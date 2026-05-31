document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');

    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');

    const gamePreview = document.getElementById('game-preview');
    const refreshPreviewBtn = document.getElementById('refresh-preview-btn');

    // State
    let apiKey = localStorage.getItem('gemini_api_key') || '';
    let chatHistory = [];
    let currentHtmlCode = '';

    // Initialize
    if (apiKey) {
        apiKeyModal.classList.add('hidden');
    }

    // API Key Handling
    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            apiKey = key;
            localStorage.setItem('gemini_api_key', apiKey);
            apiKeyModal.classList.add('hidden');
        } else {
            alert('Please enter a valid API key.');
        }
    });

    // Chat functionality
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'assistant-message');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        if (isUser) {
            contentDiv.textContent = text;
        } else {
            // Use marked to parse markdown if available, else plain text
            if (typeof marked !== 'undefined') {
                contentDiv.innerHTML = marked.parse(text);
            } else {
                contentDiv.textContent = text;
            }
        }

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function extractHtmlCode(text) {
        // Look for markdown code blocks containing html
        const htmlRegex = /```html\s*([\s\S]*?)```/i;
        const match = text.match(htmlRegex);
        return match ? match[1] : null;
    }

    function updatePreview(htmlCode) {
        if (!htmlCode) return;
        currentHtmlCode = htmlCode;

        const iframeDoc = gamePreview.contentDocument || gamePreview.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text || !apiKey) return;

        // Disable input while processing
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;

        addMessage(text, true);

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: apiKey,
                    message: text,
                    history: chatHistory
                })
            });

            chatMessages.removeChild(loadingDiv);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Network response was not ok');
            }

            const data = await response.json();
            const replyText = data.text;

            // Update history
            chatHistory.push({ role: 'user', text: text });
            chatHistory.push({ role: 'model', text: replyText });

            addMessage(replyText, false);

            // Check for HTML code to update preview
            const htmlCode = extractHtmlCode(replyText);
            if (htmlCode) {
                updatePreview(htmlCode);
            }

        } catch (error) {
            console.error('Error:', error);
            if (chatMessages.contains(loadingDiv)) {
                chatMessages.removeChild(loadingDiv);
            }
            addMessage(`Error: ${error.message}. Please check your API key or try again.`, false);

            if(error.message.includes("API Key")) {
                 apiKeyModal.classList.remove('hidden');
                 localStorage.removeItem('gemini_api_key');
                 apiKey = '';
            }
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    clearChatBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            chatHistory = [];
            chatMessages.innerHTML = `
                <div class="message assistant-message">
                    <div class="message-content">Chat history cleared. What kind of game do you want to build today?</div>
                </div>
            `;
            updatePreview('<!DOCTYPE html><html><body style="background-color: white;"></body></html>');
        }
    });

    refreshPreviewBtn.addEventListener('click', () => {
        if (currentHtmlCode) {
            updatePreview(currentHtmlCode);
        }
    });
});