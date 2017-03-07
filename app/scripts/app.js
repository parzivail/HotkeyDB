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

	var createShortcut = function (item) {
		var keybind = item.keybind;
		var keys = keybind.split("_");
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
			else if (key == "\\t")
				final += '<span class="key">TAB</span>';
			else if (key == "\\plus")
				final += '<span class="key">+</span>';
			else if (key == "then")
				final += ' then ';
			else
				final += '<span class="key">' + key.toUpperCase() + '</span>';
		});

		if (item.altKeybind != "" && item.altKeybind != undefined) {
			final += " (Alternate: ";

			var altkeybind = item.altKeybind;
			var altkeys = altkeybind.split("_");

			$.each(altkeys, function (idx, key) {
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
				else if (key == "\\t")
					final += '<span class="key">TAB</span>';
				else if (key == "\\plus")
					final += '<span class="key">+</span>';
				else if (key == "\\then")
					final += ' then ';
				else
					final += '<span class="key">' + key.toUpperCase() + '</span>';
			});

			final += ")";
		}

		return final;
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
