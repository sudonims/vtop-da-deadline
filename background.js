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
            id: btoa(date + event)
              .toLowerCase()
              .slice(0, 8),
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
        .then(async (res) => {
          if (res.status === 200) {
            await chrome.storage.sync.get(["eventids"], function (data) {
              var a = data.eventids;
              a.push(res.json().id);
              chrome.storage.sync.set(
                {
                  eventids: a,
                },
                () => {
                  console.log(data.eventids);
                }
              );
            });
          }
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
          console.log(classid, due_date);
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
