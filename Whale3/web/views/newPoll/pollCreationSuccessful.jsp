<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.newPoll"/>

<%
String contextPath = request.getContextPath();
String protocol=request.getScheme();
String domain=request.getServerName();
String port=Integer.toString(request.getServerPort());
String path = protocol + "://" + domain + ":" + port + contextPath + "/";
%>

<div id="pollCreated">
  <fmt:message key="votingPageAccess"><fmt:param value='<%= path + "vote.do?id=" + ((whale3.vote.Poll) request.getAttribute("poll")).pollId() %>'/></fmt:message>
</div>
