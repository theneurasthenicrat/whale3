
function parseDate(label) {
    var tab = label.split("#");
    var dateString = (tab[0].split(" "))[0];
    return dateString + " / " + tab[2];
}

function computeScores(scores, votes, scoringVector, values) {
    var index = d3.scale.ordinal()
	.domain(values)
	.range(scoringVector);

    for (var j = 0; j < scores.length; j++) {
	scores[j] = 0;
    }
    for (var i = 0; i < votes.length; i++) {
	var current = votes[i].values;
	for (j = 0; j < current.length; j++) {    
	    if (scores[j] == null) {
		scores[j] = index(current[j]);
	    } else {
		scores[j] += index(current[j]);
	    }
	}
    }
}

function pluralityVector(nbCand) {
    var tab = new Array();
    for (var i = 0; i < nbCand - 1; i++) {
	tab[i] = 0;
    }
    tab[nbCand - 1] = 1;
    return tab;
}

function vetoVector(nbCand) {
    var tab = new Array();
    tab[0] = 0;
    for (var i = 1; i < nbCand; i++) {
	tab[i] = 1;
    }
    return tab;
}

function bordaVector(nbCand) {
    var tab = new Array();
    for (var i = 0; i < nbCand; i++) {
	tab[i] = i;
    }
    return tab;
}

/////////////////////////////////////////////////////////////////////////
// Condorcet procedures

function computeCondorcetMatrix(matrix, votes) {
    for (var i = 0; i < votes[0].values.length; i++) {
	if (matrix[i] ==  null) matrix[i] = new Array();
	for (var j = 0; j < votes[0].values.length; j++) {
	    matrix[i][j] = 0;
	}
    }

    for (var k = 0; k < votes.length; k++) {                             // for each voter
	var current = votes[k].values;                                   // get his / her votes
	for (i = 0; i < votes[0].values.length; i++) {                      // for each candidate i
	    for (var j = i + 1; j < votes[0].values.length; j++) {              // for each other candidate j
		matrix[i][j] += (current[i] > current[j] ? 1 : -1);      // add 1 to matrix[i][j] if i beats j, and -1 otherwise
		matrix[j][i] += (current[i] > current[j] ? -1 : 1);      // other way around for matrix[j][i]
	    }
	}
    }
}

function getArcSetFromMatrix(condorcetArcSet, condorcetMatrix, candidates) {
    for (var i = 0; i < condorcetMatrix.length; i++) {
	for (var j = i + 1; j < condorcetMatrix[i].length; j++) {
	    if (condorcetMatrix[i][j] >= 0) {
		condorcetArcSet[condorcetArcSet.length] = {"source": candidates[i], "target": candidates[j], "value": condorcetMatrix[i][j]};
	    }
	    if (condorcetMatrix[i][j] <= 0) {
		condorcetArcSet[condorcetArcSet.length] = {"source": candidates[j], "target": candidates[i], "value": -condorcetMatrix[i][j]};
	    }
	}
    }
}

function getWeightedNodesFromVector(weights, labels) {
    var nodes = new Object();
    for (var i = 0; i < labels.length; i++) {
	nodes[labels[i]] = {"value": weights[i]};
    }
    return nodes;
}

function computeCopeland(condorcetMatrix, alpha) {
    var copelandVector = [];

    for (var i = 0; i < condorcetMatrix.length; i++) {
	copelandVector[i] = 0;
    }
    for (i = 0; i < condorcetMatrix.length; i++) {
	for (var j = i; j < condorcetMatrix[i].length; j++) {
	    if (condorcetMatrix[i][j] > 0) {
		copelandVector[i] += 1;
		copelandVector[j] -= 1;
	    }
	    if (condorcetMatrix[i][j] < 0) {
		copelandVector[i] -= 1;
		copelandVector[j] += 1;
	    }	    
	    if (condorcetMatrix[i][j] == 0) {
		copelandVector[i] += alpha;
		copelandVector[j] += alpha;
	    }	    
	}
    }

    return copelandVector;
}

function computeSimpson(condorcetMatrix, alpha) {
    var simpsonVector = [];

    for (var i = 0; i < condorcetMatrix.length; i++) {
	simpsonVector[i] = 0;
    }
    for (i = 0; i < condorcetMatrix.length; i++) {
	simpsonVector[i] = d3.min(condorcetMatrix[i]);
    }

    return simpsonVector;
}

/////////////////////////////////////////////////////////////////////////
// Run-off procedures


function twoRoundsMajority(candidates, votes) {
    var rounds = new Array();
    rounds[0] = {
	"candidates": candidates,
	"votes": votes
    };

    // First round !
    var currentCandidates = rounds[0].candidates;
    var currentVotes = rounds[0].votes;
    
    var currentScores = new Array();
    computeScores(currentScores, currentVotes, pluralityVector(currentCandidates.length), d3.range(0, currentCandidates.length));
    
    // The ranking function: based on plurality scoring, with random tie-breaking
    var rankingFunction = function(i, j) {
	return (currentScores[i] == currentScores[j] ? Math.random() - 0.5 : currentScores[j] - currentScores[i]);
    };

    // Replace the current round by the sorted candidates and votes
    rounds[0] = rank(currentCandidates, currentVotes, rankingFunction, currentScores);
    
    // Compute the next round by just keeping the two last candidates
    rounds[1] = eliminate(rounds[rounds.length - 1].candidates, rounds[rounds.length - 1].votes, currentCandidates.length - 2);

    // Second round !
    currentCandidates = rounds[1].candidates;
    currentVotes = rounds[1].votes;
    
    currentScores = new Array();
    computeScores(currentScores, currentVotes, pluralityVector(currentCandidates.length), d3.range(0, currentCandidates.length));
    
    // The ranking function: based on plurality scoring, with random tie-breaking
    rankingFunction = function(i, j) {
	return (currentScores[i] == currentScores[j] ? Math.random() - 0.5 : currentScores[j] - currentScores[i]);
    };

    // Replace the current round by the sorted candidates and votes
    rounds[1] = rank(currentCandidates, currentVotes, rankingFunction, currentScores);
    
    // Compute the next round by just keeping the two last candidates
    rounds[2] = eliminate(rounds[1].candidates, rounds[1].votes, 1);

    // Last score : nb of voters by default
    rounds[rounds.length - 1]["scores"] = [votes.length];

    return rounds;
}


function STV(candidates, votes) {
    var rounds = new Array();
    rounds[0] = {
	"candidates": candidates,
	"votes": votes
    };

    // While at least two candidates remain...
    while(rounds[rounds.length - 1].candidates.length > 1) {
	var currentCandidates = rounds[rounds.length - 1].candidates;
	var currentVotes = rounds[rounds.length - 1].votes;

	var currentScores = new Array();
	computeScores(currentScores, currentVotes, bordaVector(currentCandidates.length), d3.range(0, currentCandidates.length));
	// The ranking function: based on borda scoring, with random tie-breaking
	var rankingFunction = function(i, j) {
	    return (currentScores[i] == currentScores[j] ? Math.random() - 0.5 : currentScores[j] - currentScores[i]);
	};
	// Add scores to the current round
	// Replace the current round by the sorted candidates and votes
	rounds[rounds.length - 1] = rank(currentCandidates, currentVotes, rankingFunction, currentScores);
	// Compute the next round by just eliminating the last candidate
	rounds[rounds.length] = eliminate(rounds[rounds.length - 1].candidates, rounds[rounds.length - 1].votes, 1);
    }
    // Last score : nb of voters by default
    rounds[rounds.length - 1]["scores"] = [votes.length];

    return rounds;
}

function rank(candidates, votes, rankingFunction, scores) {
    var permutationArray = d3.range(0, candidates.length);
    // We build the permutation array by using the rankingFunction
    permutationArray.sort(rankingFunction);
    var newCandidates = d3.permute(candidates, permutationArray);
    var newVotes = votes.map(function(v, i) {
				 return {"name": v.name, "values": d3.permute(v.values, permutationArray)};
			     });
    var newScores = d3.permute(scores, permutationArray);
    return {
	"candidates": newCandidates,
	"votes": newVotes,
	"scores": newScores
    };
}


function eliminate(candidates, votes, numberToEliminate) {
    var lastIndex = candidates.length - numberToEliminate - 1;
    var newCandidates = candidates.slice(0, lastIndex + 1);
    var newVotes = votes.map(function(v) {
 				 var lastVal = v.values[lastIndex + 1];
				 return {"name": v.name, "values": v.values.map(function(val) {return val > lastVal ? val - numberToEliminate : val;}).slice(0, lastIndex + 1)};				 
			     });
    return {
	"candidates": newCandidates,
	"votes": newVotes
    };    
}



// function nextRound(candidates, votes, rankingFunction) {
//     var permutationArray = d3.range(0, candidates.length);
//     // We build the permutation array by using the rankingFunction
//     permutationArray.sort(rankingFunction);
//     var newCandidates = d3.permute(candidates, permutationArray);
//     var newVotes = votes.map(function(v, i) {
// 				 var current = d3.permute(v.values, permutationArray);
// 				 var lastVal = current[current.length - 1];
// 				 return {"values": current.map(function(val) {return val > lastVal ? val - 1 : val;})};
// 			     });
//     // Removes the last candidate (i.e the worst one)
//     newCandidates.pop();
//     newVotes.forEach(function(v) {
// 			 v.values.pop();
// 			 });
//     return {
// 	"candidates": newCandidates,
// 	"votes": newVotes
//     };
// }
// 
// 
// function eliminate(candidates, votes, candidate) {
//     var cIndex = -1;
//     // Retrieves the candidate index
//     for (k = 0; k < candidates.length && cIndex == -1; k++) {
// 	if (candidates[k] == candidate) cIndex = k;
//     }
//     // Removes the candidate from the candidate list
//     candidates = candidates.splice(cIndex, 1);
//     
//     // Now we will update the voters preferences
//     votes.forEach(function(v, i) {
// 		      // Retrieves the current candidate value
// 		      var cVal = v.values[cIndex];
// 		      // Removes the candidate value from the list
// 		      votes[i].values = votes[i].values.splice(cIndex, 1);
// 		      // Now we update each value greater than cVal
// /*		      votes[i].values.forEach(function(w, j) {
// 						  if (w > cVal) {
// 						      votes[i].values[j] = w - 1;
// 						  }
// 					      });*/
// 		  });
// }
// 

/////////////////////////////////////////////////////////////////////////





