package whale3.controllers

import java.io.IOException
import java.io.PrintWriter
import java.sql.Connection
import java.sql.SQLException
import java.util.logging.Level
import java.util.logging.Logger
import javax.annotation.Resource
import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import javax.sql.DataSource
import whale3.vote.User

@WebServlet(name = "LoginBoxController", urlPatterns = Array("/loginBox.do"))
class LoginBoxController extends HttpServlet {
  def processRequest(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val out: PrintWriter = response.getWriter()
    val session: HttpSession = request.getSession()

    val user: User = session.getAttribute("user").asInstanceOf[User]
    if (user != null) {
      request.setAttribute("user", user)
      request.getRequestDispatcher("views/userBox.jsp").include(request, response)
    } else {
      request.getRequestDispatcher("views/loginBox.jsp").include(request, response)
    }
  }
  
  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response);
  }
  
  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response);
  }
}
