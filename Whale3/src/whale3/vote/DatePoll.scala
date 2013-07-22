package whale3.vote

import scala.collection.mutable.Set
import scala.collection.mutable.Map
import java.util.Date

class DatePoll(override val pollId: String, override val pollTitle: String, override val pollDescription: String, override val creationDate: Date, override val closingDate: Date, override val preferenceModel: PreferenceModel, override val owner: User, override val candidates: List[TimeSlot], override val votes: List[Vote], override val attributes: Map[String, String]) extends Poll(pollId, pollTitle, pollDescription, creationDate, closingDate, preferenceModel, owner, candidates, votes, attributes) {
}
