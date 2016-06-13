package whale3.vote

import java.util.Date

/**
 * A class representing time slot candidates
 * @param day the day of the time slot
 * @param candidatePosition the global candidate position in the poll (not used by the database currently)
 * @param timeSlotLabel the time slot label
 * @param nb the candidate position within the time slot
 */
class TimeSlot(val day: Date, override val candidatePosition: Int, val timeSlotLabel: String, val nb: Int) extends Candidate(candidatePosition, TimeSlot.apply(day, nb, timeSlotLabel)) {}

object TimeSlot {
  def apply(day: Date, nb: Int, timeSlotLabel: String): String = {
    whale3.utils.Dates.dateToString(day) + "#" + nb + "#" + timeSlotLabel
  }
  
  def unapply(label: String): Option[(Date, Int, String)] = {
    val parts: List[String] = (label split "#" toList)
    try {
      parts match {
	case date::nb::label::Nil => Some((whale3.utils.Dates.stringToDate(date + " 00:00:00"), nb.toInt, label))
	case _ => None
      }
    } catch {
      case e: java.text.ParseException => None
    }
  }
}
