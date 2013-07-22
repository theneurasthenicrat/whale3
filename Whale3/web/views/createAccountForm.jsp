<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page contentType="text/html; charset=utf-8" %>

<fmt:setBundle basename="messages.login"/>

<form method="POST" action="createAccount.do">
  <div class="form">
    <h1><i class="icon icon-user whaleicon"></i> <fmt:message key="accountCreationTitle"/></h1>
    <div>
      <label><fmt:message key="name"/></label> <input type="text" required="required" name="nickName" value='<%= request.getParameter("nickName") != null ? request.getParameter("nickName") : "" %>'/>
    </div>
    <div>
      <label><fmt:message key="eMail"/></label> <input type="email" required="required" name="eMail" value='<%= request.getParameter("eMail") != null ? request.getParameter("eMail") : "" %>'/>
    </div>
    <div>
      <label><fmt:message key="password"/></label> <input type="password" name="password"/>
    </div>
    <div>
      <label><fmt:message key="passwordConfirmation"/></label> <input type="password" name="passwordConfirmation"/>
    </div>
    <div>
      <input type="submit" value="OK"/>
    </div>
  </div>
</form>