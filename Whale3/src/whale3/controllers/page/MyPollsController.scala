package whale3.controllers.page

import javax.servlet.annotation.WebServlet
import whale3.database.Polls
import whale3.vote.Poll
import whale3.database.UnknownPollException

@WebServlet(name = "MyPollsController", urlPatterns = Array("/myPolls.do"))
class MyPollsController extends AbstractPageController with ConnectionRequired {
	override def main(): Unit = {
		try {
			val polls: (List[Poll], List[Poll]) = Polls.getPollSummariesByUserId(user.userId)
      out.println("<h1>" + getMessage("messages.poll", "myPolls", Nil) + "</h1>")
			out.println("<h2>" + getMessage("messages.poll", "myPollsAsAdministrator", Nil) + "</h2>")
			out.println("<table class=\"pollTable\">")
			out.println("<tbody>")
			polls._1.foreach(poll => {
				out.println("<tr>")
				out.println("<td class=\"pollName\"><a href=\"poll.do?id=" + poll.pollId + "\">" + poll.pollTitle + "</a></td>")
				out.println("<td class=\"pollDesc\"><pre>" + poll.pollDescription + "</pre></td>")
				out.println("<td class=\"pollAction\"><a class=\"adminPoll\" title=\"" + getMessage("messages.poll", "administratePoll", Nil) + "\" href=\"adminPoll.do?id=" + poll.pollId + "\"><span class=\"icon icon-settings\"></span></a></td>")
				out.println("<td class=\"pollAction\"><a class=\"deletePoll\" title=\"" + getMessage("messages.poll", "deletePoll", Nil) + "\" href=\"deletePoll.do?id=" + poll.pollId + "\"><span class=\"icon icon-trash_can\"></span></a></td>")
				out.println("</tr>")
			})

			out.println("</tbody>")
			out.println("</table>")

			out.println("<h2>" + getMessage("messages.poll", "myPollsAsParticipant", Nil) + "</h2>")
			out.println("<table class=\"pollTable\">")
			out.println("<tbody>")
			polls._2.foreach(poll => {
				out.println("<tr>")
				out.println("<td class=\"pollName\"><a href=\"poll.do?id=" + poll.pollId + "\">" + poll.pollTitle + "</a></td>")
				out.println("<td class=\"pollDesc\"><pre>" + poll.pollDescription + "</pre></td>")
				out.print("<td class=\"pollIcon\">")
				if (poll.closingDate.compareTo(new java.util.Date()) <= 0) {
					out.print("<i class=\"icon-pen\"></i>")
				} else {
					out.print("<a class=\"modifyPoll\" title=\"" + getMessage("messages.poll", "modifyMyVote", Nil) + "\" href=\"vote.do?id=" + poll.pollId + "\"><span class=\"icon icon-pen\"></span></a>")
				}
				out.println("</td>")
				out.println("</tr>")
			})

		} catch {
			case e: Exception => throw e
		}
	}

}