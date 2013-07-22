<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page contentType="text/html; charset=utf-8" %>


<fmt:setBundle basename="messages.poll"/>
<fmt:message key="dataVizMessagesPath" var="dataVizMessages"/>
<script type="text/javascript" src="${dataVizMessages}"></script>

<script type="text/javascript" src="javascript/lib/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="javascript/lib/d3.v2.js"></script>
<script type="text/javascript" src="javascript/common.js"></script>
<script type="text/javascript" src="javascript/dataViz/common.js"></script>
<script type="text/javascript" src="javascript/dataViz/scoring.js"></script>
<script type="text/javascript" src="javascript/dataViz/condorcet.js"></script>
<script type="text/javascript" src="javascript/dataViz/runoff.js"></script>
<script type="text/javascript" src="javascript/voting.js"></script>
<link rel="stylesheet" type="text/css" href="stylesheets/dataViz.css" />
<%
String contextPath = request.getContextPath();
String protocol=request.getScheme();
String domain=request.getServerName();
String port=Integer.toString(request.getServerPort());
String path = protocol + "://" + domain + ":" + port + contextPath + "/";
%>


<div id="dataVizThumbnails"></div>
<div id="currentDataViz" class="dataVizDiv"></div>

<script type="text/javascript">
// Gets the JSON representation of the current poll...
$.getJSON("<%= path + "poll.do-json?id=" + ((whale3.vote.Poll) request.getAttribute("poll")).pollId() %>", function(data) {
    json = data;
    candidates = data.candidates;    
    if (data.type == 1) {
	candidates = candidates.map(function(candidate) {
	    return parseDate(candidate);
	});
    }
    votes = data.votes;

    // Display the dataViz thumbnails
    displayThumbnails();
});

</script>

