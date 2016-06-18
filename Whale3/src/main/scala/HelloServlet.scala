
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
import javax.sql.DataSource

/**
 * Just a dummy servlet to check whether the Tomcat installation is OK and works fine
 * with the data source.
 */
@WebServlet(name = "HelloServlet", urlPatterns = Array("/hello"))
class HelloServlet extends HttpServlet {
  
  @Resource
  private var ds: DataSource = null
  
  def processRequest(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    response.setContentType("text/html;charset=UTF-8")
    val out: PrintWriter = response.getWriter()
    var conn: Connection = null
    try {      
      conn = ds.getConnection()
      out.println("<html>")
      out.println("<head>")
      out.println("<title>Servlet MaServlet</title>")      
      out.println("</head>")
      out.println("<body>")
      out.println("<h1>Servlet MaServlet at " + request.getContextPath() + "</h1>")
      out.println("La connexion est ok")
      out.println("</body>")
      out.println("</html>")
    } catch {
	case ex: SQLException => throw new ServletException(ex.getMessage(),ex)
    }
    finally {   
      try {
        conn.close()
      } catch {
	case ex: SQLException => throw new ServletException(ex.getMessage(),ex)
      } 
      out.close()
    }
  }

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response);
  }

  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response);
  }

  override def getServletInfo(): String = "Short description"
}
