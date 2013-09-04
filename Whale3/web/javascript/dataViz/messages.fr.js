var scoringTitle = "Calcul de scores";
var scoringPicture = "images/dataViz/scoring.png";
var scoringDescription = "<p>On compte un nombre de points pour chaque candidat, de la manière suivante :</p><ul><li><strong>Borda :</strong> un candidat gagne <i>n - 1</i> points chaque fois qu'il est classé en premier, <i>n - 2</i> points chaque fois qu'il est classé en second, etc. (<i>n</i> est le nombre de candidats)</li><li><strong>Pluralité :</strong> un candidat gagne 1 point chaque fois qu'il est classé en premier.</li><li><strong>Veto :</strong> un candidat gagne 1 point chaque fois qu'il n'est pas classé dernier.</li></ul>";
var scoringDescriptionPositiveNegative = "<p>On compte un nombre de points pour chaque candidat, de la manière suivante :</p><ul><li><strong>Simili-Borda :</strong> un candidat gagne 2 points pour chaque « ++ », 1 point pour chaque « + », perd 1 point pour chaque « - », et perd 2 points pour chaque « -- ».</li><li><strong>Pluralité :</strong> un candidat gagne 1 point chaque fois qu'il est classé en premier.</li><li><strong>Approbation :</strong> un candidat gagne 1 point chaque fois qu'il est classé au-dessus du seuil spécifié.</li></ul>";
var scoringDescriptionApproval = "<p>Le score de chaque candidat est égal au nombre de fois où ce candidat est approuvé (le nombre de oui qu'il reccueille).</p>";
var scoringShortDescription = "<p>Où l'on compte un nombre de points par candidat...</p>";
var bordaLabel = "Borda";
var bordaLikeLabel = "Simili-Borda";
var pluralityLabel = "Pluralité";
var vetoLabel = "Veto";
var approvalLabel = "Approbation";
var approvalThresholdLabel = "Seuil d'approbation : ";
var scoringVectorLabel = "Vecteur de score : ";
	
var condorcetTitle = "Méthodes de Condorcet";
var condorcetPicture = "images/dataViz/condorcet.png";
var condorcetDescription = "<p>On réalise des duels entre les candidats : pour un candidat <i>A</i> et un candidat <i>B</i>, on met une flèche de <i>A</i> vers <i>B</i> si une majorité de votants préfèrent <i>A</i> à <i>B</i>, et vice-versa. L'épaisseur de la flèche dénote la différence de voix entre les deux candidats. Il y a un trait pointillé si les deux candidats sont à égalité.</p><p>Le tableau à droite est une représentation matricielle du graphe orienté. Dans les deux cas, les couleurs associées aux candidats sont calculées en fonction d'un score particulier, Copeland 0, Copeland 1 ou Simpson (à choisir dans le menu déroulant).</p>";
var condorcetShortDescription = "<p>Où l'on engage des duels entre candidats...</p>";

var runoffTitle = "Méthodes à plusieurs tours";
var runoffPicture = "images/dataViz/runoff.png";
var runoffDescription = "<p>Ces méthodes fonctionnent par élimination successive de candidats. À chaque étape, les voix pour les candidats éliminés sont reportés sur les autres.</p><ul><li><strong>Single Transferrable Vote :</strong> À chaque tour, les candidats sont classés selon leur score de pluralité (voir méthodes de calcul de scores). S'il y a des <i>ex-aequo</i>, on considère en plus le score de Borda. À chaque tour, le pire candidat est éliminé.</li><li><strong>Scrutin majoritaire à deux tours :</strong> On garde pour le second tour les candidats ayant le plus haut score de pluralité (départage aléatoire des <i>ex-aequo</i>). Au second tour, on élit le candidat ayant le plus haut score de pluralité.</li></ul>";
var runoffShortDescription = "<p>Où l'on élimine les candidats un tour après l'autre...</p>";

var randomTournamentsTitle = "Tournois aléatoires";
var randomTournamentsPicture = "images/dataViz/randomTournaments.png";
var randomTournamentsDescription = "<p>Cette méthode fonctionne exactement à la manière d'un tournoi sportif par élimination. À chaque tour, les candidats s'affrontent par paire. Le meilleur de chaque paire (celui qui est préféré par une majorité de votants) va au tour suivant. Deux candidats <i>ex-aequo</i> à un tour donné sont départagés aléatoirement. Le tirage initial du premier tour est aléatoire.</p>";
var randomTournamentsShortDescription = "<p>Où l'on simule un tournoi sportif entre candidats...</p>";
var shuffle = "Nouveau tirage aléatoire au premier tour"
