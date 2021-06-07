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

  chrome_().storage.local.get(["pause"], function (data) {
    if (data.pause) {
      pause.style.display = "none";
      resume.style.display = "visible";
    } else {
      pause.style.display = "visible";
      resume.style.display = "none";
    }
  });

  // chrome_().identity.getAuthToken({ interactive: true }, async function (token) {
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
    chrome_().storage.local.set({ pause: true }, function () {
      chrome_().notifications.create("Paused", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Paused",
        message: "Extension Paused",
      });
    });
  });

  resume.addEventListener("click", function () {
    chrome_().storage.local.set({ pause: false }, function () {
      chrome_().notifications.create("Resumed", {
        type: "basic",
        iconUrl: "logo.png",
        title: "Resumed",
        message: "Extension Resumed",
      });
    });
  });

  signin.addEventListener("click", function () {
    console.log(chrome_().identity.getRedirectURL());
    chrome_().runtime.sendMessage({ message: "login" }, function (response) {
      if (response === "success") {
      }
    });

    // chrome_().tabs.create({ url: "index.html" });

    // chrome_().identity.getAuthToken({ interactive: true }, async function (token) {
    //   if (!chrome_().runtime.lastError) {
    //     alert1(token);
    //     console.log(token);
    //     chrome_().notifications.create("Sign In", {
    //       type: "basic",
    //       iconUrl: "logo.png",
    //       title: "Signed In",
    //       message: "Signed In",
    //     });
    //   } else {
    //     if (
    //       chrome_().runtime.lastError.message ===
    //       "The user turned off browser signin"
    //     ) {
    //       chrome_().notifications.create("User Sign In", {
    //         type: "basic",
    //         iconUrl: "logo.png",
    //         title: "Can't sign in",
    //         message:
    //           "User turned off browser signin, turn it on in settings. Google for more info",
    //       });
    //     } else {
    //       console.log(chrome_().runtime.lastError.message);
    //       chrome_().notifications.create("Error", {
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
            message: "Signed Out",
          });
        });
    });
  });
});
