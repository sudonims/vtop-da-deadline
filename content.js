document.addEventListener('click', async function () {
    // alert('hi');
    // if (!chrome.cookies) {
    //     chrome.cookies = chrome.experimental.cookies;
    // }
    await chrome.runtime.sendMessage({ cookie: true });
    chrome.storage.sync.get(null,async function (result) {
        var title = document.getElementsByClassName('box-title');
        title[0].innerHTML = "Lol"

        var table = document.getElementsByClassName('customTable')[0].children[0]
        console.log(typeof table.children)
        
        await fetch('https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment', {
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With':'XMLHttpRequest'
            },
            body: "authorizedID=18BCI0197&x=Fri, 07 Aug 2020 17:43:03 GMT&classId=VL2020210104549"
        }).then(res => res).then(data=>console.log(data)).catch(err=>console.log(err));
        // console.log(response.body)s
        // for (let i = 0; i < table.children.length; i++) {
        //     var newel = document.createElement('td');
        //     newel.setAttribute('id', 'lol');
        //     newel.innerHTML = "New Inserted"
        //     table.children[i].appendChild(newel)


        //     // var xhr = new XMLHttpRequest();
        //     // xhr.open("POST","https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment",true);
        //     // xhr.responseType = "json";
        //     // // xhr.setRequestHeader('Cookie',`loginUserType=vtopuser; JSESSIONID=${result.cookie_}; _ga=GA1.3.723634682.1596111927; SERVERID=s1`)
        //     // var a = table.children[i].children[1].innerHTML;
        //     // xhr.send(`authorizedID=18BCI0197&x=${new Date().toGMTString()}&classid=${a}`)
        //     // xhr.onreadystatechange = function() {
        //     //     var response_link = xhr.response;
        //     //     console.log(a,response_link);
        //     // }
        //     // console.log(a)
        // }
        // table.children.forEach((tr) => {
        //     var a = tr.children[1].innerHTML;
        //     console.log(a)
        // })
    })
})