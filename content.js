document.addEventListener('click',async function() {
    // alert('hi');
    // if (!chrome.cookies) {
    //     chrome.cookies = chrome.experimental.cookies;
    // }
    await chrome.runtime.sendMessage({cookie:true});
    chrome.storage.sync.get(null,function(result){
        var title = document.getElementsByClassName('box-title');
        title[0].innerHTML = "Lol"

        var table = document.getElementsByClassName('customTable')[0].children[0]
        console.log(typeof table.children)
        for(let i=0;i<table.children.length;i++) {
            var a = table.children[i].children[1].innerHTML;
            console.log(a)
        }
        // table.children.forEach((tr) => {
        //     var a = tr.children[1].innerHTML;
        //     console.log(a)
        // })
    })
})