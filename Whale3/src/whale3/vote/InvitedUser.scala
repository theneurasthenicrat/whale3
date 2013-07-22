package whale3.vote

import whale3.utils.Maths._

class InvitedUser(override val userId: String, override val nickName: String, val eMail: String, val certificate: String) extends User(userId, nickName) {}
