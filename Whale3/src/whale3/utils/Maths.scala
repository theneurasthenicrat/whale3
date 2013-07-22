package whale3.utils

object Maths {
  val rand = scala.util.Random
  val defaultSymbols: Array[Char] = ((('a' to 'z') toList) ::: (('0' to '9') toList)) toArray

  def idToInt(id: String): Int = auxIdToInt(id, 0)

  private def auxIdToInt(id: String, n: Int): Int = {
    if ((id trim) == "") n else auxIdToInt(id tail, (n << 5) + (charToInt(id head)))
  }

  def intToId(id: Int): String = if (id == 0) "0" else auxIntToId(id)

  private def auxIntToId(id: Int): String = {
    if (id == 0) "" else {
      auxIntToId(id >> 5) + intToChar(id & 31)
    }
  }

  private def charToInt(c: Char): Int = {
    if (('0' to '9') contains c) ((c toInt) - 48) else ((c toInt) - 87)
  }

  private def intToChar(i: Int): Char = {
    if (i < 10) ((i + 48) toChar) else (i + 87) toChar
  }

  def generateRandomString(n: Int): String = generateRandomString(n, defaultSymbols)

  def generateRandomString(n: Int, symbols: Array[Char]): String = {
    if (n == 0) "" else symbols(rand.nextInt(symbols.length)) + generateRandomString(n - 1, symbols)
  }

  def roundTo(n: Double, k: Int): Int = {
    (scala.math.round(n / k)) * k toInt
  }

}
