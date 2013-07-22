package whale3.controllers.json

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import whale3.database._
import whale3.vote._

import scala.collection.JavaConverters._

/**
 * A trait that adds the behaviour corresponding to the pages that need to
 * be connected to be displayed: (i) Check whether the user is connected, and
 * (ii) display an error page if she / he is not.
 */
trait ConnectionRequired extends AbstractJSONController {
  abstract override protected def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    locale = req.getLocale()
    request = req
    response = res
    if (user == null) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED)
      return;
    } else {
      super.processRequest(req, res)
    }
  }

  private def currentURL: String = {
    val sb: StringBuffer = request.getRequestURL()
    var sepSymbol: Char = '?'
    request.getParameterNames().asScala.foreach(k => {
      if (request.getParameterValues(k) != null) {
	sb.append(sepSymbol)
	sb.append(k)
	sb.append("=")
	sb.append(request.getParameterValues(k)(0))
	sepSymbol = '&'
      }
    })
    sb.toString()
  }
}
