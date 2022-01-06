function injectLoginPage() {
    var form_tag = document.getElementById("LoginForm");
    if (form_tag == null)
        return;
    // creates an iframe, makes it so that login form, on submission, puts response into iframe instead of current page
    var iframe_tag = document.createElement("iframe");
    iframe_tag.setAttribute("name", "powerschool_improved_home");
    iframe_tag.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999; visibility:hidden");
    iframe_tag.addEventListener("load", function () { return injectLoggedInPage(iframe_tag.contentWindow); });
    document.body.appendChild(iframe_tag);
    // if 'back' button is pressed, go back to that state
    window.addEventListener("popstate", function (e) {
        if (e.state) {
            iframe_tag.contentWindow.document.write(e.state.innerHTML);
            document.title = e.state.title;
        }
    });
    // only set iframe to visible when form is submitted so that form can be clicked on (not covered by iframe)
    form_tag.addEventListener("submit", function () { return iframe_tag.style.visibility = "visible"; });
    form_tag.setAttribute("target", "powerschool_improved_home");
    // automatically logs into powerschool
    var username_tag = document.getElementById("fieldAccount"), password_tag = document.getElementById("fieldPassword"), submit_btn_tag = document.getElementById("btn-enter-sign-in"), login_raw = localStorage.getItem("powerschool-login");
    if (username_tag == null || password_tag == null || submit_btn_tag == null)
        return;
    if (login_raw != null) {
        // if login for powerschool in localStorage, enter username, enter password, and submit form
        var login = JSON.parse(login_raw);
        username_tag.setAttribute("value", login["username"]);
        password_tag.setAttribute("value", login["password"]);
        submit_btn_tag.click();
    }
    else {
        // otherwise, have the manually-entered username and password be stored in localStorage for next time user visits page
        form_tag.addEventListener("submit", function () {
            localStorage.setItem("powerschool-login", JSON.stringify({
                username: username_tag ? username_tag["value"] : "",
                password: password_tag ? password_tag["value"] : ""
            }));
        });
        console.log("Please enter username and password to allow auto-login to work the next time you visit this page");
    }
}
function injectLoggedInPage(page_window) {
    // save current title and html so that it can be returned to when user presses 'back' button
    history.pushState({
        title: page_window.document.title,
        innerHTML: page_window.document.documentElement.innerHTML
    }, page_window.document.title, page_window.location.pathname);
    document.title = page_window.document.title;
    console.log("NON-LOGIN PAGE NOT A FEATURE YET (you can continue using this as normal):\nTITLE = " + document.title);
}
if (location.href.includes("aps.powerschool.com/public"))
    injectLoginPage();
else if (location.href.includes("aps.powerschool.com/guardian"))
    injectLoggedInPage(window);
