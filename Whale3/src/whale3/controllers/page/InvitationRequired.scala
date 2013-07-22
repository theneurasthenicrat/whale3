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
 * be connected to be displayed: (i) Check whether the user is connected, and
 * (ii) display an error page if she / he is not.
 */
trait InvitationRequired extends AbstractPageController {
  abstract override protected def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    locale = req.getLocale()
    request = req
    response = res
    request.setCharacterEncoding("UTF-8")
    response.setCharacterEncoding("UTF-8")

    val pollId: String = request.getParameter("id")
    if (pollId == null) {super.processRequest(req, res); return}
    try {
      val poll: Poll = Polls.getPollById(pollId)
      
      (poll.attributes.get("participationAllowed#anonymous"), poll.attributes.get("participationAllowed#registered")) match {
	case (Some("no"), Some("no")) => {
	  if (request.getParameter("certificate") == null) {
	    before()
	    info(getMessage("messages.poll", "mustBeInvited", Nil))
	    request.getRequestDispatcher("views/enterCertificate.jsp?id=" + request.getParameter("id")).include(request, response)
	    after()
	    return
	  }
	  if (!Polls.isInvited(request.getParameter("id"), request.getParameter("certificate"))) {
	    before()
	    error(getMessage("messages.poll", "wrongCertificate", Nil))
	    request.getRequestDispatcher("views/enterCertificate.jsp?id=" + request.getParameter("id")).include(request, response)
	    after()
	    return
	  }
	}	
	case _ => {}
      }
      super.processRequest(req, res)
    } catch {
      case e: UnknownPollException => error(getMessage("messages.poll", "unknownPollException", pollId::Nil)); return;
    }
  }
}
