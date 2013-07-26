<%@page contentType="text/html; charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<fmt:setBundle basename="messages.newPoll"/>

<script type="text/javascript" src="./javascript/lib/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="./javascript/common.js"></script>
<script type="text/javascript" src="./javascript/newPoll.js"></script>

<div class="extendedForm">
  <form method="post" action="newPoll.do">
    <h1><fmt:message key="step21Title"/></h1>
    <h2><fmt:message key="step21Subtitle"/></h2>
    <span class="inputInformation"><fmt:message key="step21Info"/></span>


    <div id="candidate0" style="display: block;">
      <label><fmt:message key="candidate"><fmt:param value="1"/></fmt:message></label> <input type="text" id="candidateInput0" name="candidate0" value='<%= request.getParameter("candidate0") == null ? "" : request.getParameter("candidate0") %>' autofocus="autofocus" onkeyDown="showNextOnTab(event, 0);"/>
      <span style="display: none;" class="remove" title="<fmt:message key="removeCandidate"/>" id="remove0" onclick="remove(0)">remove</span>
      <span class="add" title="<fmt:message key="addCandidate"/>" id="add1" onclick="add(1)"><span class="icon-plus icon2x"></span></span>
    </div>

    <% for(int i = 1; i < 100; i++){ %>

    <div id="candidate<%= i %>" style="display: none;">
    <label><fmt:message key="candidate"><fmt:param value="<%= i+1 %>"/></fmt:message></label> <input type="text" id="candidateInput<%= i %>" name="candidate<%= i %>" value="<%= request.getParameter("candidate" + i) == null ? "---" : request.getParameter("candidate" + i) %>" onkeyDown="showNextOnTab(event, <%= i %>)"/>
      <span class="remove" title="<fmt:message key="removeCandidate"/>" id="remove<%= i %>" onclick="remove(<%= i %>)">remove</span>
      <span class="add" title="<fmt:message key="addCandidate"/>" id="add<%= i+1 %>" onclick="add(<%= i+1 %>)"><span class="icon-plus icon2x"></span></span>
    </div>
    
    <% } %>
    
    <div>
      <input type="hidden" name="pollType" value="0"/>
      <input type="hidden" name="step" value="3"/>
      <input id="next" type="submit" value="Next"/>
    </div>    
  </form>
  <a href="newPoll.do"><button id="previous">Previous</button></a>
</div>

<script type="text/javascript">
window.onload = function() {
    displayInitialCandidates();
}
</script>

