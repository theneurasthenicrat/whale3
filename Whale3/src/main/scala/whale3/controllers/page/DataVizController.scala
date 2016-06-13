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

@WebServlet(name = "DataVizController", urlPatterns = Array("/dataViz.do"))
class DataVizController extends AbstractPageController {
	override def main(): Unit = {
		val pollId: String = request.getParameter("id")
		if (pollId == null || pollId == "") {
			error(getMessage("messages.poll", "unspecifiedPoll", Nil))
			return ;
		}
		try {
			val poll: Poll = Polls.getPollById(pollId)
			request.setAttribute("poll", poll)
			if (!poll.isClosed && poll.attributes.get("results#open") == Some("no")) {
				info(getMessage("messages.poll", "hiddenResultsUntilClosed", Nil))
			} else {
				request.getRequestDispatcher("views/pollDataViz.jsp").include(request, response)
			}
			request.getRequestDispatcher("views/pollMenu.jsp").include(request, response)
		} catch {
			case e: UnknownPollException => error(getMessage("messages.poll", "unknownPollException", pollId :: Nil)); return ;
		}
	}
}
   
 
