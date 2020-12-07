document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("lol").addEventListener("click", function () {
    signin();
  });
});

function signin() {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log(token);
  });
}
