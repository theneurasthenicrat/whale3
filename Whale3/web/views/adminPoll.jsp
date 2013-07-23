<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page contentType="text/html; charset=utf-8"%>

<fmt:setBundle basename="messages.admin" />

<div class="extendedForm">
	<h1>
		<fmt:message key="adminTitle">
			<fmt:param value="${poll.pollTitle}" />
		</fmt:message>
	</h1>
	<%
	  if (((whale3.vote.Poll) request.getAttribute("poll")).invitationRequired()) {
	%>
	<a class="bigMenu" id="manageVoters" href="manageVoters.do?id=${poll.pollId}">
		<span class="label"><fmt:message key="manageVoters" /></span><span
		class="description"><fmt:message key="manageVotersDescription" /></span>
	</a>
	<%
	  }
	%>
	<a class="bigMenu" id="setClosingDate" href="setClosingDate.do?id=${poll.pollId}">
		<span class="label"><fmt:message key="setClosingDate" /></span><span
		class="description"><fmt:message
				key="setClosingDateDescription" /></span>
	</a>
</div>
