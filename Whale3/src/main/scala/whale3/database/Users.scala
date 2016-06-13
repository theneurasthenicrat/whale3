package whale3.database

import whale3.vote._
import whale3.utils.Crypto._
import whale3.utils.Maths._
import java.sql.ResultSet
import java.sql.SQLException
import java.sql.Statement
import javax.annotation.Resource

object Users {
	private def createUser(nickName: String): User = {
		val connec: java.sql.Connection = Connection.getConnection()
		val stmt: Statement = connec.createStatement()
		val result: ResultSet = stmt.executeQuery("SELECT nextval('userids');")
		result.next()
		val nextId: Int = result.getInt(1)
		val stmt2: Statement = connec.createStatement()
		val result2: Int = stmt.executeUpdate("INSERT INTO Users values ('" + intToId(nextId) + "', '" + nickName + "')")
		if (result2 != 1) {
			throw new DataBaseException("Database error while trying to create a new user. Error information: " + result2)
		} else {
			new User(intToId(nextId), nickName)
		}
	}

	/**
	 * Creates a new user in the database
	 * @param nickName the user's nickname
	 * @return the user object
	 * @throws a database exception
	 */
	def createSimpleUser(nickName: String): User = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val user: User = createUser(nickName)
			connec.commit()
			user //new User(user.userId, nickName)
		} catch {
			case ex: DataBaseException => {
				connec.rollback()
				throw ex
			}
		}
	}

	/**
	 * Creates a new registered user in the database
	 * @param nickName the user's nickname
	 * @param eMail the user's e-mail
	 * @param password the user's password
	 * @return the user object
	 * @throws DataBaseException if something wrong happens while connecting to the database
	 * @throws ExistingUserException if a user with the same e-mail address already exists
	 */
	@throws(classOf[ExistingUserException])
	def createRegisteredUser(nickName: String, eMail: String, password: String): RegisteredUser = {
		val connec: java.sql.Connection = Connection.getConnection()
		val stmt: Statement = connec.createStatement()
		val result2: ResultSet = stmt.executeQuery("SELECT userId FROM RegisteredUsers WHERE eMail = '" + encode(eMail) + "' ;")
		if (result2.next()) throw new ExistingUserException()
		try {
			val user: User = createUser(nickName)
			val result: Int = stmt.executeUpdate("INSERT INTO RegisteredUsers values ('" + user.userId + "', '" + encode(eMail) + "', '" + hash(password) + "')")
			if (result != 1) {
				throw new DataBaseException("Database error while trying to create a new registered user. Error information: " + result)
			}
			connec.commit()
			new RegisteredUser(user.userId, nickName, eMail)
		} catch {
			case ex: DataBaseException => {
				connec.rollback()
				throw ex
			}
		}
	}

	/**
	 * Creates a new invited user in the database
	 * @param nickName the user's nickname
	 * @param eMail the user's e-mail
	 * @param pollId the identifier of the poll to which the user is invited to participate
	 * @param certificateSize the size of the certificate to generate
	 * @return the user object
	 * @throws DataBaseException if something wrong happens while connecting to the database
	 * @throws ExistingUserException if a user with the same e-mail address already exists
	 */
	@throws(classOf[ExistingUserException])
	def createInvitedUser(nickName: String, eMail: String, pollId: String, certificateSize: Int): InvitedUser = {
		val connec: java.sql.Connection = Connection.getConnection()
		val stmt: Statement = connec.createStatement()
		val result2: ResultSet = stmt.executeQuery("SELECT userId FROM InvitedUsers WHERE eMail = '" + encode(eMail) + "' AND pollId = '" + pollId + "' ;")
		if (result2.next()) throw new ExistingUserException()
		try {
			val user: User = createUser(nickName)
			val certificate: String = generateRandomString(certificateSize)
			val result: Int = stmt.executeUpdate("INSERT INTO InvitedUsers values ('" + user.userId + "', '" + encode(eMail) + "', '" + encode(certificate) + "', '" + pollId + "')")
			if (result != 1) {
				throw new DataBaseException("Database error while trying to create a new registered user. Error information: " + result)
			}
			connec.commit()
			new InvitedUser(user.userId, nickName, eMail, certificate)
		} catch {
			case ex: DataBaseException => {
				connec.rollback()
				throw ex
			}
		}
	}

	/**
	 * Tries to log in as an invited user
	 * @param certificate the user's certificate
	 * @param pollId the poll identifier
	 * @return the user object
	 * @throws DataBaseException if something wrong happens while connecting to the database
	 * @throws UnknownUserException if the pair (email, password) does not exist in the database
	 */
	@throws(classOf[UnknownUserException])
	def getInvitedUser(certificate: String, pollId: String): InvitedUser = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT userId, eMail FROM InvitedUsers WHERE certificate = '" + encode(certificate) + "' AND pollId = '" + pollId + "' ;")
			if (result.next()) {
				val userId: String = result.getString(1)
				val eMail: String = result.getString(2)
				val result2: ResultSet = stmt.executeQuery("SELECT nickName FROM Users WHERE userId = '" + userId + "' ;")
				result2.next()
				val nickName: String = result2.getString(1)
				new InvitedUser(userId, nickName, eMail, certificate)
			} else {
				throw new UnknownUserException("Unknown certificate for poll id " + pollId)
			}
		} finally {
			connec.commit()
		}
	}

	/**
	 * Tries to delete an invited user
	 * @param userId the user identifier
	 * @param pollId the poll identifier
	 * @return the user object
	 * @throws DataBaseException if something wrong happens while connecting to the database
	 * @throws UnknownUserException if the pair (email, password) does not exist in the database
	 */
	@throws(classOf[UnknownUserException])
	def deleteInvitedUser(userId: String, pollId: String): Unit = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT * FROM Votes WHERE userId = '" + userId + "';")
			if (result.next()) {
				throw new UserDeletionException("Cannot delete an invited user who has already voted...");
			}
			val result2: Int = stmt.executeUpdate("DELETE FROM Users WHERE userId = '" + userId + "' ;")
			connec.commit()
			result.close()
			stmt.close()
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	def hasAlreadyVoted(userId: String, pollId: String): Boolean = {
    val connec: java.sql.Connection = Connection.getConnection()
    try {
      val stmt: Statement = connec.createStatement()
      val result: ResultSet = stmt.executeQuery("SELECT * FROM Votes WHERE pollId = '" + pollId + "' AND userId = '" + userId + "';")
      val hasVoted: Boolean = result.next()
      connec.commit()
      result.close()
      stmt.close()
      hasVoted
    } catch {
      case ex: Exception => {
        connec.rollback()
        throw ex
      }
    }
	}
	
	/**
	 * Tries to log in as a registered user
	 * @param eMail the user's e-mail
	 * @param password the user's password
	 * @return the user object
	 * @throws DataBaseException if something wrong happens while connecting to the database
	 * @throws UnknownUserException if the pair (email, password) does not exist in the database
	 */
	@throws(classOf[UnknownUserException])
	def getRegisteredUser(eMail: String, password: String): RegisteredUser = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT userId FROM RegisteredUsers WHERE eMail = '" + encode(eMail) + "' AND password = '" + hash(password) + "' ;")
			if (result.next()) {
				val userId: String = result.getString(1)
				val result2: ResultSet = stmt.executeQuery("SELECT nickName FROM Users WHERE userId = '" + userId + "' ;")
				result2.next()
				val nickName: String = result2.getString(1)
				new RegisteredUser(userId, nickName, eMail)
			} else {
				throw new UnknownUserException("Unknown (e-mail, password) pair")
			}
		} finally {
			connec.commit()
		}
	}

	@throws(classOf[DataBaseException])
	@throws(classOf[UnknownUserException])
	def getUserById(userId: String): User = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT * FROM Users WHERE userId = '" + userId + "';")
			if (!result.next()) {
				throw new UnknownUserException("Unknown user id: " + userId)
			}
			val user: User = new User(result.getString(1), result.getString(2))
			connec.commit()
			user
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}
}
