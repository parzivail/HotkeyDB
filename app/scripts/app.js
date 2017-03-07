$(document).ready(function () {
	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function () {
				$(this).removeClass('animated ' + animationName);
			});
		}
	});

	var programs = [];
	var programAutocomplete = [];
	var apiUrl = "http://keybind.parzivail.com/api/v1/key/program/";

	var search = $("#search");

	$.getJSON(apiUrl, function (json) {
		programs = json;

		programAutocomplete = programs.map(function (item) {
			return {value: item.friendlyName, data: item.id};
		});

		// Don't need to filter out dupes -- API does this automatically
		// programAutocomplete = $.grep(programAutocomplete, function (item, pos) {
		// 	return programAutocomplete.map(function (e) {
		// 			return e.id;
		// 		}).indexOf(item.id) == pos;
		// });

		search.autocomplete({
			lookup: programAutocomplete,
			onSelect: function (suggestion) {
				var press = jQuery.Event("keydown");
				press.ctrlKey = false;
				press.which = -9999;
				search.trigger(press);
			}
		});

		window.setTimeout(function () {
			search.focus();
		}, 500);
	});

	var createKeyFromCap = function (key, final) {
		if (key == "\\c")
			final += createKey("Ctrl", true);
		else if (key == "\\s")
			final += createKey("Shift", true);
		else if (key == "\\a")
			final += createKey("Alt", true);
		else if (key == "\\f")
			final += createKey("Fn", true);
		else if (key == "\\w")
			final += createKey("Win", true);
		else if (key == "\\t")
			final += createKey("Tab", true);
		else if (key.toLowerCase() == "space")
			final += createKey("Space", true);
		else if (key.toLowerCase() == "home")
			final += createKey("Home", true);
		else if (key.toLowerCase() == "esc" || key.toLowerCase() == "escape")
			final += createKey("Esc", true);
		else if (key.toLowerCase() == "del" || key.toLowerCase() == "delete")
			final += createKey("Delete", true);
		else if (key.toLowerCase() == "enter" || key.toLowerCase() == "return")
			final += createKey("Enter", true);
		else if (key.toLowerCase() == "backspace")
			final += createKey("Backspace", true);
		else if (key.toLowerCase() == "end")
			final += createKey("End", true);
		else if (key == "\\plus")
			final += createKey("+");
		else if (key.toLowerCase() == "left arrow")
			final += createKey("←");
		else if (key.toLowerCase() == "right arrow")
			final += createKey("→");
		else if (key.toLowerCase() == "up arrow")
			final += createKey("↑");
		else if (key.toLowerCase() == "down arrow")
			final += createKey("↓");
		else if (key == "then")
			final += ' then ';
		else
			final += createKey(key.toUpperCase());
		return final;
	};
	var createShortcut = function (item) {
		var keybind = item.keybind;
		var keys = keybind.split("_");
		var final = "";

		$.each(keys, function (idx, key) {
			final = createKeyFromCap(key, final);
		});

		if (item.altKeybind != "" && item.altKeybind != undefined) {
			final += " (Alternate: ";

			var altkeybind = item.altKeybind;
			var altkeys = altkeybind.split("_");

			$.each(altkeys, function (idx, key) {
				final = createKeyFromCap(key, final);
			});

			final += ")";
		}

		return final;
	};

	var createKey = function (capText, special) {
		return '<div class="key' + (special ? " key_fn" : "") + '"><div class="keycap' + (special ? " keycap_fn" : "") + '">' + capText + '</div></div>';
	};

	var getId = function (friendlyName) {
		var ret = "";
		$.each(programs, function (idx, item) {
			if (item.friendlyName == friendlyName)
				ret = item.id;
		});
		return ret;
	};

	search.keydown(function (e) {
		if (e.which == -9999) {
			$(".inputbox").css("top", "10%");

			$.getJSON(apiUrl + getId(search.val()), function (data) {
				var tablebody = $("#tablebody");
				var keybindlist = $("#keybindlist");
				tablebody.html("");
				$.each(data, function (idx, item) {
					//<span class="key">CTRL</span>+<span class="key">Shift</span>+<span class="key">T</span></span>
					tablebody.append('<tr><td>' + item.name + '</td><td><span class="shortcut">' + createShortcut(item) + '</td><td>' + item.desc + '</td><td>' + item.context + '</td></tr>');
				});
				keybindlist.removeClass("hidden");
				keybindlist.animateCss('fadeIn');
			});
		}
	});
});
