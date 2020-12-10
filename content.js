function find_right_due(table_inner) {
  return new Promise((resolve) => {
    for (let i = 0; i < table_inner.children.length; i++) {
      var check = table_inner.children[i].children[6].children.length;
      if (check == 0) {
        var dwnld = table_inner.children[i].children[5].children.length;
        resolve({
          due: table_inner.children[i].children[4].children[0].innerHTML,
          download:
            dwnld > 0
              ? table_inner.children[i].children[5].children[0].children[0]
              : document.createElement("div"),
        });
      }
    }
    resolve({
      due: "Nothing Left. Cheers!",
      download: document.createElement("div"),
    });
  });
}

async function assignments() {
  try {
    var regNo = document.getElementById("authorizedIDX").value;
    var table = document.getElementsByClassName("customTable")[0].children[0];
    var now_ = new Date().getTime();
    var dis = document.getElementsByClassName("icon-button");
    for (let i = 0; i < dis.length; i++) {
      dis[i].disabled = true;
    }
    for (let i = 1; i < table.children.length; i++) {
      var classid = table.children[i].children[1].innerHTML;
      if (table.children[i].children[3].children.length != 1) {
        await fetch(
          "https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: `authorizedID=${regNo}&x=${new Date().toGMTString()}&classId=${classid}`,
          }
        )
          .then((res) => res.text())
          .then(async (data) => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");

            var table_inner = doc.getElementsByClassName("customTable")[1]
              .children[1];

            var due_date = await find_right_due(table_inner).then(
              (data) => data
            );
            var due = new Date(due_date.due.replace(/-/g, " ")).getTime();
            var color =
              (due - now_) / (3600 * 24 * 1000) <= 2 ? "red" : "green";
            table.children[
              i
            ].children[3].innerHTML += `<span style="display:inline; float:right; color:${color};">${due_date.due}</span>`;
            table.children[i].children[3].children[0].appendChild(
              due_date.download
            );
          })
          .catch((err) => console.log(err));
      }
    }
    for (let i = 0; i < dis.length; i++) {
      dis[i].disabled = false;
    }
  } catch (err) {
    console.log(err);
  }
}

// Message passing between background and content
// This removes the need for clicking in body to see due dates as it checks URL requests to find whether user has visited DA page.
var loaded = false;
chrome.runtime.onMessage.addListener(function (request) {
  if (request.urlVisited && !loaded) {
    loaded = true;
    chrome.storage.sync.get(["pause"], function (data) {
      if (!data.pause) {
        assignments();
      }
    });
  }
});
