
var divWidth;
var divHeight;

var initRunoff = function() {
    // Global variables required by runoff-based methods...
    runoffVector = new Array();

    runoffVector[0] = STV(candidates, votes);
    runoffVector[1] = twoRoundsMajority(candidates, votes);

    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizControl")
	.append("label")
	.text("Procedure:");

    d3.select("#currentDataViz div.dataVizControl").append("select")
	.attr("name", "runoffProcedure")
	.attr("id", "runoffProcedure")
	.attr("onchange", "updateRunoff()");

    d3.select("#runoffProcedure").append("option")
	.attr("selected", "selected")
	.text("STV");

    d3.select("#runoffProcedure").append("option")
	.text("Two round majority");
    
    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizInsideDiv")
	.append("svg")
	.attr("id", "runoffViz")
	.attr("class", "dataViz");

    divWidth = $("#currentDataViz").width();
    divHeight = $("#currentDataViz").height();
};

var updateRunoff = function() {
    var colorTab = ["#c31616", "#e1dd38", "#b8da40"];
    var runoffSelect = document.getElementById("runoffProcedure");
    
    updateRunoffViz(deepClone(runoffVector[runoffSelect.selectedIndex]), "runoffViz", divWidth * 4 / 5, divHeight * 0.9, {"top": 20, "bottom": 20, "right": 20, "left": 20}, colorTab);
};

function updateRunoffViz(rounds, svg, tmpGlobalWidth, tmpGlobalHeight, margin, colorTab) {
    // Some useful measures
	var stepRound = 155;
    var stepElement = 50;
    var nodeRadius = 10;
    var globalWidth = Math.max(tmpGlobalWidth, margin.left + margin.right + (rounds.length + 1) * stepRound);
    var globalHeight = Math.max(tmpGlobalHeight, margin.top + margin.bottom + (rounds[0].candidates.length + 1) * stepElement);
    var width = globalWidth - margin.right - margin.left;
    var height = globalHeight - margin.top - margin.bottom;
    var xLeft = margin.left;
    var xRight = globalWidth - margin.right;
    var yBottom = globalHeight - margin.bottom;
    var yTop = margin.top;
    
    // The default color ranges
    var color = d3.scale.linear()
	.domain([0, 0.5, 1])
	.range(colorTab);
    var grayScale = d3.scale.linear()
	.domain([0, 1])
	.range(["#000", "#fff"]);

    // The SVG container
    var graph = d3.select("#" + svg);

    // Adjust the width and height of the container
    graph.transition()
	.duration(750)
        .attr("width", globalWidth)
        .attr("height", globalHeight);
    
    graph.selectAll(".round").remove();
    
    var roundsElmts = graph.selectAll(".round")
	.data(rounds, function(d) {return d.candidates;});
    
    roundsElmts.exit().remove();

    var roundG = roundsElmts.enter()
	.append("g")
	.attr("class", "round")
	.attr("id", function(d, i) {return "round" + i;});

    roundG
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", "150px")
	.attr("height", (rounds[0].candidates.length + 1) * stepElement)
	.attr("fill", function(d, i) {return grayScale(i / (rounds.length - 1));})
	.attr("opacity", 0.1);


    roundG
	.append("text")
	.attr("fill", "#000")
	.attr("x", 0)
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.text(function(d, i) {return i == rounds.length - 1 ? "Winner" : "Round " + i;})
	.attr("transform", function(d, j) {return "translate(" + (stepRound / 2) + "," + (stepElement / 2) + ")"; });


    var roundElmt = roundsElmts.selectAll(".round")
	.data(function(d) {return d.candidates;});

    roundElmt.exit().remove();

    roundsElmts
	.attr("transform", function(d, i) {return "translate(" + (xLeft + stepRound * (i)) + "," + yTop + ")"; });


    var insideG = roundElmt.enter()
	.append("g")
	.attr("class", function(d, i) {return "g" + i;});


    roundElmt
	.attr("transform", function(d, j) {return "translate(" + 0 + "," + (stepElement * (j + 1.5)) + ")"; });


    insideG
	.append("rect")
	.attr("x", "10px")
	.attr("y", "-1em")
	.attr("width", "130px")
	.attr("height", "2em")
	.attr("stroke", function(d, i, j) {
		return d3.max(rounds[j].scores) == d3.min(rounds[j].scores) ? color(1) : color((rounds[j].scores[i] - d3.min(rounds[j].scores)) / (d3.max(rounds[j].scores) - d3.min(rounds[j].scores)));
	      })
	.attr("fill", function(d, i, j) {
		return d3.max(rounds[j].scores) == d3.min(rounds[j].scores) ? color(1) : color((rounds[j].scores[i] - d3.min(rounds[j].scores)) / (d3.max(rounds[j].scores) - d3.min(rounds[j].scores)));
	      })
	.attr("opacity", 0.8);

    insideG
	.append("text")
	.attr("fill", "#fff")
	.attr("font-weight", "bold")
	.attr("text-anchor", "middle")
	.attr("x", "75px")
	.attr("dy", ".35em")
	.text(String);


}


// Append all these beautiful functions to the list of data visualization charts available
runoffViz = {
    "title": runoffTitle,  
    "placeholderPicture": runoffPicture,	    
    "initFunction": initRunoff,
    "updateFunction": updateRunoff,
    "description": runoffDescription,
    "shortDescription": runoffShortDescription
};

graphs.strictRanks[graphs.strictRanks.length] = runoffViz;
graphs.positiveNegative[graphs.positiveNegative.length] = runoffViz;
graphs.ranks[graphs.ranks.length] = runoffViz;
graphs.numbers[graphs.numbers.length] = runoffViz;

