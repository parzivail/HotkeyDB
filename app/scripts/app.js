$(document).ready(function() {
	$("#search").autocomplete({
		paramName: "",
		serviceUrl: "http://keybind.parzivail.com/api/v1/key/program",
		transformResult: function(response) {
			return {
				suggestions: JSON.parse(response)
			};
		}
	});
});
