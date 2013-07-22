package whale3.database

class UnknownPollException(val pollId: String) extends Exception("Unknown poll exception: " + pollId) {}
