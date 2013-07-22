package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import whale3.database._
import whale3.vote._

@WebServlet(name = "LogoutController", urlPatterns = Array("/logout.do"))
class LogoutController extends AbstractPageController {
  override def before(): Unit = {
    session.removeAttribute("user");
    super.before()
  }

  override def main(): Unit = {
    success(getMessage("messages.login", "logoutSuccessful", Nil))
  }
}
