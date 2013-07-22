package whale3.utils

import java.util.Date
import java.text.SimpleDateFormat
import java.text.ParseException

object Dates {
  @throws(classOf[ParseException])
  def stringToDate(sDate: String, sFormat: String): Date = {
    val sdf: SimpleDateFormat = new SimpleDateFormat(sFormat)
    sdf.parse(sDate)
  }

  @throws(classOf[ParseException])
  def stringToDate(sDate: String): Date = stringToDate(sDate, "yyyy-MM-dd hh:mm:ss")

  def dateToString(date: Date, sFormat: String): String = (new SimpleDateFormat(sFormat)).format(date)

  def dateToString(date: Date): String = dateToString(date, "yyyy-MM-dd hh:mm:ss")
}
