// Listens for request to URL https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment and notifies content.js
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (
      details.url ===
      "https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment"
    ) {
      // This line adds the content script to the page as vtop uses history.push() to remove history.
      // chrome.tabs.executeScript(null, { file: "content.js" });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { urlVisited: true });
      });
    }
  },
  { urls: ["https://vtop.vit.ac.in/vtop/*"] }
);

function calendar(date, event) {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      console.log(token);
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&sendNotifications=true&alt=json&key=AIzaSyDPdTOzaUqLP_c08kWOu4QWSSyKEgnAwsM",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
          body: JSON.stringify({
            end: {
              dateTime: date + "T23:59:00.000+05:30",
            },
            start: {
              dateTime: date + "T23:00:00.000+05:30",
            },
            eventType: "default",
            description: event,
            summary: "Digital Assignment",
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          resolve();
          console.log(data);
        });
    });
  });
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

async function assignments(document) {
  try {
    var regNo = document.getElementById("authorizedIDX").value;
    var table = document.getElementsByClassName("customTable")[0].children[0];
    var now_ = new Date().getTime();
    // var dis = document.getElementsByClassName("icon-button");
    // for (let i = 0; i < dis.length; i++) {
    //   dis[i].disabled = true;
    // }
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
            // var due = new Date(due_date.due.replace(/-/g, " ")).getTime();
            // var color =
            //   (due - now_) / (3600 * 24 * 1000) <= 2 ? "red" : "green";
            // table.children[
            //   i
            // ].children[3].innerHTML += `<span style="display:inline; float:right; color:${color};">${due_date.due}</span>`;
            // table.children[i].children[3].children[0].appendChild(
            //   due_date.download
            // );
            console.log(due_date);
          })
          .catch((err) => console.log(err));
      }
    }
    // for (let i = 0; i < dis.length; i++) {
    //   dis[i].disabled = false;
    // }
  } catch (err) {
    console.log(err);
  }
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.sync) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { sendDOM: true }, function (DOM) {
        console.log(typeof DOM, DOM);
        assignments(DOM);
      });
    });
    // await calendar("2021-02-18", "check").then(() => {
    //   alert("Sync Done");
    // });
  }
});
