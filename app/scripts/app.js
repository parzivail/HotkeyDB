$(document).ready(function() {
	var search = $("#search");

	search.autocomplete({
		serviceUrl: "http://keybind.parzivail.com/api/v1/key/program",
		transformResult: function(response) {
			return {
				suggestions: JSON.parse(response)
			};
		}
	});

	search.keydown(function(e)
	{
		if (e.keyCode == 13)
		{
			$(".inputbox").css("top", "10%");
		}
	});
});
