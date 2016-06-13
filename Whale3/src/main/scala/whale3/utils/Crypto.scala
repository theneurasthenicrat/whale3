package whale3.utils

import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import org.apache.commons.codec.binary.Base64
import Defaults._

object Crypto {
	val key: String = new javax.naming.InitialContext().lookup("java:comp/env/encryptionKey").asInstanceOf[String]

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
			if (hex.length() == 1) {
				hashString.append('0')
				hashString.append(hex.charAt(hex.length() - 1))
			} else
				hashString.append(hex.substring(hex.length() - 2))
		}
		hashString.toString()
	}

	def encode(str: String): String = {
		new String(Base64.encodeBase64(AES.encrypt(str, key))) //DES.encrypt(str, "0123456789012345")
	}

	def decode(str: String): String = {
		new String(AES.decrypt(Base64.decodeBase64(str), key))
	}
}




/*object Main extends App {

  import org.apache.commons.codec.binary.Base64

  import crypto._
  import protocol.defaults._

  def encodeBase64(bytes: Array[Byte]) = Base64.encodeBase64String(bytes)

  println(encodeBase64(DES.encrypt("hoge", "01234567")))
  //=> vyudTtnBJfs=

  println(encodeBase64(AES.encrypt("hoge", "0123456789012345")))
  //=> QWSouZUMVYMfS86xFyBgtQ==

  println(encodeBase64(DES.encrypt(123L, "01234567")))
  //=> Cqw2ipxTtvIIu122s3wG1w==

  println(encodeBase64(DES.encrypt(123, "01234567")))
  //=> BV+LSCSYmUU=
}

}*/
