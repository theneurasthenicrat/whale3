package whale3.database

import whale3.vote._
import whale3.utils.Crypto._
import whale3.utils.Maths._
import java.sql.ResultSet
import java.sql.SQLException
import java.sql.Statement
import java.sql.PreparedStatement
import java.util.Date
import scala.collection.mutable.Map

object Polls {
	@throws(classOf[DataBaseException])
	private def createCandidates(pollId: String, candidateLabels: List[String]): List[Candidate] = {
		val connec: java.sql.Connection = Connection.getConnection()
		var stmt: PreparedStatement = null
		try {
			stmt = connec.prepareStatement("INSERT INTO Candidates values (?, ?, ?)")
			var result: Int = 0
			var i: Int = 0
			candidateLabels map (c => {
				stmt.setString(1, pollId)
				stmt.setInt(2, i)
				stmt.setString(3, c)
				result = stmt.executeUpdate()
				if (result != 1) {
					throw new DataBaseException("Database error while trying to create a new poll. Error information: candidate #" + i + " -> " + result)
				}
				i += 1
				new Candidate(i, c)
			})
		} catch {
			case e: Exception => throw e
		} finally {
			if (stmt != null) stmt.close()
		}
	}

	@throws(classOf[DataBaseException])
	@throws(classOf[InvalidDateFormatException])
	private def createTimeSlotCandidates(pollId: String, candidateLabels: List[String]): List[TimeSlot] = {
		val connec: java.sql.Connection = Connection.getConnection()
		var stmt: PreparedStatement = null
		var stmt2: PreparedStatement = null
		var result: Int = 0
		var result2: Int = 0
		var i: Int = 0
		try {
			//      stmt = connec.prepareStatement("INSERT INTO Candidates values (?, ?, ?)")
			stmt2 = connec.prepareStatement("INSERT INTO Dates values (?, ?, ?, ?)")
			var j: Int = 0
			candidateLabels map (c => {
				var ts: TimeSlot = null
				TimeSlot.unapply(c) match {
					case Some((date: java.util.Date, nb: Int, label: String)) => {
						/*	    stmt.setString(1, pollId)
	    stmt.setInt(2, i)
	    stmt.setString(3, c)	
	    result = stmt.executeUpdate()*/
						stmt2.setString(1, pollId)
						stmt2.setDate(2, new java.sql.Date(date.getTime()))
						stmt2.setInt(3, nb)
						stmt2.setString(4, label)
						result2 = stmt2.executeUpdate()
						if (result2 != 1) {
							//	      throw new DataBaseException("Database error while trying to create a new poll. Error information: candidate #" + nb + " -> " + result2)
						}
						ts = new TimeSlot(date, j, label, nb)
						j += 1
					}
					case None => throw new InvalidDateFormatException(c)
				}
				i += 1
				ts
			})
		} catch {
			case e: Exception => throw e
		} finally {
			if (stmt != null) stmt.close()
			if (stmt2 != null) stmt2.close()
		}
	}

	@throws(classOf[DataBaseException])
	private def insertAttributes(pollId: String, attributes: Map[String, String]): Unit = {
		val connec: java.sql.Connection = Connection.getConnection()
		var stmt: PreparedStatement = null
		try {
			stmt = connec.prepareStatement("INSERT INTO PollAttributes values (?, ?, ?)")
			var result: Int = 0
			var i: Int = 0
			for (p <- attributes) {
				stmt.setString(1, pollId)
				stmt.setString(2, p._1)
				stmt.setString(3, p._2)
				result = stmt.executeUpdate()
				if (result != 1) {
					throw new DataBaseException("Database error while trying to create a new poll. Error information: candidate #" + i + " -> " + result)
				}
				i += 1
			}
		} catch {
			case e: Exception => throw e
		} finally {
			if (stmt != null) stmt.close()
		}
	}

	@throws(classOf[DataBaseException])
	private def insertPreferenceModel(preferenceModelId: String): Unit = {
		val connec: java.sql.Connection = Connection.getConnection()
		var stmt: Statement = null
		var stmt2: PreparedStatement = null
		var result: ResultSet = null
		try {
			stmt = connec.createStatement()
			result = stmt.executeQuery("SELECT * FROM PreferenceModels WHERE preferencemodelid = '" + preferenceModelId + "';")
			if (!result.next) {
				stmt2 = connec.prepareStatement("INSERT INTO PreferenceModels VALUES (?);")
				stmt2.setString(1, preferenceModelId)
				val result2: Int = stmt2.executeUpdate()
				if (result2 != 1) {
					throw new DataBaseException("Database error while trying to create a new preference model. Error information: preference model: " + preferenceModelId + " -> " + result2)
				}
			}
		} catch {
			case e: Exception => throw e
		} finally {
			if (stmt != null) stmt.close()
			if (stmt2 != null) stmt2.close()
			if (result != null) result.close()
		}
	}

	@throws(classOf[DataBaseException])
	private def createPoll(pollTitle: String, pollDescription: String, creationDate: Date, closingDate: Date, pollType: Int, preferenceModelId: String, owner: User, candidateLabels: List[String], attributes: Map[String, String]): Poll = {
		val preferenceModel: PreferenceModel = PreferenceModel.unapply(preferenceModelId) match {
			case Some(p) => p
			case None => throw new InvalidPreferenceModelException(preferenceModelId)
		}
		insertPreferenceModel(preferenceModelId)
		var stmt: Statement = null
		var stmt2: PreparedStatement = null
		var result: ResultSet = null
		try {
			val connec: java.sql.Connection = Connection.getConnection()
			stmt = connec.createStatement()
			result = stmt.executeQuery("SELECT nextval('pollids');")
			result.next()
			val nextId: Int = result.getInt(1)
			stmt2 = connec.prepareStatement("INSERT INTO Polls values (?, ?, ?, ?, ?, ?, ?, ?)")
			stmt2.setString(1, intToId(nextId))
			stmt2.setString(2, pollTitle)
			stmt2.setString(3, pollDescription)
			stmt2.setTimestamp(4, new java.sql.Timestamp(creationDate.getTime()))
			stmt2.setTimestamp(5, new java.sql.Timestamp(closingDate.getTime()))
			stmt2.setInt(6, pollType)
			stmt2.setString(7, preferenceModelId)
			stmt2.setString(8, owner.userId)
			val result2: Int = stmt2.executeUpdate()
			if (result2 != 1) {
				throw new DataBaseException("Database error while trying to create a new poll. Error information: " + result2)
			} else {
				insertAttributes(intToId(nextId), attributes)
				if (pollType == 0) {
					val candidates: List[Candidate] = createCandidates(intToId(nextId), candidateLabels)
					new Poll(intToId(nextId), pollTitle, pollDescription, creationDate, closingDate, preferenceModel, owner, candidates, Nil, attributes)
				} else {
					val candidates: List[TimeSlot] = createTimeSlotCandidates(intToId(nextId), candidateLabels)
					new DatePoll(intToId(nextId), pollTitle, pollDescription, creationDate, closingDate, preferenceModel, owner, candidates, Nil, attributes)
				}
			}
		} catch {
			case e: Exception => throw e
		} finally {
			if (stmt != null) stmt.close()
			if (stmt2 != null) stmt2.close()
			if (result != null) result.close()
		}
	}

	/**
	 * Creates a new poll in the database
	 * @param pollTitle the poll's title
	 * @param pollDescription the poll's description
	 * @param creationDate the time the poll was created
	 * @param closingDate the time the poll was (or is expected to) close
	 * @param pollType the poll type (so far, classic or date)
	 * @param preferenceModelId the preference model
	 * @param owner the creator of the poll
	 * @param candidateLabels the set of candidates (as a set of labels)
	 * @param attributes the set of attributes
	 * @return the poll object
	 * @throws DataBaseException a database exception: something wrong happened during interaction with the database
	 */
	@throws(classOf[DataBaseException])
	def createClassicPoll(pollTitle: String, pollDescription: String, creationDate: Date, closingDate: Date, pollType: Int, preferenceModelId: String, owner: User, candidateLabels: List[String], attributes: Map[String, String]): Poll = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val poll: Poll = createPoll(pollTitle, pollDescription, creationDate, closingDate, pollType, preferenceModelId, owner, candidateLabels, attributes)
			connec.commit()
			poll
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	@throws(classOf[InvalidPreferenceModelException])
	@throws(classOf[UnknownPollException])
	def getPollById(pollId: String): Poll = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT * FROM polls WHERE pollId = '" + pollId + "';")
			if (!result.next()) {
				throw new UnknownPollException(pollId)
			}
			val preferenceModel: PreferenceModel = PreferenceModel.unapply(result.getString(7)) match {
				case Some(p) => p
				case None => throw new InvalidPreferenceModelException(result.getString(7))
			}
			val owner: User = Users.getUserById(result.getString(8))
			val pollType: Int = result.getInt(6)
			val candidates: List[Candidate] = getCandidatesByPollId(pollId, pollType)
			val votes: List[Vote] = getVotesByPollId(pollId)
			val attributes: Map[String, String] = getAttributesByPollId(pollId)

			var poll: Poll = null
			pollType match {
				case 0 => poll = new Poll(result.getString(1), result.getString(2), result.getString(3), new java.util.Date(result.getTimestamp(4).getTime()), new java.util.Date(result.getTimestamp(5).getTime()), preferenceModel, owner, candidates, votes, attributes)
				case 1 => poll = new DatePoll(result.getString(1), result.getString(2), result.getString(3), new java.util.Date(result.getTimestamp(4).getTime()), new java.util.Date(result.getTimestamp(5).getTime()), preferenceModel, owner, candidates.asInstanceOf[List[TimeSlot]], votes, attributes)
				case _ => throw new Exception("Unknown poll type: " + pollType)
			}
			connec.commit()
			stmt.close()
			poll
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	def getCandidatesByPollId(pollId: String, pollType: Int): List[Candidate] = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			var candidates: List[Candidate] = Nil
			pollType match {
				case 0 => {
					val result: ResultSet = stmt.executeQuery("SELECT candidateNumber, candidateLabel FROM candidates WHERE pollId = '" + pollId + "' ORDER BY candidateNumber DESC;")
					while (result.next()) {
						candidates ::= new Candidate(result.getInt(1), result.getString(2))
					}
					result.close()
				}
				case 1 => {
					val result: ResultSet = stmt.executeQuery("SELECT candidateDay, candidateNumber, timeslotLabel FROM dates WHERE pollId = '" + pollId + "' ORDER BY (candidateDay, candidateNumber) ASC;")
					var k: Int = 0
					while (result.next()) {
						candidates ::= new TimeSlot(result.getDate(1), k, result.getString(3), result.getInt(2))
						k += 1
					}
					result.close()
					candidates = candidates.reverse
				}
				case _ => throw new Exception("Unkown poll type: " + pollType)
			}
			connec.commit()
			stmt.close()
			candidates
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	def getVotesByPollId(pollId: String): List[Vote] = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT voteNumber, userId, val FROM votes WHERE pollId = '" + pollId + "' ORDER BY voteNumber DESC;")
			var votes: List[Vote] = Nil
			while (result.next()) {
				votes ::= new Vote(result.getInt(1), Users.getUserById(result.getString(2)), result.getString(3))
			}
			connec.commit()
			result.close()
			stmt.close()
			votes
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	def getAttributesByPollId(pollId: String): Map[String, String] = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT * from PollAttributes WHERE pollId = '" + pollId + "';")
			var attributes: Map[String, String] = Map[String, String]()
			while (result.next()) {
				attributes += (result.getString(2) -> result.getString(3))
			}
			connec.commit()
			result.close()
			stmt.close()
			attributes
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	def getVoteByPollIdAndUserId(pollId: String, userId: String): Vote = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT voteNumber, userId, val FROM votes WHERE pollId = '" + pollId + "' AND userId = '" + userId + "';")
			var vote: Vote = null
			if (result.next()) {
				vote = new Vote(result.getInt(1), Users.getUserById(result.getString(2)), result.getString(3))
			}
			connec.commit()
			result.close()
			stmt.close()
			vote
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	@throws(classOf[UnknownPollException])
	def addNewVote(pollId: String, userId: String, value: String, creationDate: Date): Unit = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT COUNT((pollId, userId)) FROM votes WHERE pollId = '" + pollId + "';")
			if (!result.next()) {
				throw new UnknownPollException(pollId)
			}
			val voteNumber: Int = result.getInt(1)
			val stmt2: Statement = connec.createStatement()
			val result2: Int = stmt2.executeUpdate("INSERT INTO Votes VALUES ('" + pollId + "', '" + voteNumber + "', '" + userId + "', '" + value + "', '" + new java.sql.Timestamp(creationDate.getTime()) + "');")
			if (result2 != 1) {
				throw new DataBaseException("Database error while trying to add new vote. Error information: (none available)")
			}
			connec.commit()
			stmt.close()
			stmt2.close()
			result.close()
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	/**
	 * @returns 1 if new vote, 0 if vote updated
	 */
	@throws(classOf[DataBaseException])
	@throws(classOf[UnknownPollException])
	def newOrUpdateVote(pollId: String, userId: String, value: String, creationDate: Date): Int = {
		val connec: java.sql.Connection = Connection.getConnection()
		var stmt: PreparedStatement = null
		try {
			if (getVoteByPollIdAndUserId(pollId, userId) == null) {
				addNewVote(pollId, userId, value, creationDate)
				1
			} else {
				stmt = connec.prepareStatement("UPDATE votes SET val = ?, lastModification = ? WHERE pollId = ? AND userId = ?;")
				stmt.setString(1, value)
				stmt.setTimestamp(2, new java.sql.Timestamp(creationDate.getTime()))
				stmt.setString(3, pollId)
				stmt.setString(4, userId)
				val result: Int = stmt.executeUpdate()
				if (result == 0) {
					throw new DataBaseException("Database error while trying to update vote. Error information: (none available)")
				}
				connec.commit()
				0
			}
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		} finally {
			if (stmt != null) stmt.close()
		}
	}

	@throws(classOf[DataBaseException])
	def setClosingDate(pollId: String, closingDate: Date): Unit = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: Int = stmt.executeUpdate("UPDATE polls SET closingDate = '" + new java.sql.Timestamp(closingDate.getTime()) + "' WHERE pollId = '" + pollId + "';")
			if (result == 0) {
				throw new DataBaseException("Database error while trying to update vote. Error information: (none available)")
			}
			connec.commit()
			stmt.close()
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	def getInvitedUsersByPollId(pollId: String): List[InvitedUser] = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT i.userId, nickName, eMail, certificate FROM InvitedUsers i NATURAL JOIN Users u WHERE pollId = '" + pollId + "';")
			var users: List[InvitedUser] = Nil
			while (result.next()) {
				users ::= new InvitedUser(result.getString(1), result.getString(2), decode(result.getString(3)), decode(result.getString(4)))
			}
			connec.commit()
			stmt.close()
			result.close()
			users
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	@throws(classOf[DataBaseException])
	def isInvited(pollId: String, certificate: String): Boolean = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT * FROM InvitedUsers WHERE pollId = '" + pollId + "' AND certificate = '" + encode(certificate) + "';")
			connec.commit()
			val hasNext: Boolean = result.next()
			result.close()
      stmt.close()
			hasNext
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}

	/**
	 * @param userId The user ID
	 * @return a pair containing the list of owned polls and the list of polls in which the user is participating.
	 * <strong>Warning:</strong> these poll instances are incomplete, in the sense that just some of their fields
	 * are filled-in with non null values (namely, id, title, description, creation date, closing date).
	 * @throws whale3.database.DataBaseException
	 */
	@throws(classOf[DataBaseException])
	def getPollSummariesByUserId(userId: String): (List[Poll], List[Poll]) = {
		val connec: java.sql.Connection = Connection.getConnection()
		try {
			val stmt: Statement = connec.createStatement()
			val result: ResultSet = stmt.executeQuery("SELECT pollId, pollTitle, pollDescription, creationDate, closingDate, pollType FROM polls WHERE owner = '" + userId + "';")
			var pollsOwned: List[Poll] = Nil
			while (result.next()) {
				pollsOwned ::= (result.getInt(6) match {
					case 0 => new Poll(result.getString(1), result.getString(2), result.getString(3), result.getDate(4), result.getDate(5), null, null, null, null, null)
					case 1 => new Poll(result.getString(1), result.getString(2), result.getString(3), result.getDate(4), result.getDate(5), null, null, null, null, null)
					case _ => throw new Exception("Unknown poll type: " + result.getInt(6))
				})
			}
			val stmt2: Statement = connec.createStatement()
			val result2: ResultSet = stmt.executeQuery("SELECT p.pollId, p.pollTitle, p.pollDescription, p.creationDate, p.closingDate, p.pollType FROM polls p, votes v WHERE p.pollId = v.pollId AND v.userId = '" + userId + "';")
			var pollsParticipated: List[Poll] = Nil
			while (result2.next()) {
				pollsParticipated ::= (result2.getInt(6) match {
					case 0 => new Poll(result2.getString(1), result2.getString(2), result2.getString(3), result2.getDate(4), result2.getDate(5), null, null, null, null, null)
					case 1 => new Poll(result2.getString(1), result2.getString(2), result2.getString(3), result2.getDate(4), result2.getDate(5), null, null, null, null, null)
					case _ => throw new Exception("Unknown poll type: " + result2.getInt(6))
				})
			}
			connec.commit()
			stmt.close()
			stmt2.close()
			result.close()
			result2.close()
			(pollsOwned, pollsParticipated)
		} catch {
			case ex: Exception => {
				connec.rollback()
				throw ex
			}
		}
	}
}
