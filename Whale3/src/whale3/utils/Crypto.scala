package whale3.utils

import java.security.MessageDigest
import java.security.NoSuchAlgorithmException

object Crypto {
  def hash(str: String): String = {
    val source: Array[Byte] = str.getBytes()
    var target: Array[Byte] = null
    
    try {
      target = MessageDigest.getInstance("MD5").digest(source)
    } catch {
      case ex: NoSuchAlgorithmException => throw new Error("No MD5 support in this VM.")
    }
    
    val hashString: StringBuilder = new StringBuilder()
    for (i <- 0 until target.length) {
        val hex: String = Integer.toHexString(target(i))
        if (hex.length() == 1)
          {
            hashString.append('0')
            hashString.append(hex.charAt(hex.length() - 1))
          }
        else
          hashString.append(hex.substring(hex.length() - 2))
      }
    hashString.toString()
  }

  def encode(str: String): String = {
    str
  }

  def decode(str: String): String = {
    str
  }
}
