<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<fmt:setBundle basename="messages.common"/>
<div class="loginBox">
  <fmt:message key="connectedAs">
    <fmt:param value="${user.nickName}"/>
  </fmt:message><br/>
  <i class="icon icon-signout whaleicon"></i><a href="logout.do"><fmt:message key="logout"/></a>
</div>