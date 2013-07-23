package whale3.vote

import scala.collection.mutable.Set
import scala.collection.mutable.Map
import java.util.Date
import scala.beans.BeanProperty

class DatePoll(@BeanProperty override val pollId: String, @BeanProperty override val pollTitle: String, @BeanProperty override val pollDescription: String, @BeanProperty override val creationDate: Date, @BeanProperty override val closingDate: Date, override val preferenceModel: PreferenceModel, override val owner: User, override val candidates: List[TimeSlot], override val votes: List[Vote], override val attributes: Map[String, String]) extends Poll(pollId, pollTitle, pollDescription, creationDate, closingDate, preferenceModel, owner, candidates, votes, attributes) {
}
