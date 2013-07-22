package whale3.vote

import scala.collection.mutable.Set
import scala.collection.mutable.Map
import java.util.Date

class Poll(val pollId: String, val pollTitle: String, val pollDescription: String, val creationDate: Date, val closingDate: Date, val preferenceModel: PreferenceModel, val owner: User, val candidates: List[Candidate], val votes: List[Vote], val attributes: Map[String, String]) {
  val invitedUsers: Set[InvitedUser] = Set()
  def candidateLabels: List[String] = candidates map (c => c.candidateLabel)
  def isClosed: Boolean = (closingDate.compareTo(new java.util.Date()) <= 0)
    def isOwnedBy(user: User): Boolean = user.equals(owner)
}
