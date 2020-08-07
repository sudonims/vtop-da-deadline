document.addEventListener('click', async function () {
    // alert('hi');
    // if (!chrome.cookies) {
    //     chrome.cookies = chrome.experimental.cookies;
    // }
    await chrome.runtime.sendMessage({ cookie: true });
    chrome.storage.sync.get(null, async function (result) {
        var title = document.getElementsByClassName('box-title');
        title[0].innerHTML = "Lol"

        var table = document.getElementsByClassName('customTable')[0].children[0]
        console.log(typeof table.children)

        for (let i = 0; i < table.children.length; i++) {
            var newel = document.createElement('td');
            newel.setAttribute('id', 'lol');

            var classid = table.children[i].children[1].innerHTML;

            await fetch('https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `authorizedID=18BCI0197&x=${new Date().toGMTString()}&classId=${classid}`
            }).then(res => res.text()).then(data => {
                var parser = new DOMParser()
                var doc = parser.parseFromString(data, 'text/html');
                // console.log(data)
                var table_inner = doc.getElementsByClassName('customTable')[1].children[1];
                var due_date = table_inner.children[0].children[4].children[0].innerHTML;
                // console.log(due_date)
                // newel.innerHTML = due_date
                // table.children[i].appendChild(newel)
                table.children[i].children[3].innerHTML+=`&nbsp;&nbsp;${due_date}`
            }).catch(err => console.log(err));

            // var xhr = new XMLHttpRequest();
            // xhr.open("POST","https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment",true);
            // xhr.responseType = "json";
            // // xhr.setRequestHeader('Cookie',`loginUserType=vtopuser; JSESSIONID=${result.cookie_}; _ga=GA1.3.723634682.1596111927; SERVERID=s1`)
            // var a = table.children[i].children[1].innerHTML;
            // xhr.send(`authorizedID=18BCI0197&x=${new Date().toGMTString()}&classid=${a}`)
            // xhr.onreadystatechange = function() {
            //     var response_link = xhr.response;
            //     console.log(a,response_link);
            // }
            // console.log(a)
        }
    })
})