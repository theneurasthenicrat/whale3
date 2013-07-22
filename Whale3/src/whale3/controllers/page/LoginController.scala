package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import whale3.database._
import whale3.vote._

@WebServlet(name = "LoginController", urlPatterns = Array("/login.do"))
class LoginController extends AbstractPageController {
  private var eMail: String = null
  private var password: String = null
  private var errorCode: Int = LoginController.FIRST_DISPLAY

  override def before(): Unit = {
    errorCode = LoginController.FIRST_DISPLAY
    eMail = request.getParameter("eMail")
    password = request.getParameter("password")
    if ((eMail != null) && (password != null)) {
      Connection.getConnection();
      try {
	val user: User = Users.getRegisteredUser(eMail, password)
	session.setAttribute("user", user)
	errorCode = LoginController.SUCCESS
	val requestedURL: Object = session.getAttribute("requestedURL")
	if (requestedURL != null) {
	  response.setHeader("Refresh", "2; URL=" + requestedURL.toString()) 
	  session.removeAttribute("requestedURL")
	}
      } catch {
	case e: UnknownUserException => errorCode = LoginController.UNKNOWN_USER
	case e: Exception => errorCode = LoginController.UNKNOWN_EXCEPTION
      }
    }
    super.before()
  }

  override def main(): Unit = {
    errorCode match {
      case LoginController.SUCCESS => {success(getMessage("messages.login", "loginSuccessful", user.nickName::Nil)); return}
      case LoginController.UNKNOWN_USER => error(getMessage("messages.login", "userUnknown", eMail::Nil))
      case LoginController.UNKNOWN_EXCEPTION => error(getMessage("messages.login", "unknownException", Nil))
      case _ => {}
    }

    request.getRequestDispatcher("views/login.jsp").include(request, response)
  }
}

object LoginController {
  val FIRST_DISPLAY: Int = -1
  val SUCCESS: Int = 0
  val UNKNOWN_USER: Int = 1
  val UNKNOWN_EXCEPTION: Int = 255
}
