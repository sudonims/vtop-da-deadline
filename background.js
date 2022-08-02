// Listens for request to URL https://vtop.vit.ac.in/vtop/examinations/doDigitalAssignment and notifies content.js

// let chrome_() = chrome && browser ? browser : chrome; // Automatically chooses between chrome or firefox
function chrome_() {
  try {
    chrome !== undefined && browser !== undefined;
    return browser;
  } catch (e) {
    console.log(e.message);
    return chrome;
  }
}

async function getVtopUri() {
  return new Promise((resolve) => {
    chrome_().storage.local.get(["VTOP_URI"], async function (data) {
      resolve(data.VTOP_URI);
    });
  });
}

chrome_().webRequest.onCompleted.addListener(
  async (details) => {
    const URI = await getVtopUri().then((uri) => uri);
    if (details.url === `${URI}/vtop/examinations/doDigitalAssignment`) {
      // This line adds the content script to the page as vtop uses history.push() to remove history.
      chrome_().tabs.executeScript(null, { file: "content.js" });
      chrome_().tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
          chrome_().tabs.sendMessage(tabs[0].id, { urlVisited: true });
        }
      );
    }
  },
  { urls: ["https://vtop.vit.ac.in/vtop/*", "https://vtopcc.vit.ac.in/vtop/*"] }
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
  return new Promise((resolve, reject) => {
    chrome_().storage.local.get(["token"], async function (token) {
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&sendNotifications=true&alt=json&key=<API_KEY>",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token.token,
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
        })
        .catch((err) => {
          console.log(err);
          reject("Error");
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

    var scripts = DOM.getElementsByTagName("noscript");
    var csrf = scripts[0].nextElementSibling.textContent.split('"')[3];

    // calendar("05-Jun-2021", "blah");
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
      const URI = await getVtopUri().then((uri) => uri);

      await fetch(`${URI}/vtop/examinations/processDigitalAssignment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `authorizedID=${regNo}&x=${new Date().toGMTString()}&classId=${classid}&_csrf=${csrf}`,
      })
        .then((res) => res.text())
        .then(async (data) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(data, "text/html");

          var table_inner =
            doc.getElementsByClassName("customTable")[1].children[1];

          var due_date = await get_dates(table_inner)
            .then((data) => data)
            .catch((err) => console.log(err));

          if (due_date.length > 0) {
            due_date.forEach(async (due) => {
              await calendar(due.date, `${desc_str} ${due.name}`);
            });
            chrome_().notifications.create("Done", {
              type: "basic",
              iconUrl: "logo.png",
              title: "Sync done for " + classid,
              message: desc_str,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  } catch (err) {
    console.log(err);
  }
}

chrome_().runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message === "sync") {
    var parser = new DOMParser();
    var DOM = parser.parseFromString(request.DOM, "text/html");
    assignments(DOM);
  } else if (request.message === "login") {
    var redirect_uri = "";
    try {
      redirect_uri =
        chrome && browser
          ? "http://127.0.0.1/mozoauth2/acd05041bb94a471df45afa67715fcbc49508039/"
          : chrome_().identity.getRedirectURL();
    } catch (e) {
      console.log(e.message);
      redirect_uri = chrome_().identity.getRedirectURL();
    }

    console.log(redirect_uri);
    var url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      "<CLIENT_ID>.apps.googleusercontent.com"
    )}&response_type=${encodeURIComponent(
      "token"
    )}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/calendar"
    )}&state=${encodeURIComponent(
      "cal" + Math.random().toString(36).substring(2, 15)
    )}&prompt=${encodeURIComponent("consent")}`;
    console.log(url);
    chrome_().identity.launchWebAuthFlow(
      {
        url: url,
        interactive: true,
      },
      function (redirect_url) {
        if (chrome_().runtime.lastError) {
          console.log(chrome_().runtime.lastError);
        } else {
          console.log(redirect_url);
          let id_token = redirect_url.substring(
            redirect_url.indexOf("access_token=") + 13
          );
          id_token = id_token.substring(0, id_token.indexOf("&"));
          console.log(id_token);
          chrome_().storage.local.set({ token: id_token }, () => {
            console.log("set");
            chrome_().notifications.create("Sign In", {
              type: "basic",
              iconUrl: "logo.png",
              title: "Sign In",
              message: "Sign In Success",
            });
            sendResponse("success");
          });
        }
      }
    );
  }
});
