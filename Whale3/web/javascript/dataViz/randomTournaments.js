
var divWidth;
var divHeight;

var initRandomTournaments = function() {
    // Global variables required by runoff-based methods...
    runoffVector = new Array();

    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizControl")
	.append("button")
	.text(shuffle)
	.attr("onclick", "updateRandomTournaments()");
    
    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizInsideDiv")
	.append("svg")
	.attr("id", "randomTournamentViz")
	.attr("class", "dataViz");

    divWidth = $("#currentDataViz").width();
    divHeight = $("#currentDataViz").height();
};

var updateRandomTournaments = function() {
    var colorTab = ["#c31616", "#e1dd38", "#b8da40"];

    var newVotes = transformVotes(candidates, votes);
    var newCandidates = d3.shuffle(deepClone(candidates));
    console.log(newCandidates);
    
    var rounds = runTournament(newCandidates, newVotes);
    updateRTViz(rounds, "randomTournamentViz", divWidth * 0.95, divHeight * 0.95, {"top": 0.05 * divWidth, "bottom": 0.05 * divHeight, "right": 0.05 * divWidth, "left": 0.05 * divHeight})
};

function updateRTViz(rounds, svg, globalWidth, globalHeight, margin) {
    // Some useful measures
    var nodeRadius = 10;
    var width = globalWidth - margin.right - margin.left;
    var height = globalHeight - margin.top - margin.bottom;
    var xLeft = margin.left;
    var xRight = globalWidth - margin.right;
    var yBottom = globalHeight - margin.bottom;
    var yTop = margin.top;
    
    var stepRound = width / rounds.length;
    var initStepPlayer = Math.min(height / rounds[0].candidates.length, 70);
    
    // Y values
    var ys = computeYs(rounds, initStepPlayer);
    
    // Candidate colors
    var fillColor = new Array();
    var strokeColor = new Array();
    var colorRange = d3.scale.category20();
    candidates.forEach(function(d, i) {
    	strokeColor[d] = colorRange(2 * (i % 10));
    	fillColor[d] = colorRange(2 * (i % 10) + 1);
    })
    
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
          
    // We draw the lines (corresponding to so-called "contests")
    var contestGroups = graph.selectAll(".contestGroup")
    .data(rounds);
    
    contestGroups.enter().append("g")
    .attr("class", "contestGroup");

    contestGroups.exit().remove();

    var contests = contestGroups.selectAll(".contest")
    .data(function(d) {return d.contests;});
    
    contests.exit().remove();
    
    var enteringContests = contests.enter().append("g")
    .attr("class", "contests");
    
    graph.selectAll("line").remove();
    graph.selectAll(".score").remove();
//    graph.selectAll(".player").remove();
     
    enteringContests
    .insert("line")
    .attr("x1", function(d, j, i) {return xLeft + i * stepRound;})
    .attr("y1", function(d, j, i) {return yTop + ys[i][rounds[i].candidates[j]];})
    .attr("x2", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y2", function(d, j, i) {return yTop + ys[i][rounds[i].candidates[j]];})
    .attr("stroke", "#ccc")
    .attr("class", function(d, j, i) {return "link-" + rounds[i].candidates[j];});

    enteringContests
    .insert("line")
    .attr("x1", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y1", function(d, j, i) {return yTop + ys[i - 1][d[0].candidate];})
    .attr("x2", function(d, j, i) {return xLeft + (i - 1) * stepRound;})
    .attr("y2", function(d, j, i) {return yTop + ys[i - 1][d[0].candidate];})
    .attr("stroke", "#ccc")
    .attr("class", function(d, j, i) {return "link-" + rounds[i].candidates[j];});

    enteringContests
    .insert("line")
    .attr("x1", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y1", function(d, j, i) {return yTop + ys[i - 1][d.length > 1 ? d[1].candidate : d[0].candidate];})
    .attr("x2", function(d, j, i) {return xLeft + (i - 1) * stepRound;})
    .attr("y2", function(d, j, i) {return yTop + ys[i - 1][d.length > 1 ? d[1].candidate : d[0].candidate];})
    .attr("stroke", "#ccc")
    .attr("class", function(d, j, i) {return "link-" + rounds[i].candidates[j];});
    
    enteringContests
    .insert("line")
    .attr("x1", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y1", function(d, j, i) {return yTop + ys[i - 1][d[0].candidate];})
    .attr("x2", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y2", function(d, j, i) {return yTop + ys[i - 1][d.length > 1 ? d[1].candidate : d[0].candidate];})
    .attr("stroke", "#ccc")
    .attr("class", function(d, j, i) {return "link-" + rounds[i].candidates[j];});

    enteringContests
    .insert("text")
    .attr("fill", "#fff")
    .attr("x", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y", function(d, j, i) {return yTop + ys[i - 1][d[0].candidate];})
    .attr("class", "score")
    .text(function(d, j, i) {return d[0].score;})
    .attr("text-anchor", "end") // text-align: right
    .attr("dy", "-3px")
    .transition().duration(1500)
    .attr("fill", function(d) {return strokeColor[d[0].candidate];});

    enteringContests
    .insert("text")
    .attr("fill", "#fff")
    .attr("x", function(d, j, i) {return xLeft + (i - 0.5) * stepRound;})
    .attr("y", function(d, j, i) {return yTop + ys[i - 1][d.length > 1 ? d[1].candidate : d[0].candidate];})
    .attr("text-anchor", "end") // text-align: right
    .attr("dy", "15px")
    .text(function(d, j, i) {return d.length > 1 ? d[1].score : d[0].score;})
    .attr("class", "score")
    .transition().duration(1500)
    .attr("fill", function(d) {return strokeColor[d.length > 1 ? d[1].candidate : d[0].candidate];});
    
    
    // Then we draw the players themselves... (as circles)
    var roundGroups = graph.selectAll(".roundGroup")
    .data(rounds);
    
    roundGroups.enter().append("g")
    .attr("class", "roundGroup");

    roundGroups.exit().remove();

    var playerNodes = roundGroups.selectAll(".playerNodes")
    .data(function(d) {return d.candidates;});
    var playerLabels = roundGroups.selectAll(".playerLabels")
    .data(function(d) {return d.candidates;});
    
    playerNodes.enter()    
    .append("circle")
    .attr("class", "playerNodes")
    .attr("r", nodeRadius)
    .on("mouseover", function (d) {
    	d3.select(this).attr("fill", strokeColor[d]);
    	graph.selectAll(".link-" + d).attr("stroke", strokeColor[d]).attr("stroke-width", "1.5px");
    })
    .on("mouseout", function (d) {
    	d3.select(this).attr("fill", fillColor[d]);
    	graph.selectAll(".link-" + d).attr("stroke", "#ccc").attr("stroke-width", "1px");
    });

    playerLabels.enter()
    .append("text")
    .attr("class", "playerLabels")
    .attr("text-anchor", "middle") // text-align: center
    .attr("dy", "-1em");

    playerNodes.exit().remove();
    playerLabels.exit().remove();

    playerNodes
    .transition()
    .duration(1500)
    .attr("transform", function(d, j, i) {return "translate(" + (xLeft + i * stepRound) + ", " + (yTop + ys[i][d]) + ")";})
    .attr("fill", function(d) {return fillColor[d];})
    .attr("stroke-width", "1.5px")
    .attr("stroke", function(d) {return strokeColor[d];});

    playerLabels
    .transition()
    .duration(750)
    .attr("transform", function(d, j, i) {return "translate(" + (xLeft + i * stepRound) + ", " + (yTop + ys[i][d]) + ")";})
    .attr("fill", "#fff")
    .transition()
    .duration(750)    
    .attr("fill", function(d) {return strokeColor[d];})
    .text(String);
    
}

function computeYs(rounds, initStepPlayers) {
	var ys = new Array();
	rounds.forEach(function(r, i) {
		ys[i] = new Array();
		// First round
		if (i == 0) {
			// We initialize the y of each candidate with j * initStep
			r.candidates.forEach(function(c, j) {
				ys[0][c] = j * initStepPlayers;
			});
		} else { // Other rounds
			r.candidates.forEach(function(c, j) {
				// If the candidate results from a duel...
				if (r.contests[j].length > 1) {
					// Place it at the middle of the two former candidates
					ys[i][c] = (ys[i - 1][r.contests[j][0].candidate] + ys[i - 1][r.contests[j][1].candidate]) / 2; 					
				} else { // Otherwise...
					// Place it exactly aligned with the corresponding former candidate
					ys[i][c] = ys[i - 1][r.contests[j][0].candidate];					
				}
			});
		}
	});
	return ys;
}


// Append all these beautiful functions to the list of data visualization charts available
randomTournamentsViz = {
    "title": randomTournamentsTitle,  
    "placeholderPicture": randomTournamentsPicture,	    
    "initFunction": initRandomTournaments,
    "updateFunction": updateRandomTournaments,
    "description": randomTournamentsDescription,
    "shortDescription": randomTournamentsShortDescription
};

graphs.strictRanks[graphs.strictRanks.length] = randomTournamentsViz;
graphs.positiveNegative[graphs.positiveNegative.length] = randomTournamentsViz;
graphs.ranks[graphs.ranks.length] = randomTournamentsViz;
graphs.numbers[graphs.numbers.length] = randomTournamentsViz;

