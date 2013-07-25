var scoringTitle = "Scoring methods";
var scoringPicture = "images/dataViz/scoring.png";
var scoringDescription = "<p>We compute a number of points for each candidate as follows:</p><ul><li><strong>Borda :</strong> a candidate wins <i>n - 1</i> points every time it is ranked first, <i>n - 2</i> points every time it is ranked second, and so on. (<i>n</i> is the number of candidates)</li><li><strong>Plurality:</strong> a candidate wins 1 point every time it is ranked first (of a given voter).</li><li><strong>Veto :</strong> a candidate wins 1 point every time it is not ranked last.</li><li><strong>Approval:</strong> a candidate wins 1 point every time it is ranked above the specified threshold.</li></ul>";
var scoringDescriptionPositiveNegative = "<p>We compute a number of points for each candidate as follows:</p><ul><li><strong>Borda-like:</strong> a candidate wins 2 points for each \"++\", 1 point for each \"+\", loses 1 point for each \"-\", and loses 2 points for each \"--\".</li><li><strong>Plurality:</strong> a candidates wins 1 point every time it is ranked first (of a given voter).</li><li><strong>Approval:</strong> a candidate wins 1 point every time it is ranked above the specified threshold.</li></ul>";
var scoringShortDescription = "<p>Where each candidate gets some points according to its ranks...</p>";
var bordaLabel = "Borda";
var bordaLikeLabel = "Borda-like";
var pluralityLabel = "Plurality";
var vetoLabel = "Veto";
var approvalLabel = "Approval";
var approvalThresholdLabel = "Approval threshold: ";
var scoringVectorLabel = "Scoring vector: ";

var condorcetTitle = "Condorcet-based methods";
var condorcetPicture = "images/dataViz/condorcet.png";
var condorcetDescription = "<p>We organize a duel between each pair of candidates: for a candidate <i>A</i> and a candidate <i>B</i>, there is an arrow from <i>A</i> to <i>B</i> if a majority of voters prefer <i>A</i> to <i>B</i>, and vice-versa. The more voters prefer <i>A</i> to <i>B</i>, the thicker the arrow. A dotted line replaces the arrow if two candidates are tie.</p><p>The right-hand side table is a matrix representation of the oriented graph. In both sides, the colors associated to the candidates are computed using a particular function, namely Copeland 0, Copeland 1 or Simpson (choose in the combo box)</p>";
var condorcetShortDescription = "<p>Where candidates fight with each other...</p>";

var runoffTitle = "Run-off methods";
var runoffPicture = "images/dataViz/runoff.png";
var runoffDescription = "<p>These methods successively eliminate candidates. After each round, the votes for each eliminated candidates are properly transfered to the remaining ones.</p><ul><li><strong>Single Transferrable Vote:</strong> At each round, the candidates are ranked according to their plurality score (see the scoring methods). Ties are broken according their Borda score. After each round, the worst candidate is eliminated.</li><li><strong>Two-rounds majority:</strong> We keep for the second round the candidates having the highest plurality score (ties randomly broken). The winner is the second round candidate having the highest plurality score (once again, ties randomly broken).</li></ul>";
var runoffShortDescription = "<p>Where candidates are successively eliminated...</p>";
