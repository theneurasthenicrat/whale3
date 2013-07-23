package whale3.controllers.page

import whale3.vote.Poll
import SetClosingDateController._
import whale3.database.Polls
import javax.servlet.annotation.WebServlet

@WebServlet(name = "SetClosingDateController", urlPatterns = Array("/setClosingDate.do"))
class SetClosingDateController extends AbstractPageController with AdminRequired with ConnectionRequired {
	override def main(): Unit = {
		val pollId: String = request.getParameter("id")
		errorCode match {
			case FIRST_STEP => {}
			case SUCCESS => {
				val poll: Poll = Polls.getPollById(pollId)
				val closingDate: java.util.Date = if (request.getParameter("nowOrLater").equals("now")) new java.util.Date() else whale3.utils.Dates.stringToDate(request.getParameter("closingDate") + " " + request.getParameter("closingHour") + ":" + request.getParameter("closingMinute") + ":00");
				Polls.setClosingDate(pollId, closingDate);
				success(getMessage("messages.admin", "setClosingDateSuccessful", Nil))
				return
			}
			case UNDEFINED_POLL => error(getMessage("messages.poll", "unspecifiedPoll", Nil))
			case _ => throw new Exception("Unknown step " + errorCode)
		}
		val poll: Poll = Polls.getPollById(pollId)
		request.setAttribute("poll", poll)
		request.getRequestDispatcher("views/setClosingDate.jsp").include(request, response)
	}

	private def errorCode: Int = {
		val pollId: String = request.getParameter("id")
		if (pollId == null || pollId == "") return UNDEFINED_POLL
		if (request.getParameter("nowOrLater") != null) return SUCCESS
		FIRST_STEP
	}

}

object SetClosingDateController {
	val FIRST_STEP: Int = -1
	val SUCCESS: Int = 0
	val UNDEFINED_POLL: Int = 255
}