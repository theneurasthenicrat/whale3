<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.newPoll"/>

<div class="extendedForm">
  <h1><fmt:message key="step1Title"/></h1>
  <h2><fmt:message key="step1Subtitle"/></h2>
  <a id="classic" href="newPoll.do?step=21">
    <span class="label"><fmt:message key="classic"/></span><span class="description"><fmt:message key="classicDescription"/></span>
  </a>
  <a id="date" href="newPoll.do?step=22">
    <span class="label"><fmt:message key="date"/></span><span class="description"><fmt:message key="dateDescription"/></span>
  </a>
</div>
