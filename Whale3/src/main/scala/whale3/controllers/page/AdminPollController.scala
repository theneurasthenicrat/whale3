package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import whale3.database._
import whale3.vote._
import whale3.utils._

import scala.collection.JavaConverters._
import scala.collection.mutable.Map

@WebServlet(name = "AdminPollController", urlPatterns = Array("/adminPoll.do"))
class AdminPollController extends AbstractPageController with AdminRequired with ConnectionRequired {
  override protected def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    super.processRequest(req, res)
  }

  override def main(): Unit = {
    request.getRequestDispatcher("views/adminPoll.jsp").include(request, response)
  }
}
