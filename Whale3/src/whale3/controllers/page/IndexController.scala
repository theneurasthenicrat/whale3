package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession

@WebServlet(name = "IndexController", urlPatterns = Array("/index.do"))
class IndexController extends AbstractPageController {
  override def menu(): Boolean = false

  override def main(): Unit = {
      request.getRequestDispatcher("views/index.jsp").include(request, response)
  }
}
