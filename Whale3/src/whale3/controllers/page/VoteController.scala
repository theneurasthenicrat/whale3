package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import java.util.Date
import java.text.SimpleDateFormat

import whale3.vote._
import whale3.database._
import VoteController._

@WebServlet(name = "VoteController", urlPatterns = Array("/vote.do"))
class VoteController extends PollController with InvitationRequired {
	override def main(): Unit = {
		val pollId: String = request.getParameter("id")
		errorCode match {
			case FIRST_STEP => {}
			case SUCCESS => {
				updateVote()
				success(getMessage("messages.poll", "voteSuccessful", Nil))
				super.main()
				return
			}
			case VOTED_TWICE =>
				error(getMessage("messages.poll", "votedTwice", Nil)); return
			case UNDEFINED_POLL =>
				error(getMessage("messages.poll", "unspecifiedPoll", Nil)); return
			case POLL_CLOSED =>
				val poll: Poll = Polls.getPollById(pollId)
				error(getMessage("messages.poll", "isAlreadyClosed", ((new SimpleDateFormat("EEEE d MMMM yyyy", locale)).format(poll.closingDate)) :: ((new SimpleDateFormat("hh:mm", locale)).format(poll.closingDate)) :: Nil)); request.getRequestDispatcher("views/pollMenu.jsp").include(request, response); return
			case _ => throw new Exception("Unknown step " + errorCode)
		}
		val poll: Poll = Polls.getPollById(pollId)
		request.setAttribute("poll", poll)
		printPollForm(poll)
		//    request.getRequestDispatcher("views/pollMenu.jsp").include(request, response)    
	}

	private def updateVote(): Unit = {
		val pollId: String = request.getParameter("id")
		var currentUser: User = null
		if (user == null) {
			val nickName: String = request.getParameter("nickName")
			currentUser = Users.createSimpleUser(nickName)
		} else {
			currentUser = user
		}
		var value: StringBuffer = new StringBuffer(request.getParameter("candidate0"))
		var i: Int = 1
		while (request.getParameter("candidate" + i) != null) {
			value.append("#")
			value.append(request.getParameter("candidate" + i))
			i += 1
		}
		val creationDate: java.util.Date = new java.util.Date()
		var returnVal: Int = 0
		try {
			returnVal = Polls.newOrUpdateVote(pollId, currentUser.userId, value.toString(), creationDate)
			session.setAttribute("nvid", request.getParameter("nvid")) // To prevent database modification if the page is refreshed
		} catch {
			case e: Exception => throw e
		}
	}

	private def errorCode: Int = {
		val pollId: String = request.getParameter("id")
		if (pollId == null || pollId == "") return UNDEFINED_POLL
		if (Polls.getPollById(pollId).isClosed) return POLL_CLOSED
		if (request.getParameter("nvid") != null) {
			if (session.getAttribute("nvid") != null && session.getAttribute("nvid").toString() == request.getParameter("nvid").toString()) {
				return VOTED_TWICE
			}
			return SUCCESS
		}
		FIRST_STEP
	}

	protected def printPollForm(poll: Poll): Unit = {
		var currentVotes: Array[String] = new Array[String](poll.candidates.size)
		if (user != null) {
			try {
				val v: Vote = Polls.getVoteByPollIdAndUserId(poll.pollId, user.userId)
				if (v == null) {
					currentVotes = null
				} else {
					currentVotes = (for (s <- v.values) yield s) toArray
				}
			} catch {
				case e: Exception => throw e
			}
		} else {
			currentVotes = null
		}

		poll.preferenceModel match {
			case RankingPreferenceModel(_, tiesAllowed) => printRankingPollForm(poll, currentVotes, tiesAllowed)
			case PositiveNegativePreferenceModel() => printPositiveNegativePollForm(poll, currentVotes)
			case _ => printDefaultPollForm(poll, currentVotes)
		}
	}

	protected def printPositiveNegativePollForm(poll: Poll, currentVotes: Array[String]): Unit = {
		// If currentVotes is null, it means that the user has not voted yet...
		var defaultVotes = currentVotes
		if (defaultVotes == null) {
			// In this case, we just initialize the vector to default values.
			defaultVotes = new Array[String](poll.candidates.size)
			for (i <- 0 until defaultVotes.length) {
				defaultVotes(i) = poll.preferenceModel.defaultTextualValue()
			}
		}
		out.println("<script type=\"text/javascript\" src=\"javascript/lib/jquery-1.10.1.min.js\"></script>")
		out.println("<script type=\"text/javascript\" src=\"javascript/lib/jquery-ui.js\"></script>")
		out.println("<script type=\"text/javascript\" src=\"javascript/form_script.js\"></script>")

		out.println("<form class=\"qualitatif\" method=\"post\" action=\"vote.do?id=" + poll.pollId + "\">")
		printPollDescription(poll)
		out.println(getMessage("messages.poll", "positiveNegativeExplanation", Nil))
		printPollHeader(poll)
		printVoteLinePositiveNegative(poll, defaultVotes)
		printVotes(poll, "currentVotes")
		out.println("<div>")
		out.println("<input type=\"hidden\" id=\"maximum\" name=\"maximum\" value=\"" + poll.preferenceModel.maxValue() + "\"/>")
		out.println("<input type=\"hidden\" id=\"minimum\" name=\"minimum\" value=\"" + poll.preferenceModel.minValue() + "\"/>")
		out.println("<input type=\"hidden\" name=\"nvid\" value=\"" + whale3.utils.Maths.generateRandomString(8) + "\"/>")
		out.println("<input type=\"submit\" value=\"OK\"/>")
		out.println("</div>")
		out.println("</form>")
		out.println("<script type=\"text/javascript\" src=\"javascript/lib/jquery-1.10.1.min.js\"></script>")
		out.println("<script type=\"text/javascript\">")
		out.println("var labels = new Object();");
		out.println("var inverseLabels = new Object();");
		for (s <- poll.preferenceModel.textualValues) {
			out.println("labels[" + poll.preferenceModel.value(s) + "] = \"" + s + "\"");
			out.println("inverseLabels[\"" + s + "\"] = \"" + poll.preferenceModel.value(s) + "\"");
		}
		out.println("console.log(labels)");
		out.println("console.log(inverseLabels)");
		out.println("  $( \".currentVotes\" ).mouseover(function() {$( \".currentVotes\" ).css({opacity: 0.8})});")
		out.println("  $( \".currentVotes\" ).mouseout(function() {$( \".currentVotes\" ).css({opacity: 0.5})});")
		out.println("</script>")
	}

	protected def printVoteLinePositiveNegative(poll: Poll, currentVotes: Array[String]): Unit = {
		out.println("<tr>")
		out.println("<td class=\"pollTableUser\">")
		if (user != null) {
			out.println("<span>" + user.nickName + "</span>")
			out.println("<input type=\"hidden\" name=\"nickName\" value=\"" + user.nickName + "\"/>")
		} else {
			out.println("<label>" + getMessage("messages.poll", "nickName", Nil) + "</label>")
			out.println("<input type=\"text\" required=\"required\" name=\"nickName\" value=\"\"/>")
		}
		out.println("</td>")
		for (c <- poll.candidates) {
			out.println("<td><input type=\"hidden\" name=\"candidate" + c.candidatePosition + "\" id=\"option" + c.candidatePosition + "\" value=\"" + currentVotes(c.candidatePosition) + "\"/>")
			var styleString: String = " style=\"cursor: pointer;\""
			var imagePath: String = "images/minus.png"
			var positiveNegative: String = "negatif"
			for (s <- poll.preferenceModel.textualValues) {
				val value: Int = poll.preferenceModel.value(s)
				if (value == 0) { imagePath = "images/neutral.png"; positiveNegative = "neutre"; }
				if (value > 0) { imagePath = "images/plus.png"; positiveNegative = "positif"; }
				if (value < 0) { imagePath = "images/minus.png"; positiveNegative = "negatif"; }
				out.println("<img" + styleString + " class=\"" + positiveNegative + c.candidatePosition + "\" src=\"" + imagePath + "\" alt=\"" + s + "\" onClick=\"binoter(" + value + "," + c.candidatePosition + ")\" onMouseOver=\"bisouris(" + value + "," + c.candidatePosition + ")\" onMouseOut=\"biretablir(" + c.candidatePosition + ")\"/>")
				if (currentVotes(c.candidatePosition).equals(s)) styleString = " style=\"opacity: 0.2; cursor: pointer;\""
			}
			out.println("</td>")
		}
		out.println("</tr>")
		out.println("<tr class=\"currentVotes\"><td colspan=\"" + (poll.candidates.size + 1) + "\">" + getMessage("messages.poll", "currentVotes", Nil) + "</td></tr>");
	}

	protected def printRankingPollForm(poll: Poll, currentVotes: Array[String], tiesAllowed: Boolean): Unit = {
		val strictEgal: String = if (tiesAllowed) "egal" else "strict"
		printPollDescription(poll)

		out.println("<script type=\"text/javascript\" src=\"javascript/lib/jquery-1.10.1.min.js\"></script>")
		out.println("<script type=\"text/javascript\" src=\"javascript/lib/jquery-ui.js\"></script>")
		out.println("<script type=\"text/javascript\" src=\"javascript/form_script.js\"></script>")
		out.println("<script type=\"text/javascript\" src=\"javascript/lib/d3.v2.js\"></script>")
		out.println("<script type=\"text/javascript\">")
		out.println("var nbCandidates = " + poll.candidates.length + ";")
		out.println("var unrankedCandidatesError = \"" + getMessage("messages.poll", "unrankedCandidatesError", Nil) + "\";")
		out.println("</script>")
		out.println("<link rel=\"stylesheet\" href=\"stylesheets/form_style.css\" />")
		out.println("<form id=\"formulaire\" class=\"ordinal_" + strictEgal + "\" method=\"post\" action=\"vote.do?id=" + poll.pollId + "\">")

		if (user != null) {
			out.println("<input type=\"hidden\" name=\"nickName\" value=\"" + user.nickName + "\"/>")
		} else {
			out.println("<label>" + getMessage("messages.poll", "nickName", Nil) + "</label>")
			out.println("<input type=\"text\" required=\"required\" name=\"nickName\" value=\"\"/>")
		}

		out.println(getMessage("messages.poll", "rankingExplanation", Nil))

		out.println("<div style=\"overflow:hidden;\">")
		// List of unsorted candidates
		out.println("<div id=\"init\">")
		out.println("<h2>" + getMessage("messages.poll", "unsortedCandidates", Nil) + "</h2>")
		out.println("<ul id=\"list_init\">")
		if (currentVotes == null) {
			for (c <- poll.candidates) {
				out.println("<li class=\"item\" draggable=\"true\" id=\"item" + c.candidatePosition + "\" onClick=\"" + strictEgal + "_choice(" + c.candidatePosition + ")\" title=\"" + c.candidateLabel + "\"><span> </span> " + c.candidateLabel + "</li>")
			}
		}
		out.println("</ul>")
		out.println("</div>")

		// list of the sorted candidates
		out.println("<div id=\"res\">")
		out.println("<h2>" + getMessage("messages.poll", "sortedCandidates", Nil) + "</h2>")
		if (tiesAllowed) {
			out.println("<ul id=\"liste\">")
			out.println("<li draggable=\"true\" class = \"inter\" ondragover=\"return false\"></li>")
			if (currentVotes != null) {
				// case where the elector modify a previous vote,
				// the candidates are sorted.
				// Here, for each rank there might be several candidates...
				val inverseVotes: Array[List[Int]] = new Array[List[Int]](currentVotes.length)
				for (i <- 0 until currentVotes.length) {
					if (inverseVotes(currentVotes(i).toInt - 1) == null) inverseVotes(currentVotes(i).toInt - 1) = Nil
					inverseVotes(currentVotes(i).toInt - 1) ::= i
				}
				// for each rank...
				for (i <- 0 until currentVotes.length) {
					out.println("<li class=\"cont\" ondragover=\"return false\">")
					if (inverseVotes(i) != null) {
						for (k <- inverseVotes(i)) {
							out.println("<span class=\"item\" id=\"item" + (k) + "\" draggable=\"true\" title=\"" + poll.candidates(k).candidateLabel + "\"><strong>" + (i + 1) + "</strong>" + poll.candidates(k).candidateLabel + "</span>")
						}
					}
					out.println("</li>")
					out.println("<li draggable=\"true\" class = \"inter\" ondragover=\"return false\"></li>")
				}
			}
			out.println("</ul>")
			out.println("<ul id=\"resInter\">")
			for (c <- poll.candidates) {
				if (currentVotes == null) {
					out.println("<li draggable=\"true\" class = \"inter\" ondragover=\"return false\"></li>")
				} else {
					out.println("<li draggable=\"true\" class = \"inter\" ondragover=\"return false\"></li>")
				}
			}
			out.println("</ul>")
			// hold the element of the list which are used to contain the candidates and not used   
			out.println("<ul id=\"resCont\">")
			for (c <- poll.candidates) {
				if (currentVotes == null) {
					out.println("<li class=\"cont\" ondragover=\"return false\"></li>")
				} else {
					out.println("<li class=\"cont\" ondragover=\"return false\"></li>")
				}
			}
			out.println("</ul>")
		} else {
			out.println("<ul id=\"sortable\">")
			if (currentVotes != null) {
				// case where the elector modify a previous vote,
				// the candidates are sorted.
				val inverseVotes: Array[Int] = new Array[Int](currentVotes.length)
				for (i <- 0 until currentVotes.length) {
					inverseVotes(currentVotes(i).toInt - 1) = i
				}
				for (i <- 0 until currentVotes.length) {
					out.println("<li class=\"item\" id=\"item" + (currentVotes(i).toInt - 1) + "\" title=\"" + poll.candidates(inverseVotes(i).toInt).candidateLabel + "\"><span> " + (i + 1) + " -</span> " + poll.candidates(inverseVotes(i).toInt).candidateLabel + "</li>")
				}
			}
			out.println("</ul>")
		}
		out.println("</div>")
		out.println("</div>")

		//inputs of the form
		for (c <- poll.candidates) {
			out.println("<input type=\"hidden\" id=\"option" + c.candidatePosition + "\" name=\"candidate" + c.candidatePosition + "\" value=\"" + (if (currentVotes != null) currentVotes(c.candidatePosition) else "") + "\" />")
		}
		out.println("<div>")
		out.println("<input type=\"hidden\" name=\"nvid\" value=\"" + whale3.utils.Maths.generateRandomString(8) + "\"/>")
		out.println("<input type=\"submit\" value=\"OK\"/>")
		out.println("</div>")
		out.println("</form>")
		out.println("<p>" + getMessage("messages.poll", "currentVotes", Nil) + "</p>")
		printPollHeader(poll)
		printVotes(poll, "currentVotes")
	}

	protected def printDefaultPollForm(poll: Poll, currentVotes: Array[String]): Unit = {
		// If currentVotes is null, it means that the user has not voted yet...
		var defaultVotes = currentVotes
		if (defaultVotes == null) {
			// In this case, we just initialize the vector to default values.
			defaultVotes = new Array[String](poll.candidates.size)
			for (i <- 0 until defaultVotes.length) {
				defaultVotes(i) = poll.preferenceModel.defaultTextualValue()
			}
		}
		out.println("<form method=\"post\" action=\"vote.do?id=" + poll.pollId + "\">")
		printPollDescription(poll)
		printPollHeader(poll)
		printVoteLine(poll, defaultVotes)
		printVotes(poll, "currentVotes")
		out.println("<div>")
		out.println("<input type=\"hidden\" name=\"nvid\" value=\"" + whale3.utils.Maths.generateRandomString(8) + "\"/>")
		out.println("<input type=\"submit\" value=\"OK\"/>")
		out.println("</div>")
		out.println("</form>")
		out.println("<script type=\"text/javascript\" src=\"javascript/lib/jquery-1.10.1.min.js\"></script>")
		out.println("<script type=\"text/javascript\">")
		out.println("  $( \".currentVotes\" ).mouseover(function() {$( \".currentVotes\" ).css({opacity: 0.8})});")
		out.println("  $( \".currentVotes\" ).mouseout(function() {$( \".currentVotes\" ).css({opacity: 0.5})});")
		out.println("</script>")
	}

	protected def printVoteLine(poll: Poll, currentVotes: Array[String]): Unit = {
		out.println("<tr>")
		out.println("<td class=\"pollTableUser\">")
		if (user != null) {
			out.println("<span>" + user.nickName + "</span>")
			out.println("<input type=\"hidden\" name=\"nickName\" value=\"" + user.nickName + "\"/>")
		} else {
			out.println("<label>" + getMessage("messages.poll", "nickName", Nil) + "</label>")
			out.println("<input type=\"text\" required=\"required\" name=\"nickName\" value=\"\"/>")
		}
		out.println("</td>")
		for (c <- poll.candidates) {
			out.println("<td>")
			for (s <- poll.preferenceModel.textualValues) {
				out.println("<input type=\"radio\" name=\"candidate" + c.candidatePosition + "\" value=\"" + s + "\"" + (if (currentVotes(c.candidatePosition).equals(s)) " checked=\"checked\"" else "") + "/><label>" + s + "</label>")
			}
			out.println("</td>")
		}
		out.println("</tr>")
		out.println("<tr class=\"currentVotes\"><td colspan=\"" + (poll.candidates.size + 1) + "\">" + getMessage("messages.poll", "currentVotes", Nil) + "</td></tr>");
	}
}

object VoteController {
	val FIRST_STEP: Int = -1
	val SUCCESS: Int = 0
	val UNDEFINED_POLL: Int = 255
	val VOTED_TWICE: Int = 1
	val POLL_CLOSED: Int = 2
}
