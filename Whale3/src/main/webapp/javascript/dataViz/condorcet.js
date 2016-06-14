
var divWidth;
var divHeight;
var force = d3.layout.force();


var initCondorcet = function() {
    // Global variables required by Condorcet-based methods...
    condorcetMatrix = new Array();
    condorcetArcSet = new Array();
    condorcetVector = new Object();
    condorcetNodes = new Object();

    computeCondorcetMatrix(condorcetMatrix, votes);    
    getArcSetFromMatrix(condorcetArcSet, condorcetMatrix, candidates);
    condorcetVector[0] = computeCopeland(condorcetMatrix, 0);
    condorcetVector[1] = computeCopeland(condorcetMatrix, 1);
    condorcetVector[2] = computeSimpson(condorcetMatrix, 1);
    
    d3.keys(condorcetVector).forEach(function (k) {
	condorcetNodes[k] = getWeightedNodesFromVector(condorcetVector[k], candidates);
    });

    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizControl")
	.append("label")
	.text("Candidate value computation method:");

    d3.select("#currentDataViz div.dataVizControl").append("select")
	.attr("name", "condorcetOrder")
	.attr("id", "condorcetOrder")
	.attr("onchange", "updateCondorcet()");

    d3.select("#condorcetOrder").append("option")
	.attr("selected", "selected")
	.text("Copeland 0");

    d3.select("#condorcetOrder").append("option")
	.text("Copeland 1 (Llull)");

    d3.select("#condorcetOrder").append("option")
	.text("Simpson (maximin)");
    
    d3.select("#currentDataViz").append("div")
	.attr("class", "dataVizInsideDiv")
	.append("svg")
	.style("display", "table-cell")
	.style("vertical-align", "top")
	.attr("id", "condorcetGraphViz")
	.attr("class", "dataViz");

    d3.select("#currentDataViz div.dataVizInsideDiv")
	.append("svg")
	.style("display", "table-cell")
	.style("vertical-align", "top")
	.attr("id", "condorcetMatrix")
	.attr("class", "dataViz");

    divWidth = $("#currentDataViz").width();
    divHeight = $("#currentDataViz").height();
};

var updateCondorcet = function() {
    var colorTab = ["#c31616", "#e1dd38", "#b8da40"];
    var condorcetSelect = document.getElementById("condorcetOrder");
    
    updateGraph(deepClone(condorcetNodes[condorcetSelect.selectedIndex]), deepClone(condorcetArcSet), "condorcetGraphViz", divWidth * 0.6, divHeight * 0.9, {"top": 20, "bottom": 20, "right": 20, "left": 20}, colorTab);
    updateMatrix(deepClone(condorcetNodes[condorcetSelect.selectedIndex]), deepClone(condorcetArcSet), "condorcetMatrix", divWidth * 0.3, divHeight * 0.9, {"top": 80, "bottom": 20, "right": 20, "left": 80}, colorTab);    
};

function updateGraph(nodes, links, svg, globalWidth, globalHeight, margin, colorTab) {
    // Some useful measures
    var nodeRadius = 10;
    var globalSize = Math.min(globalWidth, globalHeight);
    var width = globalSize - margin.right - margin.left;
    var height = globalSize - margin.top - margin.bottom;
    var xLeft = margin.left;
    var xRight = globalSize - margin.right;
    var yBottom = globalSize - margin.bottom;
    var yTop = margin.top;

    var maxValue = d3.max(links, function(d) { return d.value; });
    var minNodeValue = d3.min(d3.values(nodes), function(d) { return d.value; });
    var maxNodeValue = d3.max(d3.values(nodes), function(d) { return d.value; });

    // The default color range
    var color = d3.scale.linear()
	.domain([0, 0.5, 1])
	.range(colorTab);

    // The default stroke range for the nodes
    var strokeRange = d3.scale.linear()
	.domain([0, maxValue])
	.range([0.5, 3]);

    // The SVG container
    var graph = d3.select("#" + svg);

    // Adjust the width and height of the container
    graph.transition()
	.duration(750)
        .attr("width", globalSize)
        .attr("height", globalSize);

    // The graph arrow markers (to be added just once)
    var defs = graph.selectAll("defs")
	.data(["markers"]);
    
    var markers = defs.enter()
	.append("svg:defs");
    
    markers.append("svg:marker")
	.attr("id", "end")
	.attr("class", "arrowEnd")
	.attr("viewBox", "0 0 10 10")
	.attr("refX", 20)
	.attr("refY", 5)
	.attr("markerUnits", "userSpaceOnUse")
	.attr("markerWidth", 10)
	.attr("markerHeight", 10)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M 0 0 L 10 5 L 0 10 z");

    markers.append("svg:marker")
	.attr("id", "endSelected")
	.attr("class", "arrowEndSelected")
	.attr("viewBox", "0 0 10 10")
	.attr("refX", 20)
	.attr("refY", 5)
	.attr("markerUnits", "userSpaceOnUse")
	.attr("markerWidth", 10)
	.attr("markerHeight", 10)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M 0 0 L 10 5 L 0 10 z");

    d3.keys(nodes).forEach(function(k, i) {
		      nodes[k].name = k;
		      nodes[k].index = i;
		  });

    console.log(d3.values(nodes));
    
    links.forEach(function(link) {
		      link.source = nodes[link.source];
		      link.target = nodes[link.target];
		  });

    force.stop();
    
    force
    .nodes(d3.values(nodes))
	.links(links)
	.size([width, height])
	//.charge(-30)
	.linkDistance(function(d) {return d3.scale.linear().domain([0, maxValue]).range([width / 4, width / 2])(d.value); })
	//.linkStrength(function(d) { return 1 - (d.value / maxValue); })
	.on("tick", function(e) {
		  var k = 6 * e.alpha;		  
		  d3.values(nodes).forEach(function(o, i) {
		    o.y -= d3.scale.linear().domain([0, maxValue]).range([0, 1])(o.value) * k;
		    //o.x += i & 2 ? k : -k;
		  });	 
		  
		  link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
			.attr("marker-end", function (d) { return (d.value == 0 ? "none" : "url(#end)"); });
		  
		  node.attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"; });
	
	})
	//.on("tick", function(d) { return tick(d, link, node, nodes); })
	.start();

    var link = graph.selectAll(".link")
	.data(force.links());
    
    link.enter().append("line")
	.attr("class", "link")
	.style("stroke-dasharray", function (d) { return "2," + (d.value == 0 ? "2" : "0"); })
	.style("stroke-width", function (d) { return (d.value == 0 ? 0.5 : strokeRange(d.value));});

    link.exit().remove();
    
    link.attr("marker-end", function (d) { return (d.value == 0 ? "none" : "url(#end)"); });

    var node = graph.selectAll(".node")
	.data(force.nodes());
    
    var nodeEnterG = node.enter()
	.append("g")
	.attr("class", "node")
	.call(force.drag);
   
    node.exit().remove();
    
    nodeEnterG
	.append("circle")
	.attr("r", 8)
	.style("fill", function (d, i) {return colorMix(color((nodes[d.name].value - minNodeValue) / (maxNodeValue - minNodeValue)), "#fff", 0.5); })
	.style("stroke", function (d, i) {return colorMix(color((nodes[d.name].value - minNodeValue) / (maxNodeValue - minNodeValue)), "#fff", 0.2); })
	.on("mouseover", function (d, i) { mouseover(this, link, color((nodes[d.name].value - minNodeValue) / (maxNodeValue - minNodeValue))); })
	.on("mouseout",  function (d, i) { mouseout (this, link, colorMix(color((nodes[d.name].value - minNodeValue) / (maxNodeValue - minNodeValue)), "#fff", 0.5)); } );

    nodeEnterG
	.append("text")
	.attr("x", 12)
	.attr("dy", ".35em")
	.attr("class", "chartLabel")
	.text(function(d) { return d.name; });

}

function tick(d, link, node, nodes) {
  link
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; })
	.attr("marker-end", function (d) { return (d.value == 0 ? "none" : "url(#end)"); });
  
  var k = 6 * d.alpha;
  node.y += k * nodes[node.datum().value];
  node.x += k * nodes[node.datum().value];
  console.log(node.datum().value);
  
  node
      .attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover(node, link, fillColor) {
    d3.select(node).transition()
	.duration(750)
	.style("fill", fillColor );
/*    link
	.attr("class", function(d) { return (d.source == node.__data__ || d.target == node.__data__ ? "arrowSelected" : "arrow"); })
	.attr("marker-end", function(d) { return (d.source == node.__data__ || d.target == node.__data__ ? "url(#endSelected)" : "url(#end)"); });*/
}

function mouseout(node, link, fillColor) {
  d3.select(node).transition()
      .duration(750)
      .style("fill", fillColor);
    /*    link.attr("class", "arrow").attr("marker-end", "url(#end)");*/
}



function getPositions(labels, xLeft, yBottom, width, height) {
    var xCenter = width / 2 + xLeft;
    var yCenter = height / 2 + yBottom;
    var radius = Math.min(width, height) / 2;

    var angles = d3.scale.linear()
	.domain([0, labels.length])
	.range([0, 2 * Math.PI]);

    var positions = new Array();

    for (var i = 0; i < labels.length; i++) {
	positions[i] = [xCenter + radius * Math.cos(angles(i)), yCenter + radius * Math.sin(angles(i))];
    }
    
    return positions;
}


function updateMatrix(nodes, arcSet, svg, globalWidth, globalHeight, margin, colorTab) {
    var nodeRadius = 10;
    var globalSize = Math.min(globalWidth, globalHeight);
    var width = globalSize - margin.right - margin.left;
    var height = globalSize - margin.top - margin.bottom;
    var xLeft = margin.left;
    var xRight = globalSize - margin.right;
    var yBottom = globalSize - margin.bottom;
    var yTop = margin.top;

    var nodeKeys = d3.keys(nodes);
    var nbCandidates = nodeKeys.length;

    var cellWidth = width / (nbCandidates + 1);
    var cellHeight = height / (nbCandidates + 1);

    var minNodeValue = d3.min(d3.values(nodes), function(d) { return d.value; });
    var maxNodeValue = d3.max(d3.values(nodes), function(d) { return d.value; });
    

    var nodeColor = d3.scale.linear()
	.domain([minNodeValue, (maxNodeValue + minNodeValue) / 2, maxNodeValue])
	.range(colorTab);

    var maxArcValue = d3.max(arcSet, function(d) { return d.value; });

    var arcColor = d3.scale.linear()
	.domain([-maxArcValue, 0, maxArcValue])
	.range([colorTab[0], "#eee", colorTab[2]]);


    nodeKeys.sort(function(a, b) {
		   return nodes[b].value - nodes[a].value;
	       });

    nodeKeys.forEach(function(node, i) {
			 nodes[node].index = i;
			 nodes[node].name = node;
		     });

    var nodeValues = d3.values(nodes);
    
    var table = d3.select("#" + svg);

    table.transition()
	.duration(750)
        .attr("width", globalSize)
        .attr("height", globalSize);

    var rowCandidateCells = table.selectAll(".rowCandidate")
	.data(nodeValues);
   
    rowCandidateCells.enter()
	.append("text")
	.attr("class", "rowCandidate")
	.attr("transform", function(d, i) { return "translate(" + (xLeft + (d.index + 1) * cellWidth) + ", " + (-5 + yBottom - (nbCandidates) * cellHeight) + ") rotate(-90)"; })
	.attr("text-anchor", "start") // text-align: right
	.attr("fill", function(d) { return nodeColor(d.value); })
	.attr("dy", "-1em")
	.text(function(d, i) { return d.name; });

    rowCandidateCells
	.transition()
	.duration(750)
	.attr("transform", function(d, i) { return "translate(" + (xLeft + (d.index + 1) * cellWidth) + ", " + (-5 + yBottom - (nbCandidates) * cellHeight) + ") rotate(-90)"; })
	.attr("text-anchor", "start") // text-align: right
	.attr("fill", function(d) { return nodeColor(d.value); })
	.attr("dy", "-1em")
	.text(function(d, i) { return d.name; });

    var columnCandidateCells = table.selectAll(".columnCandidate")
	.data(nodeValues);
   
    columnCandidateCells.enter()
	.append("text")
	.attr("class", "columnCandidate")
	.attr("transform", function(d, i) { return "translate(" + (xLeft - 5) + ", " + (yBottom - (nbCandidates - d.index - 1) * cellHeight) + ")"; })
	.attr("fill", function(d) { return nodeColor(d.value); })
	.attr("text-anchor", "end") // text-align: right
	.attr("dy", "-1em")
	.text(function(d, i) { return d.name; });

    columnCandidateCells
	.transition()
	.duration(750)
	.attr("transform", function(d, i) { return "translate(" + (xLeft - 5) + ", " + (yBottom - (nbCandidates - d.index - 1) * cellHeight) + ")"; })
	.attr("fill", function(d) { return nodeColor(d.value); })
	.attr("text-anchor", "end") // text-align: right
	.attr("dy", "-1em")
	.text(function(d, i) { return d.name; });

    var diagCells = table.selectAll(".diagCells")
	.data(nodeKeys);

    diagCells.enter()
	.append("rect")
	.attr("transform", function(d, i) { return "translate(" + (xLeft + i * cellWidth) + ", " + (yBottom - (nbCandidates - i) * cellHeight) + ")"; })
	.attr("class", "diagCells")
	.attr("stroke", "#fff")
	.attr("fill", "#ccc")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", cellWidth)
	.attr("height", cellHeight);

    diagCells
	.transition()
	.duration(750)
	.attr("transform", function(d, i) { return "translate(" + (xLeft + i * cellWidth) + ", " + (yBottom - (nbCandidates - i) * cellHeight) + ")"; })
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", cellWidth)
	.attr("height", cellHeight);


    var leftCells = table.selectAll(".leftCells")
	.data(arcSet);

    leftCells.enter()
	.append("rect")
	.attr("transform", function(d) {  return "translate(" + (xLeft + nodes[d.target].index * cellWidth) + ", " + (yBottom - (nbCandidates - nodes[d.source].index) * cellHeight) + ")"; })
	.attr("class", "leftCells")
	.attr("stroke", "#fff")
	.attr("fill", function(d) { return arcColor(d.value); })
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", cellWidth)
	.attr("height", cellHeight);

    leftCells
	.transition()
	.duration(750)
	.attr("transform", function(d) {  return "translate(" + (xLeft + nodes[d.target].index * cellWidth) + ", " + (yBottom - (nbCandidates - nodes[d.source].index) * cellHeight) + ")"; })
	.attr("class", "leftCells")
	.attr("stroke", "#fff")
	.attr("fill", function(d) { return arcColor(d.value); })
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", cellWidth)
	.attr("height", cellHeight);


    var rightCells = table.selectAll(".rightCells")
	.data(arcSet);

    rightCells.enter()
	.append("rect")
	.attr("transform", function(d) { return "translate(" + (xLeft + nodes[d.source].index * cellWidth) + ", " + (yBottom - (nbCandidates - nodes[d.target].index) * cellHeight) + ")"; })
	.attr("class", "rightCells")
	.attr("stroke", "#fff")
	.attr("fill", function(d) { return arcColor(-d.value); })
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", cellWidth)
	.attr("height", cellHeight);

    rightCells
	.transition()
	.duration(750)
	.attr("transform", function(d) { return "translate(" + (xLeft + nodes[d.source].index * cellWidth) + ", " + (yBottom - (nbCandidates - nodes[d.target].index) * cellHeight) + ")"; })
	.attr("class", "rightCells")
	.attr("stroke", "#fff")
	.attr("fill", function(d) { return arcColor(-d.value); })
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", cellWidth)
	.attr("height", cellHeight);

}



// Append all these beautiful functions to the list of data visualization charts available
condorcetViz = {
		"title": condorcetTitle,  
		"placeholderPicture": condorcetPicture,	    
		"initFunction": initCondorcet,
		"updateFunction": updateCondorcet,
	    "description": condorcetDescription,
	    "shortDescription": condorcetShortDescription
};

graphs.strictRanks[graphs.strictRanks.length] = condorcetViz;
graphs.positiveNegative[graphs.positiveNegative.length] = condorcetViz;
graphs.ranks[graphs.ranks.length] = condorcetViz;
graphs.numbers[graphs.numbers.length] = condorcetViz;



