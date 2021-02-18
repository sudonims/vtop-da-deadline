document.addEventListener("DOMContentLoaded", function () {
  var pause = document.getElementById("pause");
  var resume = document.getElementById("resume");
  var signin = document.getElementById("signin");

  chrome.storage.sync.get(["pause"], function (data) {
    if (data.pause) {
      pause.style.display = "none";
      resume.style.display = "visible";
    } else {
      pause.style.display = "visible";
      resume.style.display = "none";
    }
  });

  pause.addEventListener("click", function () {
    chrome.storage.sync.set({ pause: true }, function () {
      chrome.notifications.create("Paused", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Paused",
        message: "Extension Paused",
      });
    });
  });

  resume.addEventListener("click", function () {
    chrome.storage.sync.set({ pause: false }, function () {
      chrome.notifications.create("Resumed", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Resumed",
        message: "Extension Resumed",
      });
    });
  });

  signin.addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      console.log(token);
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?key=AIzaSyDPdTOzaUqLP_c08kWOu4QWSSyKEgnAwsM",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data));
    });
  });
});
