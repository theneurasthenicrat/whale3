
var divWidth;
var divHeight;
var scoringVector = new Object();

var getScoringVector = function(scoringText) {
	if (scoringText == approvalLabel) {
		var select = document.getElementById("approvalThreshold");
		return approvalVector(d3.min(json.preferenceModel.values), d3.max(json.preferenceModel.values), select.options[select.selectedIndex].value);
	}
	return scoringVector[scoringText];
}


var initScoring = function() {
    // defines a new global variable containing all the scoring vectors
    scoringVector[bordaLabel] = bordaVector(d3.max(json.preferenceModel.values) - d3.min(json.preferenceModel.values) + 1);
    scoringVector[bordaLikeLabel] = identityVector(d3.min(json.preferenceModel.values), d3.max(json.preferenceModel.values));
    scoringVector[pluralityLabel] = pluralityVector(d3.max(json.preferenceModel.values) - d3.min(json.preferenceModel.values) + 1);
    scoringVector[vetoLabel] = vetoVector(d3.max(json.preferenceModel.values) - d3.min(json.preferenceModel.values) + 1);

    // defines a new global variable that will contain the actual scores
    scoreTab = new Array();

    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizControl")
	.append("label")
	.text(scoringVectorLabel);

    d3.select("#currentDataViz div.dataVizControl").append("select")
	.attr("name", "pluralityScores")
	.attr("id", "pluralityScores")
	.attr("onchange", "updateScoring()");

    if (json.preferenceModel.id != "positiveNegative") {
    	d3.select("#pluralityScores").append("option")
    	.attr("selected", "selected")
    	.text(bordaLabel);
    } else {
    	d3.select("#pluralityScores").append("option")
    	.attr("selected", "selected")
    	.text(bordaLikeLabel);
    }

    d3.select("#pluralityScores").append("option")
    .text(pluralityLabel);

    if (json.preferenceModel.id != "positiveNegative") {
    	d3.select("#pluralityScores").append("option")
    	.text(vetoLabel);
    }

    d3.select("#pluralityScores").append("option")
    .text(approvalLabel);

    d3.select("#currentDataViz div.dataVizControl").append("div")
    .attr("id", "approvalThresholdDiv")
    .style("display", "none");
    
    d3.select("#currentDataViz div.dataVizControl div").append("label")
    .text(approvalThresholdLabel);
    
    d3.select("#currentDataViz div.dataVizControl div").append("select")
	.attr("name", "approvalThreshold")
	.attr("id", "approvalThreshold")
	.attr("onchange", "updateScoring()");

    json.preferenceModel.texts.forEach(function(d, i) {
    	if (json.preferenceModel.values[i] == 0) {
    		d3.select("#approvalThreshold").append("option")
    		.attr("value", json.preferenceModel.values[i])
    		.attr("selected", "selected")
    		.text(d);
    	} else {
    		d3.select("#approvalThreshold").append("option")
    		.attr("value", json.preferenceModel.values[i])
    		.text(d);    		    		
    	}
    });
    
    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizInsideDiv")
	.append("svg")
	.attr("id", "scoringChart")
	.attr("class", "dataViz");

    divWidth = $("#currentDataViz").width();
    divHeight = $("#currentDataViz").height();
};

var updateScoring = function() {
    var colorTab = ["#c31616", "#e1dd38", "#b8da40"];
    var pluralitySelect = document.getElementById("pluralityScores");
    if (pluralitySelect.options[pluralitySelect.selectedIndex].text == approvalLabel) {
    	$("#approvalThresholdDiv").slideDown();
    } else {
    	$("#approvalThresholdDiv").slideUp();    	
    }
    computeScores(scoreTab, votes, getScoringVector(pluralitySelect.options[pluralitySelect.selectedIndex].text), json.preferenceModel.values);   

    updateChart(scoreTab, candidates, "scoringChart", divWidth, divHeight, {"top": 30, "bottom": 200, "right": 100, "left": 10}, colorTab);
};


function updateChart(data, labels, svg, maxWidth, maxHeight, margin, colorTab) {
    var maxY = d3.max(data);
    var minY = Math.min(0, d3.min(data));
    var maxX = data.length;

    var stepX = Math.min((maxWidth - margin.left - margin.right) / maxX, 100);
    var stepY = Math.min((maxHeight - margin.top - margin.bottom) / (maxY - minY), 20);

    var width = stepX * maxX;
    var height = stepY * (maxY - minY);
    
    var globalWidth = width + margin.left + margin.right;
    var globalHeight = height + margin.top + margin.bottom;

    var xLeft = margin.left;
    var xRight = globalWidth - margin.right;
    var yBottom = globalHeight - margin.bottom;
    var yOrigin = yBottom + minY * stepY;
    var yTop = margin.top;


    var color = d3.scale.linear()
	.domain([0, 0.5, 1])
	.range(colorTab);

    var widthBar = Math.max(50, 2 * stepX / 3);

    var chart = d3.select("#" + svg);
    
    chart.transition()
    .duration(750)
    .attr("width", globalWidth)
    .attr("height", globalHeight);

    var yAxis = d3.scale.linear()
	.domain([minY, maxY])
	.range([yBottom, yTop]);
    
    chart.selectAll(".grid").remove();

    var grid = chart.selectAll(".grid")
	.data(yAxis.ticks(maxY - minY));
    
    grid.enter().insert("line", ".bars")
	.attr("class", "grid")
	.attr("x1", xLeft)
	.attr("x2", xRight)
	.attr("y1", yAxis)
	.attr("y2", yAxis);

    grid.transition()
	.duration(750)
	.attr("x1", xLeft)
	.attr("x2", xRight)
	.attr("y1", yAxis)
	.attr("y2", yAxis);

    grid.exit().remove();
  
    var bars = chart.selectAll(".bars")
        .data(data);

    bars.enter().append("rect")
	.attr("class", "bars")
	.attr("x", function(d, i) { return xLeft + i * (stepX) + (stepX - widthBar) / 2; })
	.attr("width", widthBar)
	.attr("y", yBottom);

    bars.exit().remove();

    bars.transition()
    .duration(750)
    .attr("height", function(d, i) { return Math.max(Math.abs(d) * stepY, 1); })
    .attr("y", function(d, i) { return yOrigin - (d > 0 ? d * stepY : 0); })
	.style("fill", function(d, i) { return color(d / maxY); });//return colorTabToCSS(colorMixin(colorTab, d / maxY))});

    // x axis
    if (chart.select("#xAxis").empty()) {
	chart.append("line")
	    .attr("id", "xAxis")
	    .attr("class", "axes");
    }

    chart.select("#xAxis")
    .transition()
    .duration(750)
    .attr("x1", xLeft)
	.attr("x2", xRight)
	.attr("y1", yOrigin)
	.attr("y2", yOrigin);

    
    // y axis
    if (chart.select("#yAxis").empty()) {
	chart.append("line")
	    .attr("id", "yAxis")
	    .attr("class", "axes");
    }

    chart.select("#yAxis")
	.transition()
	.duration(750)
	.attr("x1", xLeft)
	.attr("x2", xLeft)
	.attr("y1", yBottom)
	.attr("y2", yTop);

    chart.selectAll(".chartValue")
	.data(data)
	.enter().append("g")
	.attr("class", "chartValue")
	.attr("transform", function(d, i) { return "translate(" + (xLeft + (i + 1 / 2) * (stepX)) + ", " + (yOrigin - d * stepY) + ")"; })
	.append("text")
	.attr("text-anchor", "middle") // text-align: center
	.attr("class", "chartValue")
	.attr("dy", "-1em")
	.text(String);
    
    chart.selectAll("g.chartValue")
	.data(data)
	.transition()
	.duration(750)
	.attr("transform", function(d, i) { return "translate(" + (xLeft + (i + 1 / 2) * (stepX)) + ", " + (yOrigin - d * stepY + (d < 0 ? stepY : 0)) + ")"; });
    
    chart.selectAll("text.chartValue")
	.data(data)
	.transition()
	.duration(750)
	.text(String);

    chart.selectAll(".chartLabel")
	.data(labels)
	.enter().append("g")
	.attr("class", "chartLabel")
	.attr("transform", function(d, i) { return "translate(" + (xLeft + (i + 1 / 2) * (stepX)) + ", " + (yOrigin + (d < 0 ? -15 : 15)) + ") rotate(45)"; })
	.append("text")
	.attr("text-anchor", "start") // text-align: right
	.attr("class", "chartLabel")
	.attr("dy", "-1em")
	.text(String);
    
    chart.selectAll("g.chartLabel")
	.data(labels)
	.transition()
	.duration(750)
	.attr("transform", function(d, i) { return "translate(" + (xLeft + (i + 1 / 2) * (stepX)) + ", " + (yBottom + (d < 0 ? -15 : 15)) + ") rotate(45)"; });
    
    chart.selectAll("text.chartLabel")
	.data(labels)
	.transition()
	.duration(750)
	.attr("text-anchor", "start") // text-align: center
	.attr("dy", 5)
	.text(String);
}


// Append all these beautiful functions to the list of data visualization charts available
var scoringViz = function(preferenceModel) {
	if (preferenceModel != "positiveNegative") {
		return {
			"title": scoringTitle,    
			"placeholderPicture": scoringPicture,
			"initFunction": initScoring,
			"updateFunction": updateScoring,
			"description": scoringDescription,
			"shortDescription": scoringShortDescription
		};
	} else {
		return {
			"title": scoringTitle,    
			"placeholderPicture": scoringPicture,
			"initFunction": initScoring,
			"updateFunction": updateScoring,
			"description": scoringDescriptionPositiveNegative,
			"shortDescription": scoringShortDescription
		};
	}
};

graphs.strictRanks[graphs.strictRanks.length] = scoringViz("strictRanks");
graphs.positiveNegative[graphs.positiveNegative.length] = scoringViz("positiveNegative");
graphs.ranks[graphs.ranks.length] = scoringViz("ranks");


