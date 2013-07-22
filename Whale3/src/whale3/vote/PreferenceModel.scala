package whale3.vote

import scala.collection.mutable.Map

sealed abstract class PreferenceModel {
  protected var texts: List[String] = Nil
  protected var values: List[Int] = Nil
  // Precomputed (don't forget to initialize these values) for efficiency
  protected var minVal: Int = 0
  protected var maxVal: Int = 0
  protected var nbVal: Int = 0
  //

  def optionValue(text: String): Option[Int] = auxValue[String, Int](text, texts, values)
  def optionText(value: Int): Option[String] = auxValue[Int, String](value, values, texts)
  def value(text: String): Int = optionValue(text) match {case Some(s) => s; case None => throw new Exception("Unmatched preference label:" + text);}
  def auxValue[T, U](key: T, keys: List[T], values: List[U]): Option[U] = (keys, values) match {
    case (Nil, _) => None
    case (_, Nil) => None
    case (hk :: tk, hv :: tv) if hk == key => Some(hv)
    case (hk :: tk, hv :: tv) => auxValue(key, tk, tv)
  }
  def textualValues(): List[String] = texts
  def numericalValues(): List[Int] = values
  def minValue(): Int = minVal
  def maxValue(): Int = maxVal
  def nbValues(): Int = nbVal

  def defaultNumericalValue(): Int = 0
  def defaultTextualValue(): String = optionText(defaultNumericalValue()) match {case Some(s) => s; case None => ""}
}

case class PositiveNegativePreferenceModel() extends PreferenceModel {
  texts :::= List("--", "-", "0", "+", "++")
  values :::= List(-2, -1, 0, 1, 2)
  minVal = -2
  maxVal = 2
  nbVal = 5
}

case class RankingPreferenceModel(val nbCandidates: Int, val tiesAllowed: Boolean) extends PreferenceModel {
  for (i <- 1 to nbCandidates) {
    texts ::= (i toString)
    values ::= (nbCandidates - i)
  }
  minVal = 0
  maxVal = nbCandidates - 1
  nbVal = nbCandidates
}

case class NumbersPreferenceModel(val min: Int, val max: Int) extends PreferenceModel {
  for (i <- min to max) {
    texts ::= ((max - i) toString)
    values ::= (max - i)
  }
  minVal = 0
  maxVal = max - min
  nbVal = max - min + 1
}

case class ApprovalPreferenceModel() extends PreferenceModel {
  texts :::= List("no", "yes")
  values :::= List(0, 1)
  minVal = 0
  maxVal = 1
  nbVal = 2
}

object PreferenceModel {
  def apply(model: PreferenceModel): String = {
    model match {
      case PositiveNegativePreferenceModel() => "positiveNegative"
      case RankingPreferenceModel(nbCand, tiesAllowed) => "ranks#" + nbCand + "#" + (if (tiesAllowed) 1 else 0)
      case NumbersPreferenceModel(min, max) => "numbers#" + min + "#" + max
      case ApprovalPreferenceModel() => "approval"
    }
  }

  def unapply(desc: String): Option[PreferenceModel] = {
    val parts: List[String] = (desc split "#" toList)
    parts match {
      case "positiveNegative"::_  => Some(PositiveNegativePreferenceModel())
      case "ranks"::nbCand::ties::_ => Some(RankingPreferenceModel(nbCand.toInt, if(ties == "1") true else false))
      case "numbers"::min::max::_ => Some(NumbersPreferenceModel(min.toInt, max.toInt))
      case "approval"::_ => Some(ApprovalPreferenceModel())
      case _ => None
    }
  }
}
