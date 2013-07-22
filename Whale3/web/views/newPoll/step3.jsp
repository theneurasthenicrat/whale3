<%@page contentType="text/html; charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<fmt:setBundle basename="messages.newPoll"/>

<script type="text/javascript" src="./javascript/lib/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="./javascript/common.js"></script>
<script type="text/javascript" src="./javascript/newPoll.js"></script>

<div class="extendedForm">
  <form method="post" action="newPoll.do">
    <h1><fmt:message key="step3Title"/></h1>
    <h2><fmt:message key="step3Subtitle"/></h2>

    <div>
      <div>
	<label><fmt:message key="pollTitle"/></label> <input type="text" name="pollTitle" value='<%= request.getParameter("pollTitle") != null ? request.getParameter("pollTitle") : "" %>'/>
      </div>
      
      <div>
	<label><fmt:message key="pollDescription"/></label> <textarea name="pollDescription"><%= request.getParameter("pollDescription") != null ? request.getParameter("pollDescription") : "" %></textarea>
      </div>
      
      <div>
	<label><fmt:message key="pollType"/></label>
	<select id="anonymitySelect" name="anonymity" onchange="displayInfo(this)">
	  <option value="0"<%= ((request.getParameter("anonymity") == null || request.getParameter("anonymity").equals("0"))) ? " selected=\"selected\"" : "" %>><fmt:message key="openBallots"/></option>
	  <option value="1"<%= ((request.getParameter("anonymity") != null && request.getParameter("anonymity").equals("1"))) ? " selected=\"selected\"" : "" %>><fmt:message key="sealedBallots"/></option>
	</select>
	<span class="inputInformation" id="anonymity0"><fmt:message key="openBallotsDescription"/></span>
	<span class="inputInformation" id="anonymity1"><fmt:message key="sealedBallotsDescription"/></span>
      </div>

      <div>
	<label><fmt:message key="ballotType"/></label>
	<select id="preferenceSelect"  name="preferences" onchange="displayInfo(this); displayRanks(this);">
	  <option value="positiveNegative"<%= ((request.getParameter("preferences") == null || request.getParameter("preferences").equals("positiveNegative"))) ? " selected=\"selected\"" : "" %>><fmt:message key="fiveRates"/></option>
	  <option value="ranks"<%= ((request.getParameter("preferences") != null && request.getParameter("preferences").equals("ranks"))) ? " selected=\"selected\"" : "" %>><fmt:message key="ranks"/></option>
	  <option value="numbers"<%= ((request.getParameter("preferences") != null && request.getParameter("preferences").equals("numbers"))) ? " selected=\"selected\"" : "" %>><fmt:message key="scores"/></option>
	  <option value="approval"<%= ((request.getParameter("preferences") != null && request.getParameter("preferences").equals("approval"))) ? " selected=\"selected\"" : "" %>><fmt:message key="approval"/></option>
	</select>
	<span class="inputInformation" id="preferencespositiveNegative"><fmt:message key="fiveRatesDescription"/></span>
	<span class="inputInformation" id="preferencesranks"><fmt:message key="ranksDescription"/></span>
	<span class="inputInformation" id="preferencesnumbers"><fmt:message key="scoresDescription"/></span>
	<span class="inputInformation" id="preferencesapproval"><fmt:message key="approvalDescription"/></span>
      </div>

      <div id="ranksDiv" style="display: none;" class="radioGroup">
	<input type="radio" name="rankTies" value="0"<%= ((request.getParameter("ranks") == null || request.getParameter("ranks").equals("noTies"))) ? " checked=\"checked\"" : "" %>/><span><fmt:message key="tiesNotAllowed"/></span>
	<input type="radio" name="rankTies" value="1"<%= ((request.getParameter("ranks") != null && request.getParameter("ranks").equals("tiesAllowed"))) ? " checked=\"checked\"" : "" %>/><span><fmt:message key="tiesAllowed"/></span>
      </div>
    </div>

    <% for(int i = 0; i < 100; i++){ %>
    <% request.setCharacterEncoding("UTF-8"); %>
    <input type="hidden" id="candidateInput<%= i %>" name="candidate<%= i %>" value="<%= request.getParameter("candidate" + i) == null ? "---" : request.getParameter("candidate" + i) %>"/>
    <% } %>

    <div>      
      <input type="hidden" name="pollType" value="<%= request.getParameter("pollType") == null ? 0 : request.getParameter("pollType") %>"/>
      <input type="hidden" name="step" value="4"/>
      <input id="next" type="submit" value="Next"/>
    </div>    
  </form>
  <form method="post" action="newPoll.jsp">
    <% for(int i = 0; i < 100; i++){ %>
    <input type="hidden" id="candidateInput<%= i %>" name="candidate<%= i %>" value="<%= request.getParameter("candidate" + i) == null ? "---" : request.getParameter("candidate" + i) %>"/>
    <% } %>

    <div>
      <input type="hidden" name="pollType" value="<%= request.getParameter("pollType") == null ? 0 : request.getParameter("pollType") %>"/>
      <input type="hidden" name="step" value='<%= request.getParameter("pollType").equals("date") ? 22 : 21 %>'/>
      <input id="previous" type="submit" value="Previous"/>
    </div>    
  </form>
</div>

<script type="text/javascript">
window.onload = function() {
    displayInfo(document.getElementById("anonymitySelect"));
    displayInfo(document.getElementById("preferenceSelect"));
    displayRanks(document.getElementById("preferenceSelect"));
}
</script>
