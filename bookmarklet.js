javascript: (() => {
	if (!document.baseURI.includes("aps.powerschool.com"))
		location.href = "https://aps.powerschool.com/";
	fetch("https://raw.githubusercontent.com/dev-gm/powerschool-improved/main/dist.js")
		.then(res => res.text())
		.then(eval)
		.catch(err => alert("Failed to load code\n" + err));
})();
