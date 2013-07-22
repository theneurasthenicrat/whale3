function displayInitialTimeSlots() {
    for (i = 0; document.getElementById("timeSlot" + i) != null && document.getElementById("timeSlotInput" + i).value != '---'; i++) {
	document.getElementById("timeSlot" + i).style.display = 'block';
    }
}

function displayInitialCandidates() {
    for (i = 0; document.getElementById("candidate" + i) != null && document.getElementById("candidateInput" + i).value != '---'; i++) {
	document.getElementById("candidate" + i).style.display = 'block';
    }
}

function addCandidate(number) {
    document.getElementById("candidateInput" + number).value = "";
    $( "#candidate" + number).fadeIn();//style.display = 'block';
    $( "#addCandidate" + (number)).fadeOut();//style.display = 'none';
}

function removeCandidate(number) {
    var i = 0;
    for (i=number; document.getElementById("candidate" + i) != null && document.getElementById("candidate" + i).style.display != 'none'; i++) {
	if (document.getElementById("candidateInput" + (i + 1)) != null) {
	    document.getElementById("candidateInput" + i).value = document.getElementById("candidateInput" + (i + 1)).value;
	    document.getElementById("date" + i).value = document.getElementById("date" + (i + 1)).value;
	    document.getElementById("timeSlotLabel" + i).value = document.getElementById("timeSlotLabel" + (i + 1)).value;
	} else {
	    document.getElementById("candidateInput" + i).value = "---";
	    document.getElementById("date" + i).value = "---";
	    document.getElementById("timeSlotLabel" + i).value = "---";
	}
    }
    $( "#candidate" + (i - 1)).fadeOut(function() {
	document.getElementById("candidateInput" + (i - 1)).value = '---';
    });
    if (document.getElementById("addCandidate" + i) != null) {
	document.getElementById("addCandidate" + (i - 1)).style.display = document.getElementById("addCandidate" + i).style.display;
    }
}


function addTimeSlot(number) {
    document.getElementById("timeSlotInput" + number).value = "";
    $( "#timeSlot" + number).slideDown();//style.display = 'block';
    $( "#addTimeSlot" + (number)).hide();//style.display = 'none';
}

function removeTimeSlot(number) {
    var i = 0;
    for (i=number; document.getElementById("timeSlot" + i) != null && document.getElementById("timeSlot" + i).style.display != 'none'; i++) {
	if (document.getElementById("timeSlotInput" + (i + 1)) != null) {
	    document.getElementById("timeSlotInput" + i).value = document.getElementById("timeSlotInput" + (i + 1)).value;
	} else {
	    document.getElementById("timeSlotInput" + i).value = "---";
	}
    }
    $( "#timeSlot" + (i - 1)).fadeOut(function() {
	document.getElementById("timeSlotInput" + (i - 1)).value = '---';
    });
    if (document.getElementById("addTimeSlot" + i) != null) {
	document.getElementById("addTimeSlot" + (i - 1)).style.display = document.getElementById("addTimeSlot" + i).style.display;
    }
}

function showTSDiv() {
    displayInitialTimeSlots();
    show('addTimeSlots');
    hide('buttonAddTimeSlots');
}

function confirmTimeSlots() {
    var timeSlotsArray = new Array(100);
    var currentCandidate  = -1;
    for (i = 0; i < 100; i++) {
	timeSlotsArray[i] = document.getElementById("candidateInput" + i).value == "---" ? "zzz" : document.getElementById("candidateInput" + i).value;
	if (currentCandidate == -1 && timeSlotsArray[i] == "zzz") {
	    currentCandidate = i;
	}
    }
    for (i = 0; i < dateArray.length && currentCandidate < 100; i++) {
	for (j = 0; document.getElementById("timeSlotInput" + j) != null && document.getElementById("timeSlotInput" + j).value != "---" && document.getElementById("timeSlotInput" + j).value != "" && currentCandidate < 100; j++) {
	    timeSlotsArray[currentCandidate] = dateArray[i] + "#" + prefix + j + "#" + document.getElementById("timeSlotInput" + j).value;
	    currentCandidate++;
	}
    }
    if (currentCandidate > 99) {
	alert("The number of candidates exceeds the maximal number (100).");
    } else {
	timeSlotsArray.sort();
	var k = 0;
	for (; k < timeSlotsArray.length && timeSlotsArray[k] != "zzz" && timeSlotsArray[k] != ""; k++) {
	    var currentArray = timeSlotsArray[k].split(regexp);	    
	    document.getElementById("date" + k).value = currentArray[0];
	    document.getElementById("timeSlotLabel" + k).value = currentArray[2];
	    document.getElementById("candidateInput" + k).value = (timeSlotsArray[k] == "zzz" ? "---" : timeSlotsArray[k]);
	    show("candidate" + k);
	}
	for (; k < timeSlotsArray.length &&timeSlotsArray[k] != ""; k++) {
	    hide("candidate" + k);
	    document.getElementById("date" + k).innerHTML = "";
	    document.getElementById("timeSlotLabel" + k).innerHTML = "";
	    document.getElementById("candidateInput" + k).value = (timeSlotsArray[k] == "zzz" ? "---" : timeSlotsArray[k]);
	}
    }
    prefix = "z" + prefix;

    document.getElementById("timeSlotInput0").value = '';
    $( "#addTimeSlot1" ).fadeIn();
    for (var i = 1; document.getElementById("timeSlot" + i) != null; i++) {
	document.getElementById("timeSlotInput" + i).value = '---';
	document.getElementById("timeSlot" + i).style.display = 'none';
    }
    $( "#timeSlots" ).fadeOut();

    $('#calendar').multiDatesPicker('resetDates');

    dateArray = [];


/*    hide('addTimeSlots');
    show('buttonAddTimeSlots');*/
}

// Un tableau contenant les dates pour pouvoir les trier
var dateArray = [];
// A prefix for ordering the candidates
var prefix = "";
// The regexp
var regexp = new RegExp("#", "g");


$(document).ready(function() {
    displayInitialTimeSlots();
    displayInitialCandidates();

    // Initialisation du calendrier des dates et ajout des dates dans l'ordre dans un formulaire
    if($( "#calendar" ).length>0){
        $( "#calendar" ).multiDatesPicker({
            dateFormat: "yy-mm-dd",
            altField: "#selectedDate"
        });

        // Un tableau contenant les ID des <input> du plugin SheepIt
        $("#calendar").click(function(){
	    dateArray = $('#calendar').multiDatesPicker('getDates');

	    if (dateArray.length) {
		$( "#timeSlots" ).fadeIn();
	    } else {
		$( "#timeSlots" ).fadeOut();
	    }

	    document.getElementById("nbSelectedDates").innerHTML = (dateArray.length == 0 ? "" : (dateArray.length == 1 ? document.getElementById("hiddenLabelFor").innerHTML + " " + dateArray[0] : document.getElementById("hiddenLabelForThese").innerHTML + " " + dateArray.length + " " + document.getElementById("hiddenLabelDates").innerHTML));

        });
    };      
		      document.onkeypress = interceptKeyEvent; 
		      
		  });


function interceptKeyEvent(evt) {
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if ((evt.keyCode == 13) && (node.getAttribute('id').substr(0, 13) == "timeSlotInput")) {confirmTimeSlots(); return false;}
    return true;
}


function showNextOnTab(event, number) {
    if (event.keyCode == 9) {
	addTimeSlot(number + 1);
    }
    if (event.keyCode == 8 && number != 0 && document.getElementById("timeSlotInput" + number).value == "") {
	removeTimeSlot(number);
    }
}