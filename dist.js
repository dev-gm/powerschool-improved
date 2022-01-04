"use strict";
function injectLoginPage() {
    var username_tag = document.getElementById("fieldAccount"), password_tag = document.getElementById("fieldPassword"), submit_btn_tag = document.getElementById("btn-enter-sign-in"), login_raw = localStorage.getItem("powerschool-login");
    if (username_tag == null || password_tag == null || submit_btn_tag == null)
        return;
    submit_btn_tag.addEventListener("click", function () {
        var new_window = window.open("https://aps.powerschool.com/guardian/");
        if (new_window != null) {
            new_window.addEventListener("load", function () {
                var script_tag = document.getElementById("powerschool-improved-script");
                if (new_window != null)
                    new_window.document.appendChild(script_tag ? script_tag : document.createElement("script"));
                window.close();
            });
        }
    });
    if (login_raw != null) {
        // if login for powerschool in localStorage, enter username, enter password, and submit form
        var login = JSON.parse(login_raw);
        username_tag.setAttribute("value", login["username"]);
        password_tag.setAttribute("value", login["password"]);
        submit_btn_tag.click();
    }
    else {
        // otherwise, have the manually-entered username and password be stored in localStorage for next time user visits page
        submit_btn_tag.addEventListener("click", function () {
            localStorage.setItem("powerschool-login", JSON.stringify({
                username: username_tag ? username_tag.getAttribute("value") : "",
                password: password_tag ? password_tag.getAttribute("value") : ""
            }));
        });
        alert("Please enter username and password to allow auto-login to work the next time you visit this page");
    }
}
function injectHomePage() { }
if (location.href.includes("aps.powerschool.com/public"))
    injectLoginPage();
else if (location.href.includes("aps.powerschool.com/guardian"))
    injectHomePage();
