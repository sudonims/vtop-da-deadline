document.addEventListener('click',function() {
    // alert('hi');
    // if (!chrome.cookies) {
    //     chrome.cookies = chrome.experimental.cookies;
    // }
    chrome.runtime.sendMessage({cookie:true});
    
})
