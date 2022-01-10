const pages: {[path: string]: {title: string, getState: () => Object, template: string, nav: boolean}} = {
	"login": {title: "Login", getState: () => ({page_order}), template: `
		<input id="username-input" type="text" />
		<input id="password-input" type="password" />
		<a id="submit-btn">SUBMIT</a>
	`, nav: false},
	"grades": {title: "Grades", getState: () => ({stuff: "STUFF"}), template: "<b>{stuff}</b>", nav: true},
};

const scraping_iframe_name = "scraping-iframe";
const page_order_storage = "powerschool-page-order";
const login_storage = "powerschool-login";

const nav_contents = "<nav><b>{page_order.0}</b></nav>";
const head_contents = {
	getState: () => ({}),
	template: `<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
<link rel="icon" type="image/png" href="/android-chrome-512x512.png" sizes="512x512">
<link rel="icon" type="image/png" href="/favicon-196x196.png" sizes="196x196">
<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="/favicon-128.png" sizes="128x128">
<link rel="shortcut icon" href="/favicon.ico">`,
};
const global_css_contents = {getState: () => ({}), template: ``};

let page_order = JSON.parse(localStorage.getItem(page_order_storage));
if (!page_order) {
	page_order = ["grades", "schedule", "forms"];
	localStorage.setItem(page_order_storage, JSON.stringify(page_order));
}

var first_time_switching = true;

async function injectLoginPage() {
	const login = async (username: string, password: string) => {
		return fetch("/guardian/home.html", {
			method: "POST",
			mode: "same-origin",
			headers: {
				"Accept": "text/plain",
				"Content-Type": "application/x-www-form-urlencoded",
				"Referer": "https://aps.powerschool.com/public/",
			},
			body: new URLSearchParams({account: username, pw: password}).toString(),
		})
			.then(res => {
				if (!res.ok)
					alert("Username or password incorrect");
				else
					switchToPage(page_order[0]);
				return res.ok;
			})
			.catch(err => alert("Failed to log in\n"+err));
	};
	let login_data = JSON.parse(localStorage.getItem(login_storage));
	if (login_data && login_data["username"] && login_data["password"]) {
		if (await login(login_data["username"], login_data["password"]))
			return;
		alert("Stored username/password was incorrect, please enter it now");
		localStorage.removeItem(login_storage);
	}
	switchToPage("login");
	document.getElementById("submit-btn").addEventListener("click", async () => {
		let login_data = {};
		for (const type of ["username", "password"])
			login_data[type] = document.getElementById(`${type}-input`)["value"];
		if (await login(login_data["username"], login_data["password"]))
			localStorage.setItem(login_storage, JSON.stringify(login_data));
	});
}

function injectLoggedInPage(page: string) {
	if (!Object.keys(pages).includes(page))
		return;
	switchToPage(page);
}

function switchToPage(page: string) {
	document.getElementById("main").innerHTML = processTemplate(
		nav_contents + pages[page].template,
		pages[page].getState(),
	);
	document.title = pages[page].title;
	if (!first_time_switching)
		return history.pushState(page, pages[page].title, '/'+page);
	document.head.innerHTML = processTemplate(
		head_contents.template,
		head_contents.getState(),
	);
	history.replaceState(page, pages[page].title, '/'+page);
	first_time_switching = false;
}

function processTemplate(template: string, state: Object): string {
	template = template.replace(/(\r\n|\r|\n|\t)/gm, "");
	let out = "";
	let prev = 0;
	for (
		let i = template.indexOf('{');
		i !== -1 && prev < template.length;
		i = template.indexOf('{', i+1)
	) {
		let next = template.indexOf('}', i);
		if (i > 0 && template[i-1] === '\\' ||
			next > 0 && template[next-1] === '\\')
			continue;
		if (next < 0) {
			console.log("Failed to parse template: no closing bracket");
			break;
		}
		out += template.substring(prev, i);
		let temp: any = state;
		for (const part of template.substring(i+1, next).split('.')) {
			if (parseInt(part))
				temp = temp[parseInt(part)];
			else
				temp = temp[part];
		}
		out += temp;
		prev = next+1;
	}
	if (prev < template.length)
		out += template.substring(prev);
	return out;
}

window.addEventListener("popstate", ({state}) => switchToPage(state));

document.body.innerHTML = `<div id="main">${document.body.innerHTML}</div><style>${processTemplate(
	global_css_contents.template,
	global_css_contents.getState(),
)}</style>`;

if (location.href.includes("aps.powerschool.com")) {
	if (location.pathname.includes("public"))
		injectLoginPage();
	else if (page_order.includes(location.pathname.substring(1)))
		injectLoggedInPage(location.pathname.substring(1));
	else
		injectLoggedInPage(page_order[0]);
}
