const templates: {[path: string]: {title?: string, template: string, getState: () => Object}} = ((filename: string) => {
	let request = new XMLHttpRequest();
	request.open("GET", filename, false);
	request.send(null);
	if (request.status !== 200) {
		console.log(`Failed to GET '${filename}'\n${request}`);
	} else {
		let out = {};
		let raw = JSON.parse(request.responseText) as
			{[path: string]: {title: string, template: string, get_state: string}};
		for (const [name, {title, template, get_state}] of Object.entries(raw))
			out[name] = {title, template, getState: () => {let res = eval(get_state); return res ? res : {}}};
		return out;
	}
})("https://raw.githubusercontent.com/dev-gm/powerschool-improved/main/templates.json");

const HEAD_TEMPLATE = "head";
const CSS_TEMPLATE = "css";
const NAV_TEMPLATE = "nav";

const SCRAPING_IFRAME_NAME = "scraping-iframe";
const PAGE_ORDER_KEY = "powerschool-page-order";
const LOGIN_DATA_KEY = "powerschool-login";

var page_order = JSON.parse(localStorage.getItem(PAGE_ORDER_KEY));
if (!page_order) {
	page_order = ["grades", "schedule", "forms"];
	localStorage.setItem(PAGE_ORDER_KEY, JSON.stringify(page_order));
}

var is_logged_in = (() => {
	let request = new XMLHttpRequest();
	request.open("GET", "/guardian/home.html", false);
	request.send(null);
	return request.responseURL.includes("/guardian/home.html");
})();

var first_time_switching = true;

async function injectLoginPage() {
	if (is_logged_in)
		return switchToPage(page_order[0]);
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
				if (!res.ok) {
					alert("Username or password incorrect");
				} else {
					is_logged_in = true;
					switchToPage(page_order[0]);
				}
				return res.ok;
			})
			.catch(err => alert("Failed to log in\n"+err));
	};
	let login_data = JSON.parse(localStorage.getItem(LOGIN_DATA_KEY));
	if (login_data && login_data["username"] && login_data["password"]) {
		if (await login(login_data["username"], login_data["password"]))
			return;
		alert("Stored username/password was incorrect, please enter it now");
		localStorage.removeItem(LOGIN_DATA_KEY);
	}
	switchToPage("login");
	document.getElementById("submit-btn").addEventListener("click", async () => {
		let login_data = {};
		for (const type of ["username", "password"])
			login_data[type] = document.getElementById(`${type}-input`)["value"];
		if (await login(login_data["username"], login_data["password"]))
			localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(login_data));
	});
}

function injectLoggedInPage(page: string) {
	if (page_order.includes(page) && is_logged_in)
		switchToPage(page);
	else if (!page_order.includes(page))
		switchToPage(page_order[0]);
	else
		injectLoginPage();
}

function switchToPage(page: string) {
	if (!templates[page] || templates[page].title === null)
		return;
	if (is_logged_in && page === "login")
		return switchToPage("login");
	if (!is_logged_in && page !== "login")
		return switchToPage(page_order[0]);
	document.getElementById("main").innerHTML = processTemplate(page);
	document.title = templates[page].title;
	if (!first_time_switching)
		return history.pushState(page, templates[page].title, '/'+page);
	document.head.innerHTML = processTemplate("head");
	history.replaceState(page, templates[page].title, '/'+page);
	first_time_switching = false;
}

function processTemplate(name: string): string {
	let template = templates[name].template.replace(/(\r\n|\r|\n|\t)/gm, "");
	let state = templates[name].getState();
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

document.body.innerHTML = 
	`<div id="main">${document.body.innerHTML}</div><style>${processTemplate(CSS_TEMPLATE)}</style>`;

if (location.href.includes("aps.powerschool.com")) {
	if (!is_logged_in)
		injectLoginPage();
	else if (page_order.includes(location.pathname.substring(1)))
		injectLoggedInPage(location.pathname.substring(1));
	else
		injectLoggedInPage(page_order[0]);
} else {
	alert("You must be on powerschool to use this");
}
