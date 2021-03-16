// Listens for request to URL https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment and notifies content.js
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (
      details.url ===
      "https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment"
    ) {
      // This line adds the content script to the page as vtop uses history.push() to remove history.
      chrome.tabs.executeScript(null, { file: "content.js" });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { urlVisited: true });
      });
    }
  },
  { urls: ["https://vtop.vit.ac.in/vtop/*"] }
);

function calendar(date, event) {
  var map = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Sept: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  var tmp = date.split("-");
  var dte = `${tmp[2]}-${map[tmp[1]]}-${tmp[0]}`;
  console.log(date, dte);
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
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
              dateTime: dte + "T23:59:00.000+05:30",
            },
            start: {
              dateTime: dte + "T23:00:00.000+05:30",
            },
            eventType: "default",
            description: event,
            summary: "Digital Assignment",
          }),
        }
      )
        .then(async (res) => {
          return res.json();
        })
        .then((data) => {
          resolve();
          console.log(data);
        });
    });
  });
}

function get_dates(table_inner) {
  return new Promise((resolve) => {
    var dates = [];
    for (let i = 0; i < table_inner.children.length; i++) {
      var check = table_inner.children[i].children[6].children[0].innerHTML;
      if (
        check === "" &&
        table_inner.children[i].children[4].children[0].innerHTML !== "-"
      ) {
        dates.push({
          name: table_inner.children[i].children[1].innerHTML,
          date: table_inner.children[i].children[4].children[0].innerHTML,
        });
      }
    }
    resolve(dates);
  });
}

async function assignments(DOM) {
  try {
    var regNo = DOM.getElementById("authorizedIDX").value;
    var table = DOM.getElementsByClassName("customTable")[0].children[0];
    for (let i = 1; i < table.children.length; i++) {
      var classid = table.children[i].children[1].innerHTML;
      console.log(table.children[i].children[3].children);

      table.children[i].children[3].children.length !== 0 &&
        table.children[i].children[3].children[0].remove();
      var desc_str =
        table.children[i].children[3].textContent.trim() +
        " " +
        table.children[i].children[4].innerHTML;
      console.log(desc_str);
      await fetch(
        "https://vtop.vit.ac.in/vtop/examinations/processDigitalAssignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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

          var due_date = await get_dates(table_inner)
            .then((data) => data)
            .catch((err) => console.log(err));

          due_date.length > 0 &&
            due_date.forEach(async (due) => {
              await calendar(due.date, `${desc_str} ${due.name}`);
            });

          chrome.notifications.create("Done", {
            type: "basic",
            iconUrl: "logo.png",
            title: "Sync done for" + classid,
            message: classid,
          });
        })
        .catch((err) => console.log(err));
    }
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
    var parser = new DOMParser();
    var DOM = parser.parseFromString(request.DOM, "text/html");
    assignments(DOM);
  }
});
