javascript: (() => {
	if (!document.baseURI.includes("aps.powerschool.com"))
		return;
	let script_tag = document.createElement("script");
	fetch("raw.githubusercontent.com/dev-gm/powerschool-improved/main/dist.js", {
		mode: "no-cors",
		headers: {
			Accept: "text/plain",
		},
	})
		.then(response => response.text())
		.then(code => {
			script_tag.text = code;
			document.body.appendChild(script_tag);
		})
		.catch(err => alert(`Failed to load code\n${err}`));
})();
