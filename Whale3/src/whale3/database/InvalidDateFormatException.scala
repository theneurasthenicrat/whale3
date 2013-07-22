package whale3.database

class InvalidDateFormatException(val dateS: String) extends Exception("Invalid date format: " + dateS) {}
