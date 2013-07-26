function displayInitialCandidates() {
    for (i = 0; document.getElementById("candidate" + i) != null && document.getElementById("candidateInput" + i).value != '---'; i++) {
	document.getElementById("candidate" + i).style.display = 'block';
    }
}

function add(number) {
    document.getElementById("candidateInput" + number).value = "";
    $( "#candidate" + number).slideDown();//style.display = 'block';
    $( "#add" + (number)).hide(); //.style.display = 'none';
}

function remove(number) {
    var i = 0;
    for (i=number; document.getElementById("candidate" + i) != null && document.getElementById("candidate" + i).style.display != 'none'; i++) {
	if (document.getElementById("candidateInput" + (i + 1)) != null) {
	    document.getElementById("candidateInput" + i).value = document.getElementById("candidateInput" + (i + 1)).value;
	} else {
	    document.getElementById("candidateInput" + i).value = "---";
	}
    }
    $( "#candidate" + (i - 1)).slideUp(function() {
					   document.getElementById("candidateInput" + (i - 1)).value = '---';
					   if (document.getElementById("add" + i) != null) {
					       document.getElementById("add" + (i - 1)).style.display = document.getElementById("add" + i).style.display;
					   }
					   document.getElementById("candidateInput" + (i - 2)).focus();
				    });

}

function displayInfo(select) {
    for (i = 0; i < select.options.length; i++) {
	$( "#" + select.name + select.options[i].value).hide();
    }
    $( "#" + select.name + select.options[select.selectedIndex].value).show();
}

function displayRanks(select) {
    if(select.options[select.selectedIndex].value == "ranks") {
	show("ranksDiv");
    } else {
	hide("ranksDiv");
    }
}

function showNextOnTab(event, number) {
    if (event.keyCode == 9) {
/*    	if (event.preventDefault) {
    		event.preventDefault();
    	}*/    	
    	add(number + 1);
    	//event.returnValue = false;
    }
    if (event.keyCode == 8 && number != 0 && document.getElementById("candidateInput" + number).value == "") {
	remove(number);
    }
}