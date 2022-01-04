javascript: (() => {
	if (!document.baseURI.includes("aps.powerschool.com"))
		return;
	let script_tag = document.createElement("script");
	fetch("https://raw.githubusercontent.com/dev-gm/powerschool-improved/main/dist.js")
		.then(response => response.text())
		.then(code => {
			script_tag.text = code;
			script_tag.setAttribute("id", "powerschool-improved-script");
			document.body.appendChild(script_tag);
		})
		.catch(err => alert(`Failed to load code\n${err}`));
})();
