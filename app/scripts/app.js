$(document).ready(function () {
	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function () {
				$(this).removeClass('animated ' + animationName);
			});
		}
	});

	var search = $("#search");

	search.autocomplete({
		serviceUrl: "http://keybind.parzivail.com/api/v1/key/program",
		transformResult: function (response) {
			return {
				suggestions: $.grep(JSON.parse(response), function (item, idx) {
					return item.indexOf(search.val().trim()) >= 0;
				})
			};
		}
	});

	window.setTimeout(function () {
		search.focus();
	}, 500);

	var createShortcut = function (item) {
		var keybind = item.keybind;
		var keys = keybind.split("\+");
		var final = "";

		$.each(keys, function (idx, key) {
			if (key == "\\c")
				final += '<span class="key">CTRL</span>';
			else if (key == "\\s")
				final += '<span class="key">SHIFT</span>';
			else if (key == "\\a")
				final += '<span class="key">ALT</span>';
			else if (key == "\\f")
				final += '<span class="key">FN</span>';
			else if (key == "\\w")
				final += '<span class="key">WIN</span>';
			else if (key == "then")
				final += ' then ';
			else
				final += '<span class="key">' + key + '</span>';
		});

		return final;
	};

	search.keydown(function (e) {
		if (e.keyCode == 13) {
			$(".inputbox").css("top", "10%");

			$.getJSON("http://keybind.parzivail.com/api/v1/key/program/" + search.val(), function (data) {
				var tablebody = $("#tablebody");
				tablebody.html("");
				$.each(data, function (idx, item) {
					//<span class="key">CTRL</span>+<span class="key">Shift</span>+<span class="key">T</span></span>
					tablebody.append('<tr><td>' + item.name + '</td><td><span class="shortcut">' + createShortcut(item) + '</td><td>' + item.desc + '</td><td>' + item.context + '</td></tr>');
				});
				$("#keybindlist").removeClass("hidden");
				$('#keybindlist').animateCss('fadeIn');
			});
		}
	});
});
