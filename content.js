// let chrome_ = chrome && browser ? browser : chrome;

function chrome_() {
  try {
    chrome !== undefined && browser !== undefined;
    return browser;
  } catch (e) {
    console.log(e.message);
    return chrome;
  }
}

document.addEventListener("DOMContentLoaded", change_navbar);

function change_navbar() {
  try {
    var coursePage = document.createElement("div");
    coursePage.className = "dropdown";
    coursePage.innerHTML = `
          <a class="btn btn-default btn-group-justified dropdown-toggle" type="button" style="margin-top:5px">
            <span class="fa fa-graduation-cap" style="margin-top:5px"></span>
          </a> <div class="dropdown-menu btnList ">
          <div class="panel-group" role="tablist" id="BtnAccordian17">
          <div class="panel panel-default"><div class="panel-heading"> 
            <h4 class="disabled text-capitalize text-center menu-header">&nbsp;&nbsp;Quick Links</h4> 
          </div> <div id="BtnBody21130">
          <div class="panel-body"> 
            <ul class="nav">
              <li>
                <a href="javascript:loadmydiv('examinations/StudentDA')" id="CNTXXX1" class="btnItem" onclick="toggleButtonMenuItem()"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-book"></i>&nbsp;&nbsp;DA upload</a>
              </li>
              <li>
                <a href="javascript:loadmydiv('academics/common/StudentCoursePage')" id="ACD0045" class="btnItem" onclick="toggleButtonMenuItem()"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-dot-circle-o"></i>&nbsp;&nbsp;Course Page</a>
              </li>
              <li>
                <a href="javascript:loadmydiv('academics/common/StudentClassMessage')" id="CNTXXX3" class="btnItem" onclick="toggleButtonMenuItem()"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-book"></i>&nbsp;&nbsp;Class Message</a>
              </li>
            </ul>
          </div>
        </div>
      </div></div></div>
    <p style="text-align: center;background-color: #00EDFD">Quick IMP Links Up</p>`;

    var dropdown = document.getElementsByClassName(
      "btn-group-vertical dropright"
    );

    dropdown[0].insertBefore(coursePage, dropdown[0].children[0]);
  } catch (err) {
    console.log(err);
  }
}

function find_right_due(table_inner) {
  return new Promise((resolve) => {
    for (let i = 0; i < table_inner.children.length; i++) {
      var check = table_inner.children[i].children[6].children[0].innerHTML;
      if (check === "") {
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

            var table_inner =
              doc.getElementsByClassName("customTable")[1].children[1];

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

function sendingResponse() {
  return new Promise((resolve) => {
    resolve(document.documentElement);
  });
}

// Message passing between background and content
// This removes the need for clicking in body to see due dates as it checks URL requests to find whether user has visited DA page.
var loaded = false;
chrome_().runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.urlVisited && !loaded) {
    loaded = true;
    chrome_().storage.local.get(["pause"], function (data) {
      if (!data.pause) {
        assignments();
      }
    });

    var btn = document.createElement("button");
    btn.innerHTML = "Sync with Google Calendar";
    var head = document.getElementsByClassName("box-header with-border")[0];
    var text = document.createElement("p");
    text.innerHTML =
      "Please Sign In through extension dropdown before proceding.";
    head.appendChild(btn);
    head.appendChild(text);

    btn.addEventListener("click", function () {
      var DOM = document.body.outerHTML;
      chrome_().runtime.sendMessage(
        {
          message: "sync",
          DOM,
        },
        function () {
          console.log("Syncing");
        }
      );

      // alert("Still in development. Coming soon. Check GitHub repo for more");
    });
  }

  return true;
});
