package whale3.vote

import scala.collection.mutable.Set
import scala.collection.mutable.Map
import java.util.Date
import scala.beans.BeanProperty

class Poll(@BeanProperty val pollId: String, @BeanProperty val pollTitle: String, @BeanProperty val pollDescription: String, @BeanProperty val creationDate: Date, @BeanProperty val closingDate: Date, val preferenceModel: PreferenceModel, val owner: User, val candidates: List[Candidate], val votes: List[Vote], val attributes: Map[String, String]) {
  val invitedUsers: Set[InvitedUser] = Set()
  def candidateLabels: List[String] = candidates map (c => c.candidateLabel)
  def isClosed: Boolean = (closingDate.compareTo(new java.util.Date()) <= 0)
  def isOwnedBy(user: User): Boolean = user.equals(owner)
  def invitationRequired: Boolean = (attributes.get("participationAllowed#anonymous"), attributes.get("participationAllowed#registered")) match {
      case (Some("no"), Some("no")) => true
      case _ => false
  }
  def anonymize: Boolean = attributes.get("anonymize") match {
  	case Some("all") => true
  	case _ => false
  }
}
