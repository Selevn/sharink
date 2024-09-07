chrome.runtime.onInstalled.addListener((details) => {
    console.log(details);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendRequest') {
        fetch('http://localhost:8080/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request.data)
        })
        .then(response => response.json())
        .then(data => sendResponse({ data }))
        .catch(error => sendResponse({ error: error.message }));

        return true; // Указывает на асинхронный ответ
    }
});