chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.cookie) {
        chrome.cookies.getAll({
            url: "https://vtop.vit.ac.in/vtop/initialProcess"
        }, function (cookies) {
            console.log(cookies)
            // alert(cookies)
        })
    }
})