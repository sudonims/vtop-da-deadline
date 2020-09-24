function find_right_due(table_inner) {
  return new Promise((resolve) => {
    for (let i = 0; i < table_inner.children.length; i++) {
      var check = table_inner.children[i].children[6].children.length;
      if (check == 0) {
        var dwnld = table_inner.children[i].children[5].children.length;
        var code =
          table_inner.children[i].children[7].children[0].children[0]
            .children[0].value;
        var code2 =
          table_inner.children[i].children[7].children[0].children[0]
            .children[1].value;
        // console.log(code, code2);
        resolve({
          due: table_inner.children[i].children[4].children[0].innerHTML,
          download:
            dwnld > 0
              ? table_inner.children[i].children[5].children[0].children[0]
              : document.createElement("div"),
          code: {
            code: code,
            code2: code2,
          },
        });
      }
    }
    resolve({
      due: "Nothing Left. Cheers!",
      download: document.createElement("div"),
      code: {
        code: "-1",
        code2: "-1",
      },
    });
  });
}

function generateSubmit(classid, code, code2, index) {
  var td_ = document.createElement("td");
  return new Promise(function (resolve) {
    if (code === "-1" || code2 === "-1") {
      td_.innerHTML = "done";
    } else {
      td_.innerHTML = `
            <form role="form" id="daUpload${index}" name="daUpload" method="post" autocomplete="off">
                <span>
                    <input type="file" class="btn" accept=".xls,.xlsx,.pdf,.doc,.docx" id="studDaUpload" name="studDaUpload" required="required" style="display: block;">
                </span> 
                <span>
                    <span> 
                        <input type="hidden" name="code" value="${code}"> 
                        <input type="hidden" name="opt" value="${code2}">
                        <span>
                            <input type="button" name="action" class="btn btn-primary" value="Submit" onclick="javascript:custom_submit_by_me('${classid}','${code}','${index}');">
                            <input type="button" name="action" class="btn btn-primary" value="Cancel" onclick="javascript:doCancelAssgnUpload('${classid}');">
                        </span> 
                    </span>
                </span>
                <a class="btn btn-link" href="javascript:vtopDownload('examinations/downloadSTudentDA/${code}/${classid}')"></a>
            </form>`;
    }
    // console.log(td_);
    resolve(td_);
  });
}

async function assignments() {
  try {
    var regNo = document.getElementById("authorizedIDX").value;
    var table = document.getElementsByClassName("customTable")[0].children[0];
    var now_ = new Date().getTime();
    //     var script = document.createElement("script");

    //     script.text = `
    //     /*<![CDATA[*/

    //     async function custom_submit_by_me(classid, mode, index) {
    //         var a = await doDAssignmentProcess(classid, mode, index).then(function(data) {
    //             return data;
    //         });
    //         console.log(a);
    //         if (a === "okay") {
    //           doSaveDigitalAssignment(classid, mode, index);
    //         } else {
    //           alert("Failed. Try normal method");
    //         }
    //     }

    //     function doDAssignmentProcess(classId, mode, index) {
    //         var myform = document.getElementById("daUpload"+index);
    //         var fd = new FormData(myform);

    //         // $
    //         //         .blockUI({

    //         //             message : '<img src="assets/img/482.GIF"> loading... Just a moment...'
    //         //         });

    //         var authorizedID = "${regNo}";
    //         var now = new Date();
    //         params = "authorizedID=" + authorizedID + "&x="
    //                 + now.toUTCString() + "&classId=" + classId + "&mode="
    //                 + mode;

    //         return new Promise(function(resolve) {
    //             $.ajax({
    //                 url : "examinations/processDigitalAssignmentUpload",
    //                 type : "POST",
    //                 data : params,

    //                 success : function(response) {
    //                     // $.unblockUI();
    //                     resolve("okay");
    //                 }

    //             });
    //         })
    //     }

    //     function reload(semesterSubId) {

    //         var myform = document.getElementById("daUpload");
    //         var fd = new FormData(myform);

    //         // $
    //         //         .blockUI({

    //         //             message : '<img src="assets/img/482.GIF"> loading... Just a moment...'
    //         //         });

    //         var authorizedID = document.getElementById("authorizedID").value;
    //         var now = new Date();
    //         params = "authorizedID=" + authorizedID + "&x="
    //                 + now.toUTCString() + "&semesterSubId=" + semesterSubId;

    //         $.ajax({
    //             url : "examinations/doDigitalAssignment",
    //             type : "POST",
    //             data : params,

    //             success : function(response) {
    //                 // $.unblockUI();
    //                 $("#main-section").html(response);

    //             }

    //         });
    //     }

    //     function doSaveDigitalAssignment(classId, mCode, index) {
    //         var myform = document.getElementById("daUpload"+index);
    //         console.log(myform)
    //         var fd = new FormData(myform);

    //         fd.append("classId", classId);
    //         fd.append("mCode", mCode);

    //         $
    //                 .blockUI({
    //                     message : '<img src="assets/img/482.GIF"> loading... Just a moment...'
    //                 });
    //         $.ajax({
    //             url : "examinations/doDAssignmentUploadMethod",
    //             type : "POST",
    //             data : fd,
    //             cache : false,
    //             processData : false,
    //             contentType : false,
    //             success : function(response) {
    //                 $.unblockUI();

    //                 alert("Done")
    //             }

    //         });
    //     }

    //     function doCancelAssgnUpload(classId) {
    //         var authorizedID = "${regNo}"
    //         var now = new Date();
    //         params = "authorizedID=" + authorizedID + "&x="
    //                 + now.toUTCString() + "&classId=" + classId;
    //         $
    //                 .blockUI({

    //                     message : '<img src="assets/img/482.GIF"> loading... Just a moment...'
    //                 });

    //         $.ajax({
    //             url : "examinations/processDigitalAssignment",
    //             type : "POST",
    //             data : params,
    //             success : function(response) {
    //                 $.unblockUI();

    //                 $("#main-section").html(response);

    //             }

    //         });
    //     }

    //     /*]]>*/
    // `;
    //     document.getElementById("main-section").appendChild(script);
    var dis = document.getElementsByClassName("icon-button");
    for (let i = 0; i < dis.length; i++) {
      dis[i].disabled = true;
    }
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
            var due = new Date(due_date.due.replace(/-/g, " ")).getTime();
            var color =
              (due - now_) / (3600 * 24 * 1000) <= 2 ? "red" : "green";
            table.children[
              i
            ].children[3].innerHTML += `<span style="display:inline; float:right; color:${color};">${due_date.due}</span>`;
            table.children[i].children[3].children[0].appendChild(
              due_date.download
            );
            // var extra_td = await generateSubmit(
            //   classid,
            //   due_date.code.code,
            //   due_date.code.code2,
            //   i
            // ).then((data) => data);
            // table.children[i].appendChild(extra_td);
          })
          .catch((err) => console.log(err));
      }
    }
    for (let i = 0; i < dis.length; i++) {
      dis[i].disabled = false;
    }
  } catch (err) {
    console.log(err);
  }
}

// Message passing between background and content
// This removes the need for clicking in body to see due dates as it checks URL requests to find whether user has visited DA page.
var loaded = false;
chrome.runtime.onMessage.addListener(function (request) {
  if (request.urlVisited && !loaded) {
    loaded = true;
    assignments();
  }
});
