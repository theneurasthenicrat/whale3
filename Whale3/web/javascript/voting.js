
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

function approvalVector(min, max, threshold) {
    var tab = new Array();
    for (var i = min; i <= max; i++) {
    	tab[i - min] = (i >= threshold) ? 1 : 0;
    }
    return tab;
}

function identityVector(min, max) {
    var tab = new Array();
    for (var i = min; i <= max; i++) {
    	tab[i - min] = i;
    }
    return tab;
}

function bordaVector(nbCand) {
    return identityVector(0, nbCand - 1);
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

/////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
// Random tournaments

function transformVotes(candidates, votes) {
	var newVotes = new Array();
	votes.forEach(function(v, i) {
		newVotes[i] = new Object();
		v.values.forEach(function(val, j){
			newVotes[i][candidates[j]] = val;			
		})
	});
	return newVotes;
}


function runTournament(candidates, votes) {
	var rounds = new Array();
	rounds[0] = {"candidates": deepClone(candidates), "contests": []};
	while (rounds[rounds.length - 1].candidates.length > 1) {
		rounds[rounds.length] = nextTournamentRound(rounds[rounds.length - 1].candidates, votes);
	}
	return rounds;
}

/* 
 * Candidates is the array of candidates names
 * Votes is an array of the form [{candidate -> vote}]
 */
function nextTournamentRound(candidates, votes) {
	var n = candidates.length;
	var log2 = Math.log(n) / Math.log(2);
	// Number of candidates that won't play during this round (just because the 
	// global number of candidates is not a power of 2)
	var x = Math.pow(2, Math.floor(log2)) == n ? 0 : (Math.pow(2, Math.floor(log2) + 1) - n);  
	
	var nextRoundCandidates = new Array();
	var currentRoundContests = new Array();
	
	for (var i = 0; i < n - x; i += 2) {
		var duelResult = duel(candidates[i], candidates[i+1], votes);
		console.log(duelResult);
		nextRoundCandidates[i / 2] = duelResult.winner;
		currentRoundContests[i / 2] = [{"candidate": candidates[i], "score": duelResult.scores[0]}, {"candidate": candidates[i+1], "score": duelResult.scores[1]}];
	}
	for (; i < n; i++) {
		nextRoundCandidates[nextRoundCandidates.length] = candidates[i];
		currentRoundContests[currentRoundContests.length] = [{"candidate": candidates[i]}];
	}
		
	return {"candidates": nextRoundCandidates, "contests": currentRoundContests};
}

/*
 * A duel between two candidates. Based on majority count. Ties randomly broken.
 * 1 point for each win, -1 for each defeat, tieScore for each tie (0 by default).
 */
function duel(c1, c2, votes, tieScore) {
	tieScore = (typeof tieScore !== 'undefined') ? tieScore : 0;
	var c1Score = 0;
	var c2Score = 0;
	votes.forEach(function(v) {
		if (v[c1] > v[c2]) {
			c1Score += 1;
			c2Score -= 1;
		} else {
			if (v[c2] > v[c1]) {
				c1Score -= 1;
				c2Score += 1;				
			} else {
				c1Score += tieScore;
				c2Score += tieScore;								
			}
		}
	});
	
	// Random tie breaking
	if (c1Score == c2Score) {
		return {"scores": [c1Score, c2Score], "winner": (Math.random() > 0.5 ? c2 : c1)};
	}
	return {"scores": [c1Score, c2Score], "winner": (c1Score > c2Score ? c1 : c2)};
}

/////////////////////////////////////////////////////////////////////////




