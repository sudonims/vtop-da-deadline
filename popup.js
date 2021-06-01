document.addEventListener("DOMContentLoaded", function () {
  var pause = document.getElementById("pause");
  var resume = document.getElementById("resume");
  var signin = document.getElementById("signin");
  var signout = document.getElementById("signout");

  chrome.storage.sync.get(["pause"], function (data) {
    if (data.pause) {
      pause.style.display = "none";
      resume.style.display = "visible";
    } else {
      pause.style.display = "visible";
      resume.style.display = "none";
    }
  });

  // chrome.identity.getAuthToken({ interactive: true }, async function (token) {
  //   if (token) {
  //     console.log(token);
  //     signin.style.display = "none";
  //     signout.style.display = "visible";
  //   } else {
  //     signin.style.display = "visible";
  //     signout.style.display = "none";
  //   }
  // });

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
    chrome.runtime.sendMessage({ message: "login" }, function (response) {
      if (response === "success") window.close();
    });

    // chrome.identity.getAuthToken({ interactive: true }, async function (token) {
    //   if (!chrome.runtime.lastError) {
    //     alert1(token);
    //     console.log(token);
    //     chrome.notifications.create("Sign In", {
    //       type: "basic",
    //       iconUrl: "logo.png",
    //       title: "Signed In",
    //       message: "Signed In",
    //     });
    //   } else {
    //     if (
    //       chrome.runtime.lastError.message ===
    //       "The user turned off browser signin"
    //     ) {
    //       chrome.notifications.create("User Sign In", {
    //         type: "basic",
    //         iconUrl: "logo.png",
    //         title: "Can't sign in",
    //         message:
    //           "User turned off browser signin, turn it on in settings. Google for more info",
    //       });
    //     } else {
    //       console.log(chrome.runtime.lastError.message);
    //       chrome.notifications.create("Error", {
    //         type: "basic",
    //         iconUrl: "logo.png",
    //         title: "Can't sign in",
    //         message: "Error Occured. Send logs to github",
    //       });
    //     }
    //   }
    // });
  });

  signout.addEventListener("click", function () {
    chrome.identity.clearAllCachedAuthTokens(() => {
      chrome.notifications.create("Sign Out", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Signed Out",
        message: "Signed Out",
      });
    });
  });
  // chrome.identity.launchWebAuthFlow(
  //   {
  //     url: "https://accounts.google.com/logout",
  //     interactive: true,
  //   },
  //   function (tokenUrl) {}
  // );
  // });
});
