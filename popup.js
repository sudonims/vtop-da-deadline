function chrome_() {
  try {
    chrome !== undefined && browser !== undefined;
    return browser;
  } catch (e) {
    console.log(e.message);
    return chrome;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var pause = document.getElementById("pause");
  var resume = document.getElementById("resume");
  var signin = document.getElementById("signin");
  var signout = document.getElementById("signout");
  var loginContainer = document.getElementById("loginContainer");
  var logoutContainer = document.getElementById("logoutContainer");
  chrome_().storage.local.get(["pause"], function (data) {
    if (data.pause) {
      pause.style.display = "none";
      resume.style.display = "visible";
    } else {
      pause.style.display = "visible";
      resume.style.display = "none";
    }
  });
  chrome_().storage.local.get(["token"], function (data) {
    if (data.token) {
      loginContainer.style.display = "none";
      logoutContainer.style.display = "visible";
    } else {
      loginContainer.style.display = "visible";
      logoutContainer.style.display = "none";
    }
  });

  pause.addEventListener("click", function () {
    chrome_().storage.local.set({ pause: true }, function () {
      chrome_().notifications.create("Paused", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Paused",
        message: "ExVTOP has been paused, you'll not receive updates.",
      });
      window.close();
    });
  });
  document.querySelector(".github").addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://github.com/sudonims/vtop-da-deadline",
    });
    window.close();
    return false;
  });
  resume.addEventListener("click", function () {
    chrome_().storage.local.set({ pause: false }, function () {
      chrome_().notifications.create("Resumed", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Resumed",
        message: "ExVTOP has been resumed. Enjoy!",
      });
      window.close();
    });
  });

  signin.addEventListener("click", function () {
    console.log(chrome_().identity.getRedirectURL());
    window.close();
    chrome_().runtime.sendMessage({ message: "login" }, function (response) {
      if (response === "success") {
      }
    });
  });

  signout.addEventListener("click", function () {
    chrome_().storage.local.get(["token"], async function (token) {
      console.log(token.token);
      await fetch("https://oauth2.googleapis.com/revoke?token=" + token.token, {
        method: "POST",
        body: "",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => res)
        .then((data) => {
          console.log(data);
          chrome_().notifications.create("Sign Out", {
            type: "basic",
            iconUrl: "logo.png",
            title: "Signed Out",
            message: "Signed Out from Google",
          });
        });
    });
  });
});
