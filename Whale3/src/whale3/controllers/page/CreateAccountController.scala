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

@WebServlet(name = "CreateAccountController", urlPatterns = Array("/createAccount.do"))
class CreateAccountController extends AbstractPageController  {
  private var errorCode: Int = CreateAccountController.FIRST_DISPLAY

  override def before(): Unit = {
    errorCode =  CreateAccountController.FIRST_DISPLAY
    if(request.getParameter("nickName") == null) {
      super.before()
      return
    }
    
    if((request.getParameter("password") != null) && (!request.getParameter("password").equals(request.getParameter("passwordConfirmation")))) {
      errorCode = CreateAccountController.DIFFERENT_VALUES
    }

    if((request.getParameter("password") != null) && (request.getParameter("password").equals(""))) {
      errorCode = CreateAccountController.EMPTY_PASSWORDS
    }
    
    if (errorCode == CreateAccountController.FIRST_DISPLAY) {
      try {
	val user: RegisteredUser = Users.createRegisteredUser(request.getParameter("nickName"), request.getParameter("eMail"), request.getParameter("password"))
	session.setAttribute("user", user)
	errorCode = CreateAccountController.SUCCESS
      } catch {
	case e: ExistingUserException => errorCode = CreateAccountController.EXISTING_USER
      }
    }
    
    super.before()
  }

  override def main(): Unit = {
    errorCode match {
      case CreateAccountController.SUCCESS => {success(getMessage("messages.login", "accountCreationSuccessful", user.nickName::Nil)); return}
      case CreateAccountController.DIFFERENT_VALUES => {error(getMessage("messages.login", "differentPasswords", Nil))}
      case CreateAccountController.EMPTY_PASSWORDS => {error(getMessage("messages.login", "emptyPasswords", Nil))}
      case CreateAccountController.EXISTING_USER => {error(getMessage("messages.login", "userAlreadyExists", request.getParameter("eMail")::Nil))}
      case _ => {}
    }
    request.getRequestDispatcher("views/createAccountForm.jsp").include(request, response)
  }
}

object CreateAccountController {
  val FIRST_DISPLAY: Int = -1
  val SUCCESS: Int = 0
  val DIFFERENT_VALUES: Int = 1
  val EMPTY_PASSWORDS: Int = 2
  val EXISTING_USER: Int = 3
}
