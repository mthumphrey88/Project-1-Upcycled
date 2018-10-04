$(document).ready(function() {
	$.LoadingOverlay("show", {text: "Loading..."});

	session.init();
	session.login();

	modal.init(session);

	grid.init(session);
});