$(document).ready(function() {
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

	/* define constant variables */
	distCPMtwit = 6175/1000;
	creatCPMtwit = 10969/1000;
	distCPMinst = 9100/1000;
	creatCPMinst = 13500/1000;
	distCPMface = 5200/1000;
	creatCPMface = 8438/1000;
	totalProdVal = 0;
	totalAddVal = 0;
	totalClientCost = 0;
	totalECPM = 0;
	totalImpressions = 0;

	/* function to add or remove currency format */
	addMoneyFormat = function(obj) {
		return obj.toString().replace(/^\b/g, "$").replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};
	addThousandsFormat = function(obj) {
		return obj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};
	removeMoneyFormat = function(obj) {
		return +obj.toString().replace(/\$/g, "").replace(/,/g, "");
	};  

	/*  define function for calculating and displaying RC totals */
	calcTotalRC = function() {
		$(".RC_output #prodVal").each(function() {
			totalProdVal += removeMoneyFormat($(this).text());
		});
		$(".RC_output #addVal").each(function() {
			totalAddVal += removeMoneyFormat($(this).text());
		});
		$(".RC_output #impressions").each(function() {
			totalImpressions += removeMoneyFormat($(this).text());
		});
		totalClientCost = totalProdVal - totalAddVal;
		totalECPM = totalClientCost/totalImpressions*1000;

		$(".RC_output #totalProdVal").text(addMoneyFormat(totalProdVal.toFixed(2)));
		$(".RC_output #totalAddVal").text(addMoneyFormat(totalAddVal.toFixed(2)));
		$(".RC_output #totalClientCost").text(addMoneyFormat(totalClientCost.toFixed(2)));
		$(".RC_output #totalECPM").text(addMoneyFormat(totalECPM.toFixed(2)));
		$(".RC_output #totalImpressions").text(addThousandsFormat(totalImpressions));

		totalProdVal = 0;
		totalAddVal = 0;
		totalClientCost = 0;
		totalECPM = 0;
		totalImpressions = 0;
	};

	/* adding lines to the rate card */
	$("#add-to-rc").click(function() {
		/* set platform choices */
		twitter_chk = $("#selectPlatTwit").prop("checked");
		instagram_chk = $("#selectPlatInsta").prop("checked");
		facebook_chk = $("#selectPlatFb").prop("checked");
		if ((twitter_chk || instagram_chk || facebook_chk) === false) {
			alert("You must select at least 1 platform");
			return;
		};
		platSelection = [];
		distCPMs = [];
		creatCPMs = [];
		var i = 0;
		if (twitter_chk) {
			platSelection[i] = " Twitter";
			distCPMs[i] = distCPMtwit;
			creatCPMs[i] = creatCPMtwit;
			i++;
		};
		if (instagram_chk) {
			platSelection[i] = " Instagram";
			distCPMs[i] = distCPMinst;
			creatCPMs[i] = creatCPMinst;
			i++;
		};
		if (facebook_chk) {
			platSelection[i] = " Facebook";
			distCPMs[i] = distCPMface;
			creatCPMs[i] = creatCPMface;
			i++;
		};

		/* set product choices */
		if ($("#selectProdDistro").prop("checked")) {
			prodChoice = "Content Distribution";
			prodCPMs = distCPMs;
		} else {
			prodChoice = "Content Creation";
			prodCPMs = creatCPMs;
		};

		blendCPM = 0;
		for (var j = 0; j < prodCPMs.length; j++) {
			blendCPM += prodCPMs[j]/prodCPMs.length;
		};

		/* store budget inputs */
		prodVal = $("#prodValInput").val();
		prodVal = +prodVal.replace(/,/g, "");
		addVal = $("#addValInput").val();
		addVal = +addVal.replace(/,/g, "");
		if ((prodVal == "" || isNaN(prodVal)) && isNaN(addVal)) {
			alert("Please make sure your Product and Added Value are valid numbers. Product Value cannot be 0");
				$("#prodValInput").val("50000");
				$("#addValInput").val("0");
				return;
		};
		if (prodVal == "" || isNaN(prodVal)) {
			alert("Please make sure your Product Value is greater than 0 and is a valid number");
			$("#prodValInput").val("50000");
			return;
		};
		if (isNaN(addVal)) {
			alert("Please make sure your Added Value is a valid number");
			$("#addValInput").val("0");
			return;
		};

		/* calculate remaining values */
		clientCost = prodVal-addVal;
		impressions = prodVal*1000/blendCPM;
		eCPM = clientCost/(impressions/1000);

		/* writing lines to the table */
		$(".RC_output tbody").append(
			"<tr>" +
				"<td>" + prodChoice + "</td>" +
				"<td>" + platSelection + "</td>" +
				"<td id='prodVal'>" + addMoneyFormat(prodVal.toFixed(2)) + "</td>" +
				"<td id='addVal'>" + addMoneyFormat(addVal.toFixed(2)) + "</td>" +
				"<td>" + addMoneyFormat(clientCost.toFixed(2)) + "</td>" +
				"<td>" + addMoneyFormat(eCPM.toFixed(2)) + "</td>" +
				"<td id='impressions'>" + addThousandsFormat(impressions.toFixed(0)) + "</td>" +
				"<td><a href='#' class='remove-row-btn'><span class='ui-icon ui-icon-minusthick'></span></a></td>" +
			"</tr>"
		);

		calcTotalRC();
	});

	/* remove rows from rate card */
	// clear table
	$(".tb-btn-group #clear-tb").click(function() {
		$("tbody tr").remove();
		$(".RC_output tfoot td:not(:nth-child(2))").empty();	
	});
	// remove row
	$("tbody").on("click", ".remove-row-btn", function() {
		$(this).parent().parent().remove();
		calcTotalRC();
		if (+$(".RC_output #totalImpressions").text() == 0)
			$(".RC_output tfoot td:not(:nth-child(2))").empty();
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