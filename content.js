function find_right_due(table_inner) {
    // node = new DOMParser(node);
    return new Promise(function (resolve) {
        for (let i = 0; i < table_inner.children.length; i++) {
            var check = table_inner.children[i].children[6].children.length;
            if (check == 0) {
                var dwnld = table_inner.children[i].children[5].children.length;
                resolve({
                    due: table_inner.children[i].children[4].children[0].innerHTML,
                    download: dwnld > 0 ? table_inner.children[i].children[5].children[0].children[0] : document.createElement('div')
                });
            }
        }
        resolve({
            due: 'Sem Done. Congo',
            download: document.createElement('div')
        });
    })
}

document.addEventListener('click', async function () {
    // Get Reg. No
    var regNo = document.getElementsByClassName('VTopHeaderStyle')[0].children[1].innerHTML.slice(0, 9);
    var table = document.getElementsByClassName('customTable')[0].children[0]

    for (let i = 1; i < table.children.length; i++) {
        var classid = table.children[i].children[1].innerHTML;

        if (table.children[i].children[3].children.length == 0) {
            await fetch('https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `authorizedID=${regNo}&x=${new Date().toGMTString()}&classId=${classid}`
            }).then(res => res.text()).then(async data => {
                var parser = new DOMParser()
                var doc = parser.parseFromString(data, 'text/html');

                var table_inner = doc.getElementsByClassName('customTable')[1].children[1];

                var due_date = await find_right_due(table_inner).then(data => data);

                table.children[i].children[3].innerHTML += `<span style="display:inline; float:right;">${due_date.due}</span>`
                table.children[i].children[3].children[0].appendChild(due_date.download)
            }).catch(err => console.log(err));
        }

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
    }
})