<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.poll"/>

<form method="POST" action=<%= "vote.do?id=" + request.getParameter("id") %>>
  <div class="form">
    <h1><i class="icon icon-lock whaleicon"></i> <fmt:message key="certificateTitle"/></h1>
    <div>
      <label><fmt:message key="certificate"/></label> <input type="text" name="certificate" required="required"/>
    </div>
    <div>
      <input type="submit" value='<fmt:message key="loginButton"/>'/>
    </div>
  </div>
</form>

