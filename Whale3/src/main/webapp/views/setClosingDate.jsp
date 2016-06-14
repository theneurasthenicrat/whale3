<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page contentType="text/html; charset=utf-8"%>

<fmt:setBundle basename="messages.admin" />

<link rel="stylesheet" href="./stylesheets/jquery-ui.css" />
<script type="text/javascript"
	src="./javascript/lib/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="./javascript/lib/jquery-ui.js"></script>
<script type="text/javascript" src="./javascript/common.js"></script>

<script type="text/javascript">
	$(function() {
		$("#closingDate").datepicker();
		$("#closingDate").datepicker("option", "dateFormat", "yy-mm-dd");
	});
</script>

<div class="extendedForm">
	<h1>
		<fmt:message key="setClosingDate" />
	</h1>
	<form method="post"
		action='setClosingDate.do?id=<%=request.getParameter("id")%>'>
		<input type="radio" name="nowOrLater" value="now" checked="checked"
			onClick="hide('closingTimestamp')" /> <fmt:message
				key="closeNow" />
		<fmt:message key="or" />
		<input type="radio" name="nowOrLater" value="later"
			onClick="show('closingTimestamp')" /> <fmt:message
				key="setFutureDate" />
		<div id="closingTimestamp" style="display: none">
			<fmt:message key="closingDate" />
			<input type="text" name="closingDate" id="closingDate" /> <select
				name="closingHour" style="width=20px;">
				<option value="00">00</option>
				<option value="01">01</option>
				<option value="02">02</option>
				<option value="03">03</option>
				<option value="04">04</option>
				<option value="05">05</option>
				<option value="06">06</option>
				<option value="07">07</option>
				<option value="08">08</option>
				<option value="09">09</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
				<option value="15">15</option>
				<option value="16">16</option>
				<option value="17">17</option>
				<option value="18">18</option>
				<option value="19">19</option>
				<option value="20">20</option>
				<option value="21">21</option>
				<option value="22">22</option>
				<option value="23">23</option>
			</select> : <select name="closingMinute" style="width=20px;">
				<option value="00">00</option>
				<option value="15">15</option>
				<option value="30">30</option>
				<option value="45">45</option>
			</select>
		</div>
    
    <div>
      <input type="hidden" name="pollType" value="0"/>
      <input type="hidden" name="step" value="3"/>
      <input id="next" type="submit" value="OK"/>
    </div>    
  </form>
  <a href='adminPoll.do?id=<%=request.getParameter("id")%>'><button id="previous"><fmt:message key="cancel" /></button></a>
</div>
