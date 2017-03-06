$(document).ready(function() {

	var searchInput = $('.search input'),
		searchClose = $('.search .icon-close');

	searchInput.on('focus', function() {
		$(this).parent().addClass('expand');
		$(this).attr('placeholder', '');
	});

	searchClose.on('click', function() {
		searchInput.parent().removeClass('expand');
		searchInput.attr('placeholder', 'Search').val('');
	});

});