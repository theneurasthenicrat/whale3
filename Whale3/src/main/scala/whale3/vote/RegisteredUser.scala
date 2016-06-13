package whale3.vote
import scala.beans.BeanProperty

class RegisteredUser(@BeanProperty override val userId: String, @BeanProperty override val nickName: String, @BeanProperty val eMail: String) extends User(userId, nickName) {}
