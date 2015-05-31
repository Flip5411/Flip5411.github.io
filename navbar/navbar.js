$(document).ready(function() {
	$(".button").hover(
		function() {$(this).addClass("btn-hover");},
		function() {$(this).removeClass("btn-hover");}
	);
	$("#in-here-btn").click(function(event) {
		event.stopPropagation();
		$("#internal-links").toggle();
		$("#external-links").hide();
	});
	$("#out-there-btn").click(function(event) {
		event.stopPropagation();
		$("#external-links").toggle();
		$("#internal-links").hide();
	});
	$(".dropdown-menu").click(function(event) {
		event.stopPropagation();
	});
	$(document).click(function() {
		$(".dropdown-menu").hide();
	});   
});