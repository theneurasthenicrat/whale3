package whale3.controllers.json

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
import whale3.vote._

abstract class AbstractJSONController extends HttpServlet {
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
    locale = req.getLocale()
    request = req
    response = res
    response.setContentType("application/json; charset=utf-8")
    response.addHeader("Access-Control-Allow-Origin", "*")
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
  }

  /** What to display as a footer of the page */ 
  def after(): Unit = {
  }

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    request.setCharacterEncoding("UTF-8")
    processRequest(request, response);
  }
  
  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    request.setCharacterEncoding("UTF-8")
    processRequest(request, response);
  }

  def getMessage(bundleName: String, key: String, args: List[String]): String = {
    val bundle: ResourceBundle = ResourceBundle.getBundle(bundleName, locale)
    MessageFormat.format(bundle.getString(key), args: _*)
  }

}
