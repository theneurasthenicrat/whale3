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

import whale3.vote.User

@WebServlet(name = "LanguageController", urlPatterns = Array("/setLanguage.do"))
class LanguageController extends HttpServlet {
  def processRequest(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val out: PrintWriter = response.getWriter()
    val session: HttpSession = request.getSession()

    val requestedURL: String = session.getAttribute("referer").toString
    val newLocale: String = request.getParameter("language")
    session.setAttribute("locale", newLocale)
    response.setHeader("Refresh", "0; URL=" + requestedURL.toString()) 
  }
  
  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response);
  }
  
  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response);
  }
}
