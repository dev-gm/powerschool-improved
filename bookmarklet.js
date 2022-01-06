javascript: (() => {
	if (!document.baseURI.includes("aps.powerschool.com"))
		location.href = "https://aps.powerschool.com/";
	fetch("https://raw.githubusercontent.com/dev-gm/powerschool-improved/main/dist.js")
		.then(response => response.text())
		.then(code => {
			let script_tag = document.createElement("script");
			script_tag.setAttribute("text", code);
			script_tag.setAttribute("id", "powerschool-improved-script");
			document.body.appendChild(script_tag);
		})
		.catch(err => alert(`Failed to load code\n${err}`));
})();
