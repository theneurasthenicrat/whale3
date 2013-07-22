var scoringTitle = "Calcul de scores";
var scoringPicture = "images/dataViz/scoring.png";
var scoringDescription = "<p>On compte un nombre de points pour chaque candidat, de la manière suivante :</p><ul><li><strong>Pluralité :</strong> un candidat gagne 1 point chaque fois qu'il est classé en premier.</li><li><strong>Veto :</strong> un candidat gagne 1 point chaque fois qu'il n'est pas classé dernier.</li><li><strong>Borda :</strong> un candidat gagne <i>n - 1</i> points chaque fois qu'il est classé en premier, <i>n - 2</i> points chaque fois qu'il est classé en second, etc. (<i>n</i> est le nombre de candidats)</li></ul>";
var scoringShortDescription = "<p>Où l'on compte un nombre de points par candidat...</p>";

var condorcetTitle = "Méthodes de Condorcet";
var condorcetPicture = "images/dataViz/condorcet.png";
var condorcetDescription = "<p>On réalise des duels entre les candidats : pour un candidat <i>A</i> et un candidat <i>B</i>, on met une flèche de <i>A</i> vers <i>B</i> si une majorité de votants préfèrent <i>A</i> à <i>B</i>, et vice-versa. L'épaisseur de la flèche dénote la différence de voix entre les deux candidats. Il y a un trait pointillé si les deux candidats sont à égalité.</p><p>Le tableau à droite est une représentation matricielle du graphe orienté. Dans les deux cas, les couleurs associées aux candidats sont calculées en fonction d'un score particulier, Copeland 0, Copeland 1 ou Simpson (à choisir dans le menu déroulant).</p>";
var condorcetShortDescription = "<p>Où l'on engage des duels entre candidats...</p>";

var runoffTitle = "Méthodes à plusieurs tours";
var runoffPicture = "images/dataViz/runoff.png";
var runoffDescription = "<p>Ces méthodes fonctionnent par élimination successive de candidats. À chaque étape, les voix pour les candidats éliminés sont reportés sur les autres.</p><ul><li><strong>Single Transferrable Vote :</strong> À chaque tour, les candidats sont classés selon leur score de pluralité (voir méthodes de calcul de scores). S'il y a des <i>ex-aequo</i>, on considère en plus le score de Borda. À chaque tour, le pire candidat est éliminé.</li><li><strong>Scrutin majoritaire à deux tours :</strong> On garde pour le second tour les candidats ayant le plus haut score de pluralité (départage aléatoire des <i>ex-aequo</i>). Au second tour, on élit le candidat ayant le plus haut score de pluralité.</li></ul>";
var runoffShortDescription = "<p>Où l'on élimine les candidats un tour après l'autre...</p>";
