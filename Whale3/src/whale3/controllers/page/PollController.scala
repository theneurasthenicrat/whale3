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

@WebServlet(name = "PollController", urlPatterns = Array("/poll.do"))
class PollController extends AbstractPageController {
	override def main(): Unit = {
		val pollId: String = request.getParameter("id")
		if (pollId == null || pollId == "") {
			error(getMessage("messages.poll", "unspecifiedPoll", Nil))
			return ;
		}
		try {
			val poll: Poll = Polls.getPollById(pollId)
			request.setAttribute("poll", poll)
			printPollDescription(poll)
			printPollHeader(poll)
			printVotes(poll)
			printClosingDate(poll)
			request.getRequestDispatcher("views/pollMenu.jsp").include(request, response)
		} catch {
			case e: UnknownPollException => error(getMessage("messages.poll", "unknownPollException", pollId :: Nil)); return ;
		}
	}

	protected def printPollDescription(poll: Poll): Unit = {
		out.println("<h1>" + poll.pollTitle + "</h1>")
		out.println("<pre class=\"description\">")
		out.println(poll.pollDescription)
		out.println("</pre>")
	}

	protected def printPollHeader(poll: Poll): Unit = {
		out.println("<table class=\"pollTable\">")
		if (poll.isInstanceOf[DatePoll]) {
			printDatePollHeader(poll.asInstanceOf[DatePoll])
		} else {
			printClassicPollHeader(poll)
		}
	}

	private def printClassicPollHeader(poll: Poll): Unit = {
		out.println("<thead>")
		out.println("<tr>")
		out.println("<th></th>")
		for (c <- poll.candidates) {
			out.println("<th class=\"pollTableHead\">" + c.candidateLabel + "</th>")
		}
		out.println("</tr>")
		out.println("</thead>")
	}

	private def printDatePollHeader(poll: DatePoll): Unit = {
		out.println("<thead>")
		out.println("<tr>")
		out.println("<th></th>")
		var currentDate: Date = null
		var currentNumber: Int = 0
		for (t <- poll.candidates) {
			if (currentDate == null) currentDate = t.day // First timeslot
			if (t.day.equals(currentDate)) { // Same day, next timeslot
				currentNumber += 1
			} else { // Next day
				out.println("<th class=\"pollTableHead\" colspan=\"" + currentNumber + "\">" + (new SimpleDateFormat("EEE d MMM yyyy", locale)).format(currentDate) + "</th>")
				currentNumber = 1
				currentDate = t.day
			}
		}
		out.println("<th class=\"pollTableHead\" colspan=\"" + currentNumber + "\">" + (new SimpleDateFormat("EEE d MMM yyyy", locale)).format(currentDate) + "</th>")
		out.println("</tr>")
		out.println("<tr>")
		out.println("<th></th>")
		for (t <- poll.candidates) {
			out.println("<th class=\"pollTableHead\">" + t.timeSlotLabel + "</th>")
		}
		out.println("</tr>")
		out.println("</thead>")
	}

	protected def printVotes(poll: Poll): Unit = printVotes(poll, "")

	protected def printVotes(poll: Poll, trClass: String): Unit = {
		out.println("<tbody>")

		var displayVotes: Boolean = false;
		(poll.isClosed, poll.attributes.get("votes#open"), poll.attributes.get("votes#closed")) match {
			case (true, _, Some("no")) => out.println("<tr class=\"" + trClass + "\"><td class=\"emptyCell\"></td><td colspan=\"" + poll.candidates.size + "\" class=\"noVote\">" + getMessage("messages.poll", "hiddenVotes", Nil) + "</td></tr>")
			case (false, Some("no"), Some("no")) => out.println("<tr class=\"" + trClass + "\"><td class=\"emptyCell\"></td><td colspan=\"" + poll.candidates.size + "\" class=\"noVote\">" + getMessage("messages.poll", "hiddenVotes", Nil) + "</td></tr>")
			case (false, Some("no"), Some("yes")) => out.println("<tr class=\"" + trClass + "\"><td class=\"emptyCell\"></td><td colspan=\"" + poll.candidates.size + "\" class=\"noVote\">" + getMessage("messages.poll", "hiddenVotesUntilClosed", Nil) + "</td></tr>")
			case _ => displayVotes = true
		}
		if (displayVotes) {
			if (poll.votes.size == 0) {
				out.println("<tr class=\"" + trClass + "\"><td class=\"emptyCell\"></td><td colspan=\"" + poll.candidates.size + "\" class=\"noVote\">" + getMessage("messages.poll", "noVoteYet", Nil) + "</td></tr>")
			} else {
			  var i: Int = 0
				for (v <- poll.votes) {
					i += 1
					out.println("<tr class=\"" + trClass + "\"><td class=\"pollTableUser\">" + (if (poll.anonymize) getMessage("messages.poll", "anonymousBallot", (i toString)::Nil) else v.user.nickName) + "</td>")
					val prefModel: PreferenceModel = poll.preferenceModel
					for (s <- v.values) {
						out.println("<td class=\"poll-" + whale3.utils.Maths.roundTo(100 * (prefModel.value(s) - prefModel.minValue()) / prefModel.nbValues(), 10) + "percent\">" + s + "</td>")
					}
					out.println("</tr>")
				}
			}
		}
		out.println("</tbody>")
		out.println("</table>")
	}

	private def printClosingDate(poll: Poll): Unit = {
		if (poll.isClosed) {
			out.println(locale)
			out.println(getMessage("messages.poll", "isAlreadyClosed", ((new SimpleDateFormat("EEEE d MMMM yyyy", locale)).format(poll.closingDate)) :: ((new SimpleDateFormat("hh:mm", locale)).format(poll.closingDate)) :: Nil))
		} else {
			out.println(getMessage("messages.poll", "pollClosesAt", ((new SimpleDateFormat("EEEE d MMMM yyyy", locale)).format(poll.closingDate)) :: ((new SimpleDateFormat("hh:mm", locale)).format(poll.closingDate)) :: Nil))
		}
	}
}
    
