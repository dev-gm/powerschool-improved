function injectLoginPage() {
	var username_tag = document.getElementById("fieldAccount"),
		password_tag = document.getElementById("fieldPassword"),
		sumbit_btn_tag = document.getElementById("btn-enter-sign-in"),
		login = JSON.parse(localStorage.getItem("powerschool-login"));
	if (login && login.username && login.password) {
		// if login for powerschool in localStorage, enter username, enter password, and submit form
		username_tag.value = login.username;
		password_tag.value = login.password;
		document.getElementById("btn-enter-sign-in").click("submit");
	} else {
		// otherwise, have the manually-entered username and password be stored in localStorage for next time user visits page
		document.getElementById("btn-enter-sign-in").addEventListener("click", () => {
			localStorage.setItem("powerschool-login", JSON.stringify({
				username: username_tag.value,
				password: password_tag.value,
			}));
		});
		alert("Please enter username and password to allow auto-login to work the next time you visit this page");
	}
}

function injectHomePage() {}

if (location.href.includes("aps.powerschool.com/public"))
	injectLoginPage();
else if (location.href.includes("aps.powerschool.com/guardian"))
	injectHomePage();
