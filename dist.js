var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var templates = (function (filename) {
    var request = new XMLHttpRequest();
    request.open("GET", filename, false);
    request.send(null);
    if (request.status !== 200) {
        console.log("Failed to GET '".concat(filename, "'\n").concat(request));
    }
    else {
        var out = {};
        var raw = JSON.parse(request.responseText);
        var _loop_1 = function (name_1, title, template, getState) {
            out[name_1] = { title: title, template: template, getState: function () {
                    var res = eval("(() => {".concat(getState, "})()"));
                    return res ? res : {};
                } };
        };
        for (var _i = 0, _a = Object.entries(raw); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], _c = _b[1], title = _c.title, template = _c.template, getState = _c.getState;
            _loop_1(name_1, title, template, getState);
        }
        return out;
    }
})("https://raw.githubusercontent.com/dev-gm/powerschool-improved/main/templates.json");
var HEAD_TEMPLATE = "head";
var CSS_TEMPLATE = "css";
var NAV_TEMPLATE = "nav";
var SCRAPING_IFRAME_NAME = "scraping-iframe";
var PAGE_ORDER_KEY = "powerschool-page-order";
var LOGIN_DATA_KEY = "powerschool-login";
var page_order = JSON.parse(localStorage.getItem(PAGE_ORDER_KEY));
if (!page_order) {
    page_order = ["grades", "schedule", "forms"];
    localStorage.setItem(PAGE_ORDER_KEY, JSON.stringify(page_order));
}
var is_logged_in = (function () {
    var request = new XMLHttpRequest();
    request.open("GET", "/guardian/home.html", false);
    request.send(null);
    return request.responseURL.includes("/guardian/home.html");
})();
var first_time_switching = true;
function injectLoginPage() {
    return __awaiter(this, void 0, void 0, function () {
        var login, login_data;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (is_logged_in)
                        return [2, switchToPage(page_order[0])];
                    login = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2, fetch("/guardian/home.html", {
                                    method: "POST",
                                    mode: "same-origin",
                                    headers: {
                                        "Accept": "text/plain",
                                        "Content-Type": "application/x-www-form-urlencoded",
                                        "Referer": "https://aps.powerschool.com/public/"
                                    },
                                    body: new URLSearchParams({ account: username, pw: password }).toString()
                                })
                                    .then(function (res) {
                                    if (!res.ok) {
                                        alert("Username or password incorrect");
                                    }
                                    else {
                                        is_logged_in = true;
                                        switchToPage(page_order[0]);
                                    }
                                    return res.ok;
                                })["catch"](function (err) { return alert("Failed to log in\n" + err); })];
                        });
                    }); };
                    login_data = JSON.parse(localStorage.getItem(LOGIN_DATA_KEY));
                    if (!(login_data && login_data["username"] && login_data["password"])) return [3, 2];
                    return [4, login(login_data["username"], login_data["password"])];
                case 1:
                    if (_a.sent())
                        return [2];
                    alert("Stored username/password was incorrect, please enter it now");
                    localStorage.removeItem(LOGIN_DATA_KEY);
                    _a.label = 2;
                case 2:
                    switchToPage("login");
                    document.getElementById("submit-btn").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                        var login_data, _i, _a, type;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    login_data = {};
                                    for (_i = 0, _a = ["username", "password"]; _i < _a.length; _i++) {
                                        type = _a[_i];
                                        login_data[type] = document.getElementById("".concat(type, "-input"))["value"];
                                    }
                                    return [4, login(login_data["username"], login_data["password"])];
                                case 1:
                                    if (_b.sent())
                                        localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(login_data));
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    });
}
function injectLoggedInPage(page) {
    if (page_order.includes(page) && is_logged_in)
        switchToPage(page);
    else if (!page_order.includes(page))
        switchToPage(page_order[0]);
    else
        injectLoginPage();
}
function switchToPage(page) {
    if (!templates[page] || templates[page].title === null)
        return;
    if (is_logged_in && page === "login")
        return switchToPage("login");
    if (!is_logged_in && page !== "login")
        return switchToPage(page_order[0]);
    document.getElementById("main").innerHTML = processTemplate(page);
    document.title = templates[page].title;
    if (!first_time_switching)
        return history.pushState(page, templates[page].title, '/' + page);
    document.head.innerHTML = processTemplate("head");
    history.replaceState(page, templates[page].title, '/' + page);
    first_time_switching = false;
}
function processTemplate(name) {
    var template = templates[name].template.replace(/(\r\n|\r|\n|\t)/gm, "");
    var state = templates[name].getState();
    var out = "";
    var prev = 0;
    for (var i = template.indexOf('{'); i !== -1 && prev < template.length; i = template.indexOf('{', i + 1)) {
        var next = template.indexOf('}', i);
        if (i > 0 && template[i - 1] === '\\' ||
            next > 0 && template[next - 1] === '\\')
            continue;
        if (next < 0) {
            console.log("Failed to parse template: no closing bracket");
            break;
        }
        out += template.substring(prev, i);
        var temp = state;
        for (var _i = 0, _a = template.substring(i + 1, next).split('.'); _i < _a.length; _i++) {
            var part = _a[_i];
            if (parseInt(part))
                temp = temp[parseInt(part)];
            else
                temp = temp[part];
        }
        out += temp;
        prev = next + 1;
    }
    if (prev < template.length)
        out += template.substring(prev);
    console.log("STATE: " + Object.entries(state));
    console.log("TEMPLATE: " + template);
    console.log("OUT: " + out);
    return out;
}
window.addEventListener("popstate", function (_a) {
    var state = _a.state;
    return switchToPage(state);
});
document.body.innerHTML =
    "<div id=\"main\">".concat(document.body.innerHTML, "</div><style>").concat(processTemplate(CSS_TEMPLATE), "</style>");
if (location.href.includes("aps.powerschool.com")) {
    if (!is_logged_in)
        injectLoginPage();
    else if (page_order.includes(location.pathname.substring(1)))
        injectLoggedInPage(location.pathname.substring(1));
    else
        injectLoggedInPage(page_order[0]);
}
else {
    alert("You must be on powerschool to use this");
}
