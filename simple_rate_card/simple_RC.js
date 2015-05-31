$(document).ready(function() {
	/* temp */
	alert("This is still a WIP...so no, it wont work 100% properly yet...")

	/* toggle control panel */
	$(".input-toggle").click(function() {
		$(".user_inputs").toggleClass("open-panel", 400)
	});
	$(".user_inputs").click(function(event) {
		event.stopPropagation()
	});
	$(document).click(function() {
		$(".user_inputs").removeClass("open-panel", 400)
	});

	/* reset form */
	$("#reset-inputs").click(function() {
		document.getElementById("form-inputs").reset()
	});

	/* define rate card values 
		twitter base (distro) = 6.18
		insta base (distro) = 9.10
		face base (distro) = 5.20

		creation premium = *1.375

		must add click function to store a user input value?

	*/
	twitter = 618/100;
	instagram = 910/100;
	facebook = 520/100;
	contentDistro = 1;
	contentCreate = 1375/1000;
	prodVal = $("#prodValInput").val();
	addVal = $("#addValInput").val();


	/* adding lines to the rate card */
	$("#add-to-rc").click(function() {
		$(".RC_output tbody").append(
			"<tr>" +
				"<td>Product</td>" +
				"<td>Platform</td>" +
				"<td>Prod Val</td>" +
				"<td>A.V.</td>" +
				"<td>client cost</td>" +
				"<td>eCPM</td>" +
				"<td>TR</td>" +
				"<td><a href='#' class='remove-row-btn'><span class='ui-icon ui-icon-minusthick'></span></a></td>" +
			"</tr>"
		)
	});

	/* remove rows from rate card */
	$(".tb-btn-group #clear-tb").click(function() {
		$("tbody tr").remove()
	});
	$("tbody").on("click", ".remove-row-btn", function() {
		$(this).parent().parent().remove()
	});

	/* download to excel */
	$("#download").click(function() {
		var tableJSON = $('#rate-card-table').tableToJSON();
		if(tableJSON == '')
        	return;
        var fileName = prompt("Name your excel file:");
        JSONToCSVConvertor(tableJSON, fileName, true); 
	});
});