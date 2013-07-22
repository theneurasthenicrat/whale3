package whale3.controllers.page

import javax.servlet.ServletException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import whale3.database._
import whale3.vote._
import whale3.utils._

import scala.collection.JavaConverters._
import scala.collection.mutable.Map

@WebServlet(name = "NewPollController", urlPatterns = Array("/newPoll.do"))
class NewPollController extends AbstractPageController with ConnectionRequired {
  private var step: Int = NewPollController.FIRST_STEP

  override def main(): Unit = {
    step = if (request.getParameter("step") != null) request.getParameter("step").toInt else NewPollController.FIRST_STEP 
    step match {
      case NewPollController.FIRST_STEP => {session.removeAttribute("poll"); request.getRequestDispatcher("views/newPoll/step1.jsp").include(request, response); return}
      case NewPollController.SECOND_STEP_CLASSIC => {request.getRequestDispatcher("views/newPoll/step21.jsp").include(request, response); return}
      case NewPollController.SECOND_STEP_DATE => {request.getRequestDispatcher("views/newPoll/step22.jsp").include(request, response); return}
      case NewPollController.THIRD_STEP => {request.getRequestDispatcher("views/newPoll/step3.jsp").include(request, response); return}
      case NewPollController.CREATE_POLL => {createPoll(); return}
      case _ => {}
    }
  }

  private def createPoll(): Unit = {
    if (session.getAttribute("poll") != null) { // Means that the poll creation has already been validated (for example the page has been refreshed)
      error(getMessage("messages.newPoll", "alreadyCreated", session.getAttribute("poll").asInstanceOf[Poll].pollTitle::Nil))
      return
    } // In this case, we don't want to recreate the poll once again.
    
    /*val candidates: List[String] = for (param <- request.getParameterNames().asScala.toList; if (param startsWith "candidate"); if (request.getParameter(param) != null); if (!request.getParameter(param).equals("---"))) yield request.getParameter(param)
    val n: Int = candidates.length*/

    val cList: (List[String], Int) = buildCandidateList(Nil, 0)
    val candidates: List[String] = cList._1 reverse
    val n: Int = cList._2
    
    try {
      val pollTitle: String = if (request.getParameter("pollTitle") != null) request.getParameter("pollTitle") else ""
      val pollDescription: String = if (request.getParameter("pollDescription") != null) request.getParameter("pollDescription") else ""
      val anonymity: Int = if (request.getParameter("anonymity") != null) request.getParameter("anonymity").toInt else 0
      val attributes: Map[String, String] = NewPollController.anonymityProfile.get(anonymity) match {case Some(m) => m; case None => throw new Exception("Unmatched anonymity profile " + anonymity)}
      val creationDate: java.util.Date = new java.util.Date()
      val closingDate: java.util.Date = Dates.stringToDate("2082-09-09 10:10:00") // Never closes, basically
      val pollType: Int = if (request.getParameter("pollType") != null) request.getParameter("pollType").toInt else 0
      var preferenceModelId: String = if (request.getParameter("preferences") != null) request.getParameter("preferences") else ""
      if (request.getParameter("preferences") != null) {
    	if (request.getParameter("preferences").equals("ranks")) {
    	  preferenceModelId += "#" + n + "#" + (if (request.getParameter("rankTies") != null) request.getParameter("rankTies") else "0")
    	}
    	if (request.getParameter("preferences").equals("numbers")) {
    	  preferenceModelId += "#" + (if (request.getParameter("min") != null) request.getParameter("min") else "0")
    	    preferenceModelId += "#" + (if (request.getParameter("max") != null) request.getParameter("max") else "5")
    	}
      }
      
      val poll: Poll = Polls.createClassicPoll(pollTitle, pollDescription, creationDate, closingDate, pollType, preferenceModelId, user, candidates, attributes)
      session.setAttribute("poll", poll) // This is to prevent future potential refreshs from creating several poll instances
      request.setAttribute("poll", poll)

      success(getMessage("messages.newPoll", "creationSuccessful", pollTitle::Nil))
      request.getRequestDispatcher("views/newPoll/pollCreationSuccessful.jsp").include(request, response)
      request.getRequestDispatcher("views/pollMenu.jsp").include(request, response)
    } catch {
      case e: java.text.ParseException => throw e
      case e: DataBaseException => throw e
    }
  }

  private def buildCandidateList(l: List[String], n: Int): (List[String], Int) = {
    if (request.getParameter("candidate" + n) == null || request.getParameter("candidate" + n).equals("---")) (l, n) else buildCandidateList(request.getParameter("candidate" + n) :: l, n + 1)
  }
}

object NewPollController {
  val FIRST_STEP: Int = 1
  val SECOND_STEP_CLASSIC: Int = 21
  val SECOND_STEP_DATE: Int = 22
  val THIRD_STEP: Int = 3
  val CREATE_POLL: Int = 4

  val anonymityProfile: Map[Int, Map[String, String]] = Map[Int, Map[String, String]](
    (0 -> {Map[String, String]()}),
    (1 -> {Map[String, String](
      ("anonymize" -> "all"),
      ("listOfVotersVisibility" -> "public"),
      ("participationAllowed#anonymous" -> "no"),
      ("participationAllowed#registered" -> "no"),
      ("participationAllowed#invitation" -> "yes"),
      ("results#open" -> "no"),
      ("results#closed" -> "yes"),
      ("votes#open" -> "no"),
      ("votes#closed" -> "yes")
    )}),
    (2 -> {Map[String, String](
      ("participationAllowed#anonymous" -> "no"),
      ("participationAllowed#registered" -> "no"),
      ("participationAllowed#invitation" -> "yes")
    )})
  )
}
