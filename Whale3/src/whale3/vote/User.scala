package whale3.vote
import scala.reflect.BeanProperty

class User(@BeanProperty val userId: String, @BeanProperty val nickName: String) {
  def userName: String = nickName;
  override def equals(user: Any): Boolean = return (user.isInstanceOf[User] && user.asInstanceOf[User].userId == userId)
}
