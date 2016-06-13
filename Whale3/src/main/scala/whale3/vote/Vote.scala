package whale3.vote

class Vote(val voteNumber: Int, val user: User, val values: List[String]) {
  def this(voteNumber: Int, user: User, value: String) = this(voteNumber, user, (value split "#" toList))
}

