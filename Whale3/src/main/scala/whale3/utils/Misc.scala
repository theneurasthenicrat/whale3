package whale3.utils

import whale3.vote._
import scala.collection.JavaConversions._
import scala.collection.mutable.ListBuffer

object Misc { 
  def scalaListToJavaList[T](aList: List[T]): java.util.List[T] = ListBuffer(aList: _*)

  // For conversion from Scala types to Java types
  // Ugly, but working for now 
  def scalaListToJavaListCandidate(aList:List[Candidate]) = java.util.Arrays.asList(aList.toArray: _*)
  def scalaListToJavaListVote(aList:List[Vote]) = java.util.Arrays.asList(aList.toArray: _*)
  def scalaListToJavaListString(aList:List[String]) = java.util.Arrays.asList(aList.toArray: _*)
  def scalaListToJavaListInt(aList:List[Int]) = java.util.Arrays.asList(aList.toArray: _*)
  def scalaListToJavaListInvitedUser(aList:List[InvitedUser]) = java.util.Arrays.asList(aList.toArray: _*)

  def scalaSetToJavaSet[T](aSet: Set[T]): java.util.Set[T] = setAsJavaSet(aSet)

}
