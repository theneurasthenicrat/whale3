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

<fmt:setBundle basename="messages.common" />
<fmt:message key="title" var="title" />

<body>
	<div id="indexHeader">
	   <img id="logo" alt="" src="images/whale-logo-dark.png"></img>
		<div class="flags">
			<span class="flagbutton"> <a href="setLanguage.do?language=fr">
					<img class="flag" src="images/french.png" alt="french flag" />
			</a>
			</span> <span class="flagbutton"> <a
				href="setLanguage.do?language=en"> <img class="flag"
					src="images/english.png" alt="english flag" />
			</a>
			</span>
		</div>
	</div>

	<div id="indexMain">
		<div id="indexMainContent">
			<h1>
				<fmt:message key="welcomeTitle" />
			</h1>

			<p>
				<fmt:message key="welcomeMsg" />
			</p>
		</div>
		<div id="indexMainMenu">
			<a class="bigIndexMenu" id="indexTryIt" href="poll.do?id=1"> <span
				class="label"><fmt:message key="tryItLabel" /></span> <span
				class="description"><fmt:message key="tryItDescription" /></span>
			</a>
            <a class="bigIndexMenu" id="indexConnect" href="login.do"> <span
                class="label"><fmt:message key="connectLabel" /></span> <span
                class="description"><fmt:message key="connectDescription" /></span>
            </a>
            <a class="bigIndexMenu" id="indexCreatePoll" href="newPoll.do"> <span
                class="label"><fmt:message key="createPollLabel" /></span> <span
                class="description"><fmt:message key="createPollDescription" /></span>
            </a>
		</div>
	</div>