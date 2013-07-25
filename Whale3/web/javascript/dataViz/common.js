
// Declares the list of data visualization elements
var graphs = {
    "strictRanks": [],
    "ranks": [],
    "positiveNegative": [],
    "numbers": []
};

// Some global variables needed by all data visualization charts
var candidates = new Object();
var votes = new Object();
var json = new Object();

////////////////////////////////////////////////////////////////
// A few global functions needed by the visualization page

// Display the list of data visualization thumbnails
function displayThumbnails() {
    var dataVizTab = new Array();
    switch (json.preferenceModel.id.substring(0, 5)) {
    case "posit":
	dataVizTab = graphs.positiveNegative;
	break;
    case "ranks":
	dataVizTab = (json.preferenceModel.id.substring(json.preferenceModel.id.length - 1, json.preferenceModel.id.length) == "1") ? graphs.ranks : graphs.strictRanks;
	break;
    case "numbe":
	dataVizTab = graphs.numbers;
	break;
    }

    var thumbsDiv = d3.select("#dataVizThumbnails");
    var thumbs  = thumbsDiv.selectAll(".dataVizThumb")
	.data(dataVizTab);

    thumbs.enter().append("div")
	.attr("class", "dataVizThumb")
	.attr("id", function(d, i) {return "dataVizThumb" + i;})
	.attr("onClick", function(d, i) {return "showDataViz(" + i + ", \"" + d.title + "\", \"" + d.description  + "\", " + d.initFunction + ", " + d.updateFunction + ")";});

    thumbs.append("div")
	.attr("class", "dataVizPlaceholder")
	.append("img")
	.attr("alt", function(d, i) {return d.title;})
	.attr("src", function(d, i) {return d.placeholderPicture;});

    var insideDivs = thumbs.append("div")
	.attr("class", "insideDiv");

    insideDivs.append("h2")
	.text(function(d, i) {return d.title;});

    insideDivs.append("div")
	.attr("class", "dataVizShortDescription")
	.html(function(d, i) {return d.shortDescription;});
}

// Function called when a data visualization thumbnail is clicked
function showDataViz(i, title, description, init, update) {
    
    for (k = 0; document.getElementById("dataVizThumb" + k) != null; k++) {
	$("#dataVizThumb" + k).fadeTo('slow', k != i ? 0.5 : 1);
	$("#dataVizThumb" + k).removeClass("selected");
	$("#dataVizThumb" + k).off('mouseenter mouseleave');
	if (k != i) {
	    $("#dataVizThumb" + k).hover(function(){$(this).fadeTo('fast', 1);}, function(){$(this).fadeTo('fast', 0.5);});
	}
    }

    $("#dataVizThumb" + i).addClass("selected");


    var toRemove = $("#currentDataViz").children();
    d3.selectAll(toRemove).remove();
    
    d3.select("#currentDataViz").append("h2")
	.text(title);

    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizDescription")
	.html(description);

    init();
    update();
}

