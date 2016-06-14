<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.login"/>

<form method="POST" action="login.do">
  <div class="form">
    <h1><span class="icon icon-user whaleicon"></span> <fmt:message key="loginTitle"/></h1>
    <div>
      <label><fmt:message key="emailAddress"/></label> <input type="email" name="eMail" required="required"/>
    </div>
    <div>
      <label><fmt:message key="password"/></label> <input type="password" name="password" required="required"/>
    </div>
    <div>
      <input type="submit" value='<fmt:message key="loginButton"/>'/>
    </div>
  </div>
</form>

