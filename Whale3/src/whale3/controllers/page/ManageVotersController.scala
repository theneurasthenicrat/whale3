package whale3.controllers.page

import ManageVotersController._
import whale3.database.Polls
import whale3.vote.Poll
import whale3.vote.InvitedUser

class ManageVotersController extends AbstractPageController with AdminRequired with ConnectionRequired {
	override def main(): Unit = {
		val pollId: String = request.getParameter("id")
		errorCode match {
			case LIST => {}
			case ADD => {
				/*        val poll: Poll = Polls.getPollById(pollId)
        val closingDate: java.util.Date = if (request.getParameter("nowOrLater").equals("now")) new java.util.Date() else whale3.utils.Dates.stringToDate(request.getParameter("closingDate") + " " + request.getParameter("closingHour") + ":" + request.getParameter("closingMinute") + ":00");
        Polls.setClosingDate(pollId, closingDate);
        success(getMessage("messages.admin", "setClosingDateSuccessful", Nil))
        return*/
			}
			case UNDEFINED_POLL => error(getMessage("messages.poll", "unspecifiedPoll", Nil))
			case _ => throw new Exception("Unknown step " + errorCode)
		}
		val poll: Poll = Polls.getPollById(pollId)
		out.println("<div class=\"extendedForm\">")
		out.println("<h1>" + getMessage("messages.admin", "manageVotersTitle", Nil) + "</h1>")
		displayVoterList(poll)
		displayVoterAddForm(poll)
		out.println("</div>")
	}

	private def displayVoterList(poll: Poll): Unit = {
		val voters: List[InvitedUser] = Polls.getInvitedUsersByPollId(poll.pollId)
    out.println("<h2>" + getMessage("messages.admin", "voterList", Nil) + "</h2>")
		out.println("<table class=\"pollTable\">")
		out.println("<tbody>")
		if (voters.isEmpty) {
			out.println("<tr><td>" + getMessage("messages.admin", "emptyVoterList", Nil) + "</td></tr>")
		} else {
			voters.foreach(v => {
				out.println("<tr>")
				out.println("<td class=\"voterName\">" + v.nickName + "</td>")
				out.println("<td class=\"voterEMail\">" + v.eMail + "</td>")
				out.println("<td class=\"voterCertificate\">" + v.certificate + "</td>")
				out.println("</tr>")
			})
		}
		out.println("</tbody>")
		out.println("</table>")
	}

	private def displayVoterAddForm(poll: Poll): Unit = {
		out.println("<h2>" + getMessage("messages.admin", "addVoter", Nil) + "</h2>")
		out.println("<form method=\"POST\" action=\"manageVoters.do?id=" + poll.pollId + "\">")
		out.println("<label>" + getMessage("messages.admin", "voterName", Nil) + "</label>")
		out.println("<input type=\"text\" required=\"required\" name=\"voterName\"/>")
		out.println("<label>" + getMessage("messages.admin", "voterEmail", Nil) + "</label>")
		out.println("<input type=\"email\" name=\"voterEmail\"/>")
		out.println("<input type=\"hidden\" name=\"add\" value=\"1\"/>")
		out.println("<input type=\"submit\" name=\"submit\" value=\"add\"/>")
		out.println("</form>")
	}

	private def errorCode: Int = {
		val pollId: String = request.getParameter("id")
		if (pollId == null || pollId == "") return UNDEFINED_POLL
		if (request.getParameter("add") != null) return ADD
		if (request.getParameter("remove") != null) return REMOVE
		LIST
	}
}

object ManageVotersController {
	val LIST: Int = -1
	val ADD: Int = 0
	val REMOVE: Int = 1
	val UNDEFINED_POLL: Int = 255
}