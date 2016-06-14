<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.common"/>

<ul id="pollMenu">
  <li id="pollPage"><fmt:message key="pollPage"><fmt:param value='<%= "poll.do?id=" + ((whale3.vote.Poll) request.getAttribute("poll")).pollId() %>'/></fmt:message></li>
  <li id="votingPage"><fmt:message key="votePage"><fmt:param value='<%= "vote.do?id=" + ((whale3.vote.Poll) request.getAttribute("poll")).pollId() %>'/></fmt:message></li>
  <li id="resultsPage"><fmt:message key="dataVizPage"><fmt:param value='<%= "dataViz.do?id=" + ((whale3.vote.Poll) request.getAttribute("poll")).pollId() %>'/></fmt:message></li>
<%-- The administration part --%>
  <% if ((session.getAttribute("user") != null) && ((whale3.vote.Poll) request.getAttribute("poll")).isOwnedBy((whale3.vote.User) request.getAttribute("user"))) {%>
  <li id="adminPage"><fmt:message key="adminPage"><fmt:param value='<%= "adminPoll.do?id=" + ((whale3.vote.Poll) request.getAttribute("poll")).pollId() %>'/></fmt:message></li>
  <% } %>
</ul>