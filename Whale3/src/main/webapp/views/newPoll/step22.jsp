<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.newPoll"/>

<link rel="stylesheet" href="./stylesheets/jquery-ui-1.8.21.custom.css"/>
<script type="text/javascript" src="./javascript/lib/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="./javascript/lib/jquery-ui-1.8.21.custom.min.js"></script>
<script type="text/javascript" src="./javascript/lib/jquery-ui.multidatespicker.js"></script>
<script type="text/javascript" src="./javascript/common.js"></script>
<script type="text/javascript" src="./javascript/newDatePoll.js"></script>

<div class="extendedForm">
  <form method="post" action="newPoll.do">
    <h1><fmt:message key="step21Title"/></h1>
    <h2><fmt:message key="step21Subtitle"/></h2>

    <span class="inputInformation"><fmt:message key="step22Info"/></span>

    <div id="buttonAddTimeSlots" style="display: none;">
      <a href="#" onClick="showTSDiv()"><fmt:message key="addTimeSlots"/></a>
    </div>
    <div id="addTimeSlots" style="display: block;">
      <div id="calendar"></div>
      <div id="timeSlots" style="display: none;">
	<h3><fmt:message key="giveTimeSlots"/></h3>

	<div id="timeSlot0" style="display: block;">
	  <label><fmt:message key="timeSlot"><fmt:param value="1"/></fmt:message></label> <input type="text" id="timeSlotInput0" name="timeSlot0" value='<%= request.getParameter("timeSlot0") == null ? "" : request.getParameter("timeSlot0") %>' autofocus="autofocus" onKeyPress="showNextOnTab(event, 0);"/>
	  <span style="display: none;" class="remove" title="<fmt:message key="removeTimeSlot"/>" id="removeTimeSlot0" onclick="removeTimeSlot(0)">remove</span>
	  <span class="add" title="<fmt:message key="addTimeSlot"/>" id="addTimeSlot1" onclick="addTimeSlot(1)"><span class="icon-plus icon2x"></span></span>
	</div>
	
	<% for(int i = 1; i < 10; i++){ %>
	
	<div id="timeSlot<%= i %>" style="display: none;">
	<label><fmt:message key="timeSlot"><fmt:param value="<%= i+1 %>"/></fmt:message></label> <input type="text" id="timeSlotInput<%= i %>" name="timeSlot<%= i %>" value="<%= request.getParameter("timeSlot" + i) == null ? "---" : request.getParameter("timeSlot" + i) %>" onKeyPress="showNextOnTab(event, <%= i %>)"/>
	<span class="remove" title="<fmt:message key="removeTimeSlot"/>" id="removeTimeSlot<%= i %>" onclick="removeTimeSlot(<%= i %>)">remove</span>
	<span class="add" title="<fmt:message key="addTimeSlot"/>" id="addTimeSlot<%= i+1 %>" onclick="addTimeSlot(<%= i+1 %>)"><span class="icon-plus icon2x"></span></span>
      </div>
      
      <% } %>
      
      </div>
      <br/>
      <div id="confirmTimeSlots">
	<a href="#" onClick="confirmTimeSlots()"><fmt:message key="addTheseTimeSlots"/></a>
      </div>
    </div>
    
    <div id="dateCandidateList">
      <h3><fmt:message key="candidateListTitle"/></h3>
      <% for(int i = 0; i < 100; i++){ %>      
      <div id="candidate<%= i %>" style="display: none;">
      <input type="text" class="date" id="date<%= i %>" value="<%= request.getParameter("date" + i) == null ? "" : request.getParameter("date" + i) %>"/> <i class="icon-chevron_right"></i> <input type="text" class="timeSlotLabel" id="timeSlotLabel<%= i %>" value="<%= request.getParameter("timeSlotLabel" + i) == null ? "---" : request.getParameter("timeSlotLabel" + i) %>"/> <input type="hidden" id="candidateInput<%= i %>" name="candidate<%= i %>" value="<%= request.getParameter("candidate" + i) == null ? "---" : request.getParameter("candidate" + i) %>"/>
      <span class="remove" title="Remove this candidate" id="removeCandidate<%= i %>" onclick='removeCandidate(<%= i %>)'>remove</span>
    </div>
    <% } %>
  </div>

    <div>
      <input type="hidden" name="pollType" value="1"/>
      <input type="hidden" name="step" value="3"/>
      <input id="next" type="submit" value="Next"/>
    </div>    
  </form>
  <a href="newPoll.do"><button id="previous">Previous</button></a>

  <span style="display: none" id="hiddenLabelFor"><fmt:message key="for"/></span>
  <span style="display: none" id="hiddenLabelForThese"><fmt:message key="forThese"/></span>
  <span style="display: none" id="hiddenLabelDates"><fmt:message key="dates"/></span>
</div>

