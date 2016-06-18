package whale3.database

import java.sql.SQLException
import java.sql.Statement
import javax.sql.DataSource
import javax.annotation.Resource

object Connection {
  //  @Resource(name = "jdbc/whale3")
  private val ds: DataSource = new javax.naming.InitialContext().lookup("java:comp/DefaultDataSource").asInstanceOf[DataSource]
  private var connec: java.sql.Connection = null

  def getConnection(): java.sql.Connection = {
    try {
      if (connec == null) {
        connec = ds.getConnection()
        connec.setAutoCommit(false)
      }
      connec
    } catch {
      case ex: SQLException => throw new DataBaseException("Database error while trying to get a new connection. Error information: " + ex.toString())
    }
  }

  def closeConnection(): Unit = {
    try {
      if (connec != null) connec.close()
    } catch {
      case ex: SQLException => throw new DataBaseException("Database error while trying to close the connection. Error information: " + ex.toString())
    }
  }
}
  
