function show(divId) {
    if (document.getElementById(divId).style.display == 'none') {
	$( "#" + divId).fadeIn(function() {
	    document.getElementById(divId).style.display='block';
	});
    }
}

function hide(divId) {
    if (document.getElementById(divId).style.display == 'block') {
	$( "#" + divId).fadeOut(function() {
	    document.getElementById(divId).style.display='none';
	});
    }
}

function colorMix(color1, color2, ratio) {
    return d3.scale.linear()
	.domain([0, 1])
    	.range([color1, color2])
    (ratio);
}


/*function twoColorMixin(color1, color2, ratio) {
    var color = new Object();
    if (ratio >= 1) return color1;
    if (ratio <= 0) return color2;
    color["red"] = color1["red"] * ratio + color2["red"] * (1 - ratio);
    color["green"] = color1["green"] * ratio + color2["green"] * (1 - ratio);
    color["blue"] = color1["blue"] * ratio + color2["blue"] * (1 - ratio);
    return color;
}

function colorMixin(colorTab, ratio) {
    var n = colorTab.length;
    if (ratio >= 1) return colorTab[n - 1];
    if (ratio <= 0) return colorTab[0];
    var k = Math.floor(ratio * (n - 1));
    return twoColorMixin(colorTab[k], colorTab[k + 1], ratio * (n - 1) - ratio);
}*/

function colorTabToCSS(colorTab) {
    return "rgb(" + colorTab["red"] + "%, " + colorTab["green"] + "%, " + colorTab["blue"] + "%)";
}

function deepClone(array) {
    var newArray = JSON.parse(JSON.stringify(array));
    return newArray;
}