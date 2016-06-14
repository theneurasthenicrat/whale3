<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page contentType="text/html; charset=UTF-8"%>

<fmt:setBundle basename="messages.common" />

<!DOCTYPE html>
<html lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Style-Type" content="text/css" />
<meta http-equiv="Content-Language" content="en" />
<meta charset="utf-8" />
<title><%=request.getAttribute("title")%></title>
<link rel="stylesheet" type="text/css" href="stylesheets/whale3.css" />
</head>

<body>
	<c:import url="loginBox.do" />
	<%
	  if ((Boolean) request.getAttribute("menu")) {
	%>
	<ul id="menu">
		<li id="homeMenu"><a href="index.do"><fmt:message key="home" /></a></li>
		<li id="newPollMenu"><a href="newPoll.do"><fmt:message
					key="newPoll" /></a></li>
		<%
		  if (session.getAttribute("user") == null) {
		%>
		<li id="createAccountMenu"><a href="createAccount.do"><fmt:message
					key="createAccount" /></a></li>
		<%
		  }
		%>
		<li id="documentationMenu"><a href="createAccount.do"><fmt:message
					key="documentation" /></a></li>
		<li id="developerMenu"><a href="#"><fmt:message
					key="developers" /></a>
			<ul class="submenu">
				<li id="downloadMenu"><a href="createAccount.do"><fmt:message
							key="download" /></a></li>
				<li id="codeMenu"><a
					href="https://github.com/theneurasthenicrat/whale3"><fmt:message
							key="code" /></a></li>
			</ul></li>
		<%
		  if (session.getAttribute("user") != null) {
		%>
		<li id="accountMenu"><a href="#"><fmt:message key="myAccount" /></a>
			<ul class="submenu">
				<li id="myPollsMenu"><a href="myPolls.do"><fmt:message
							key="myPolls" /></a></li>
			</ul></li>
		<%
		  }
		%>
	</ul>
	<%
	  }
	%>
	<div class="flags">
		<span class="flagbutton"> <a href="setLanguage.do?language=fr">
				<img class="flag" src="images/french.png" alt="french flag" />
		</a>
		</span> <span class="flagbutton"> <a href="setLanguage.do?language=en">
				<img class="flag" src="images/english.png" alt="english flag" />
		</a>
		</span>
	</div>
	<div id="main">