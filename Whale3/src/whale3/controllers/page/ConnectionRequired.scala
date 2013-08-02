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
trait ConnectionRequired extends AbstractPageController {
  override protected def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    locale = req.getLocale()
    request = req
    response = res
    request.setCharacterEncoding("UTF-8")
    response.setContentType("text/html; charset=utf-8")
    response.setCharacterEncoding("UTF-8")
    if (user == null) {
      session.setAttribute("requestedURL", currentURL)
      before()
      info(getMessage("messages.common", "mustBeConnected", Nil))
      request.getRequestDispatcher("views/login.jsp").include(request, response)
      after()
    } else {
      super.processRequest(req, res)
    }
  }
}
