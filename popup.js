document.addEventListener("DOMContentLoaded", function () {
  var pause = document.getElementById("pause");
  var resume = document.getElementById("resume");

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
});
