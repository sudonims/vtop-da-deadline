function chrome_() {
  try {
    chrome !== undefined && browser !== undefined;
    return browser;
  } catch (e) {
    console.log(e.message);
    return chrome;
  }
}

chrome_().storage.local.set({ VTOP_URI: window.location.origin }, function () {
  console.log("SET THE URL");
});

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
                <a href="javascript:loadmydiv('examinations/StudentDA','btnMenuForm')" id="CNTXXX1" class="btnItem" onclick="toggleButtonMenuItem()"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-book"></i>&nbsp;&nbsp;DA upload</a>
              </li>
              <li>
              <a href="javascript:loadmydiv('academics/common/StudentCoursePage','btnMenuForm')" id="ACD0045" class="btnItem" onclick="toggleButtonMenuItem()"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-dot-circle-o"></i>&nbsp;&nbsp;Course Page</a>              </li>
              <li>
                <a href="javascript:loadmydiv('academics/common/StudentClassMessage','btnMenuForm')" id="CNTXXX3" class="btnItem" onclick="toggleButtonMenuItem()"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa fa-book"></i>&nbsp;&nbsp;Class Message</a>
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
    const dueDates = [];
    for (let i = 0; i < table_inner.children.length; i++) {
      var check = table_inner.children[i].children[6].children[0].innerHTML;
      if (check === "") {
        var dwnld = table_inner.children[i].children[5].children.length;
        dueDates.push({
          due: table_inner.children[i].children[4].children[0].innerHTML,
          download:
            dwnld > 0
              ? table_inner.children[i].children[5].children[0].children[0]
              : document.createElement("div"),
        });
      }
    }
    if (dueDates.length > 0) {
      dueDates.sort((a, b) => {
        return new Date(a.due).getTime() < new Date(b.due).getTime();
      });
      resolve(dueDates[0]);
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
          `${window.location.origin}/vtop/examinations/processDigitalAssignment`,
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
    chrome_().storage.local.get(["token"], function (data) {
      var head = document.getElementsByClassName("box-header with-border")[0];
      if (!data.token) {
        var text = document.createElement("p");
        text.innerHTML =
          "Sign in to Google via Extension to sync your assign with your Google Calendar.";
        head.appendChild(text);
      } else {
        var btn = document.createElement("button");
        btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 141.7 141.7" width="24" height="24"><path fill="#fff" d="M95.8,45.9H45.9V95.8H95.8Z"/><path fill="#34a853" d="M95.8,95.8H45.9v22.5H95.8Z"/><path fill="#4285f4" d="M95.8,23.4H30.9a7.55462,7.55462,0,0,0-7.5,7.5V95.8H45.9V45.9H95.8Z"/><path fill="#188038" d="M23.4,95.8v15a7.55462,7.55462,0,0,0,7.5,7.5h15V95.8Z"/><path fill="#fbbc04" d="M118.3,45.9H95.8V95.8h22.5Z"/><path fill="#1967d2" d="M118.3,45.9v-15a7.55462,7.55462,0,0,0-7.5-7.5h-15V45.9Z"/><path fill="#ea4335" d="M95.8,118.3l22.5-22.5H95.8Z"/><polygon fill="#2a83f8" points="77.916 66.381 75.53 63.003 84.021 56.868 87.243 56.868 87.243 85.747 82.626 85.747 82.626 62.772 77.916 66.381"/><path fill="#2a83f8" d="M67.29834,70.55785A7.88946,7.88946,0,0,0,70.78,64.12535c0-4.49-4-8.12-8.94-8.12a8.77525,8.77525,0,0,0-8.74548,6.45379l3.96252,1.58258a4.41779,4.41779,0,0,1,4.473-3.51635,4.138,4.138,0,1,1,.06256,8.24426v.00513h-.0559l-.00666.00061-.00964-.00061H59.15v3.87677h2.70642L61.88,72.65a4.70514,4.70514,0,1,1,0,9.37,5.35782,5.35782,0,0,1-3.96588-1.69354,4.59717,4.59717,0,0,1-.80408-1.2442l-.69757-1.69946L52.23005,79c.62,4.33,4.69,7.68,9.61,7.68,5.36,0,9.7-3.96,9.7-8.83A8.63346,8.63346,0,0,0,67.29834,70.55785Z"/></svg><span>Sync assignments with Google Calendar</span>`;
        btn.style = `display: flex;align-items: center;gap: 1rem;font-family: inherit;justify-content: space-around;color: #535353;font-size: 13px;font-weight: 500;margin: 8px auto;cursor: pointer;background-color: white;border-radius: 32px;transition: all 0.2s ease-in-out;padding: 6px 10px;border: 1px solid rgba(0, 0, 0, 0.25);`;
        head.appendChild(btn);

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
        });
      }
    });
  }

  return true;
});
