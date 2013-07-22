package whale3.controllers.page

import javax.annotation.Resource
import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.util.ResourceBundle
import java.util.Locale
import java.text.MessageFormat
import javax.servlet.http.HttpSession
import javax.servlet.jsp.jstl.core.Config
import whale3.vote._

import scala.collection.JavaConverters._

abstract class AbstractPageController extends HttpServlet {
  /** Fallback locale */
  protected var locale: Locale = new Locale("en_US")
  /** Requests and responses to be used during the entire page process
   * Do not forget to initialize!
   * */
  protected var request: HttpServletRequest = null
  protected var response: HttpServletResponse = null
  protected def session: HttpSession = request.getSession()
  protected def out: java.io.PrintWriter = response.getWriter()

  /** Sets the title of the page. By default, uses the message with key "title" in the message property file
   * designated by bundleName */
  def title: String = getMessage("messages.common", "title", Nil)
  /** Do we display the menu or not ? */
  def menu: Boolean = true
  /** Get the currently connected user */
  def user: RegisteredUser = if (session.getAttribute("user") == null) null else session.getAttribute("user").asInstanceOf[RegisteredUser]

  protected def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    request = req
    response = res
    if (request.getParameter("format") != null) {
      request.getRequestDispatcher(request.getServletPath() + "-" + request.getParameter("format") + parameterList).forward(request, response)
    }
    locale = if (session.getAttribute("locale") != null) new Locale(session.getAttribute("locale").toString) else req.getLocale()
    session.setAttribute("referer", currentURL)
    Config.set(session, Config.FMT_LOCALE, locale)
    response.setContentType("text/html; charset=utf-8")
    request.setCharacterEncoding("UTF-8")
    response.setCharacterEncoding("UTF-8")
    before()
    main()
    after()
  }
  
  /** What to display in the main part of the page */
  def main(): Unit

  /** What to display as a header of the page */ 
  def before(): Unit = {
    request.setAttribute("title", title)
    request.setAttribute("menu", menu)
    request.getRequestDispatcher("views/header.jsp").include(request, response)
  }

  /** What to display as a footer of the page */ 
  def after(): Unit = {
    request.getRequestDispatcher("views/footer.jsp").include(request, response)
  }

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    request.setCharacterEncoding("UTF-8")
    processRequest(request, response);
  }
  
  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    request.setCharacterEncoding("UTF-8")
    processRequest(request, response);
  }

  def info(message: String): Unit = {
    request.setAttribute("message", message)
    request.getRequestDispatcher("views/info.jsp").include(request, response)
  }

  def success(message: String): Unit = {
    request.setAttribute("message", message)
    request.getRequestDispatcher("views/success.jsp").include(request, response)
  }

  def error(message: String): Unit = {
    request.setAttribute("message", message)
    request.getRequestDispatcher("views/error.jsp").include(request, response)
  }

  def getMessage(bundleName: String, key: String, args: List[String]): String = {
    val bundle: ResourceBundle = ResourceBundle.getBundle(bundleName, locale)
    MessageFormat.format(bundle.getString(key), args: _*)
  }


  protected def currentURL: String = {
    request.getRequestURL() + parameterList
  }

  protected def parameterList: String = {
    val sb: StringBuffer = new StringBuffer()
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
