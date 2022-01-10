/*// pages: {pathname: string: [title: string, pathnames_needed_to_be_scraped_from_original: string[]]}
const pages = {
	"/grades": {title: "Grades", original: ["/guardian/home.html"]},
};
// name of page (pathname)
var current_scraping_page: string;
var current_page: string;

function injectLoginPage() {
	history.pushState(null, "Login", "/login");
	let scraping_iframe = injectIFrames()[0];
	document.getElementById("LoginForm").setAttribute("target", scraping_iframe.getAttribute("name"));
	autoLogin();
}

// automatically logs into powerschool
function autoLogin() {
	let username_tag = document.getElementById("fieldAccount"),
		password_tag = document.getElementById("fieldPassword"),
		login_raw = localStorage.getItem("powerschool-login");
	if (!username_tag || !password_tag)
		return;
	if (login_raw) {
		// if login for powerschool in localStorage, enter username, enter password, and submit form
		let login = JSON.parse(login_raw);
		username_tag.setAttribute("value", login["username"]);
		password_tag.setAttribute("value", login["password"]);
		document.getElementById("btn-enter-sign-in").click();
	} else {
		// otherwise, have the manually-entered username and password be stored in localStorage for next time user visits page
		document.getElementById("LoginForm").addEventListener("submit", () => {
			localStorage.setItem("powerschool-login", JSON.stringify({
				username: username_tag ? username_tag["value"] : "",
				password: password_tag ? password_tag["value"] : "",
			}));
		});
		console.log("Please enter username and password to allow auto-login to work the next time you visit this page");
	}
}

function injectMainPage() {
	let pathname = "/grades";
	for (let [page_pathname, {original}] of Object.entries(pages))
		if (original.includes(location.pathname))
			pathname = page_pathname;
	history.pushState(null, pages[pathname].title, pathname);
	let [scraping_iframe, main_iframe] = injectIFrames();
	scraping_iframe.setAttribute("src", pages[pathname].original[0]) // FIXME: THIS
	main_iframe.style.visibility = "visible";
}

function injectIFrames(): [HTMLIFrameElement, HTMLIFrameElement] {
	let scraping_iframe = document.createElement("iframe");
	scraping_iframe.setAttribute("name", "powerschool_improved_scraping");
	scraping_iframe.setAttribute("style", "visibility:hidden;");
	document.body.appendChild(scraping_iframe);
	let main_iframe = document.createElement("iframe");
	main_iframe.setAttribute("name", "powerschool_improved_main");
	main_iframe.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999; visibility:hidden;");
	document.body.appendChild(main_iframe);
	let first_scraping_iframe_load = true;
	scraping_iframe.addEventListener("load", () => {
		console.log("NEW SCRAPING_IFRAME: " + scraping_iframe.contentWindow.location.pathname);
		if (first_scraping_iframe_load) {
			initMainPage(scraping_iframe, main_iframe);
			first_scraping_iframe_load = false;
		}
		current_scraping_page = scraping_iframe.contentWindow.location.pathname;
	});
	main_iframe.addEventListener("load", () => console.log("NEW MAIN_IFRAME: " + main_iframe.contentWindow.location.pathname));
	return [scraping_iframe, main_iframe];
}

function initMainPage(scraping_iframe: HTMLIFrameElement, main_iframe: HTMLIFrameElement) {
	let scraping_window = scraping_iframe.contentWindow,
		main_window = main_iframe.contentWindow;
}

if (document.getElementById("LoginForm"))
	injectLoginPage();
else if (location.href.includes("aps.powerschool.com"))
	injectMainPage();
else
	alert("Extension only valid on aps.powerschool.com");*/
