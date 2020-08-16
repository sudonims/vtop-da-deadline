// Listens for request to URL https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment and notifies content.js
chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (
            details.url ===
            "https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment"
        ) {
            // This line adds the content script to the page as vtop uses history.push() to remove history.
            chrome.tabs.executeScript(null, { file: "content.js" });
            chrome.tabs.query({ active: true, currentWindow: true }, function (
                tabs
            ) {
                chrome.tabs.sendMessage(tabs[0].id, { urlVisited: true });
            });
        }
    },
    { urls: ["https://vtop.vit.ac.in/vtop/*"] }
);
