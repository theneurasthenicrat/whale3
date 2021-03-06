package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import whale3.database._
import whale3.vote._

/**
 * A trait that adds the behaviour corresponding to the pages that need to
 * be connected *as the owner of a poll* to be displayed: (i) Check whether
 * the user is connected as the owner of the poll, and (ii) display an error
 * page if she / he is not.
 */
trait AdminRequired extends AbstractPageController {
  override protected def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    locale = req.getLocale()
    request = req
    response = res
    request.setCharacterEncoding("UTF-8")
    response.setContentType("text/html; charset=utf-8")
    response.setCharacterEncoding("UTF-8")
    val pollId: String = request.getParameter("id")
    if (pollId == null || pollId == "") {
      error(getMessage("messages.poll", "unspecifiedPoll", Nil))
      return;
    }
    try {
      val poll: Poll = Polls.getPollById(pollId)
      request.setAttribute("poll", poll)
      if (!poll.isOwnedBy(user)) {
	session.setAttribute("requestedURL", currentURL)
	before()
	info(getMessage("messages.common", "mustBeAdministrator", Nil))
	request.getRequestDispatcher("views/login.jsp").include(request, response)
	after()
      } else {
	super.processRequest(req, res)
      }
    } catch {
      case e: UnknownPollException => error(getMessage("messages.poll", "unknownPollException", pollId::Nil)); return;
    }
  }
}
