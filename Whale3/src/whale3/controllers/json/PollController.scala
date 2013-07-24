package whale3.controllers.json

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import java.util.Date
import java.text.SimpleDateFormat

import whale3.vote._
import whale3.database._

@WebServlet(name = "PollController", urlPatterns = Array("/poll.do-json"))
class PollController extends AbstractJSONController {
	override def main(): Unit = {
		val pollId: String = request.getParameter("id")
		if (pollId == null || pollId == "") {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST)
			return ;
		}
		try {
			val poll: Poll = Polls.getPollById(pollId)
			val prefModel: PreferenceModel = poll.preferenceModel
			out.println("{")
			out.println("  \"preferenceModel\": {")
			out.println("    \"id\": \"" + PreferenceModel.apply(prefModel) + "\",")
			out.println("    \"values\": " + prefModel.numericalValues().mkString("[", ", ", "]") + ",")
			out.println("    \"texts\": " + prefModel.textualValues().mkString("[\"", "\", \"", "\"]"))
			out.println("  },")
			out.println("  \"type\": " + (if (poll.isInstanceOf[DatePoll]) 1 else 0) + ",")
			out.println("  \"candidates\": " + poll.candidateLabels.mkString("[\"", "\", \"", "\"]") + ",")
			out.println("  \"votes\": [")
			var displayVotes: Boolean = false;
			(poll.isClosed, poll.attributes.get("votes#open"), poll.attributes.get("votes#closed")) match {
				case (true, _, Some("no")) => out.println("\"" + getMessage("messages.poll", "hiddenVotes", Nil) + "\"")
				case (false, Some("no"), Some("no")) => out.println("\"" + getMessage("messages.poll", "hiddenVotes", Nil) + "\"")
				case (false, Some("no"), Some("yes")) => out.println("\"" + getMessage("messages.poll", "hiddenVotesUntilClosed", Nil) + "\"")
				case _ => displayVotes = true
			}
			if (displayVotes) {
				var flag: Boolean = false
				var i: Int = 0
				for (v <- poll.votes) {
					i += 1
					out.println((if (flag) ",\n" else "") + "    {\n" + "      \"name\": \"" + (if (poll.anonymize) getMessage("messages.poll", "anonymousBallot", (i toString) :: Nil) else v.user.nickName) + "\",")
					flag = true
					out.print("      \"values\": [")
					var flag2: Boolean = false
					for (s <- v.values) {
						out.print((if (flag2) ", " else "") + prefModel.value(s))
						flag2 = true
					}
					out.println("]")
					out.print("    }")
				}
			}
			out.println("\n  ]")
			out.println("}")
		} catch {
			case e: UnknownPollException => response.setStatus(HttpServletResponse.SC_BAD_REQUEST); return ;
		}
	}

}
    
