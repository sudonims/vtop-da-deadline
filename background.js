chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    if (req.cookie) {
        await chrome.cookies.getAll({
            url: "https://vtop.vit.ac.in/vtop/initialProcess"
        }, function (cookies) {
            console.log(cookies)
            // sendResponse({cookie_:cookies[0].value})
            chrome.storage.sync.set({cookie_:cookies[0].value},()=>{
                console.log('set');
            });
            // alert(cookies;
        })
    }
    // return true;
})