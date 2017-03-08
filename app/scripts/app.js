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

	var specials = {
		"~ES": {
			cap: "Esc",
			specialColor: true
		},
		"~T": {
			cap: "Tab",
			specialColor: true
		},
		"~CL": {
			cap: "Caps Lock",
			specialColor: true
		},
		"~S": {
			cap: "Shift",
			specialColor: true
		},
		"~FN": {
			cap: "Fn",
			specialColor: true
		},
		"~C": {
			cap: "Ctrl",
			specialColor: true
		},
		"~W": {
			cap: "Win",
			specialColor: true
		},
		"~A": {
			cap: "Alt",
			specialColor: true
		},
		"~SP": {
			cap: "Space",
			specialColor: true
		},
		"~P": {
			cap: "PrtSc",
			specialColor: true
		},
		"~PU": {
			cap: "PgUp",
			specialColor: true
		},
		"~PD": {
			cap: "PgDn",
			specialColor: true
		},
		"~H": {
			cap: "Home",
			specialColor: true
		},
		"~E": {
			cap: "End",
			specialColor: true
		},
		"~I": {
			cap: "Ins",
			specialColor: true
		},
		"~D": {
			cap: "Del",
			specialColor: true
		},
		"~B": {
			cap: "Backspace",
			specialColor: true
		},
		"~EN": {
			cap: "Enter",
			specialColor: true
		},
		"~LA": {
			cap: "←",
			specialColor: false
		},
		"~RA": {
			cap: "→",
			specialColor: false
		},
		"~UA": {
			cap: "↑",
			specialColor: false
		},
		"~DA": {
			cap: "↓",
			specialColor: false
		}
	};

	var fixCap = function (cap) {
		var up = cap.toUpperCase().trim();
		var spec = specials[up];
		if (!spec)
			return {
				cap: up,
				special: false
			};
		return spec;
	};

	var createShortcut = function (item) {
		if (item.type == "key")
			return createKey(fixCap(item.data));
		else
			return "";
	};

	var createKey = function (cap) {
		return '<div class="key' + (cap.specialColor ? " key_fn" : "") + '"><div class="keycap' + (cap.specialColor ? " keycap_fn" : "") + '">' + cap.cap + '</div></div>';
	};

	var parseKeybindWindows = function (serverResponse) {
		var final = "";
		$.each(JSON.parse(serverResponse.keybind), function (idx, item) {
			if (!item.consecutive)
				final += "<div class='nonconsecutive'>then</div>";
			final += createShortcut(item);
		});
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
					tablebody.append('<tr><td class="kb_name">' + item.name + '</td><td><span class="shortcut">' + parseKeybindWindows(item) + '</td><td class="kb_desc">' + item.desc + '</td><td class="kb_context">' + item.context + '</td></tr>');
				});
				keybindlist.removeClass("hidden");
				keybindlist.animateCss('fadeIn');
			});
		}
	});
});
