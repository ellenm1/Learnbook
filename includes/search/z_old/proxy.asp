<%@LANGUAGE="VBSCRIPT"%>
<%
'gather the required Query Parameters URL, Format, Encoding
'dim url
'url = Request.QueryString("u")
'If url<>"" Then	  
 '   url = "http://10.30.15.145/search"
'End If
 ' response.write("url="&url)
'dim format
'	format = Request.QueryString("f")
'If format<>"" Then	  
'     format = "text/plain"
'End If
 
'dim encoding
'	encoding = Request.QueryString("e")
'If encoding<>"" Then	  
'    encoding = "UTF-8"
'End If
 
 
'create a unique instance NONCE to ensure proxied calls are not cached
dim instanceID
	instanceID = Session.SessionID
' response.write(", instanceID="&instanceID)
 
'perform the HTTP Request 
dim xmlhttp, xml
	set xmlhttp = server.Createobject("MSXML2.ServerXMLHTTP")
	 
	'xmlhttp.Open "GET",url&"instanceID="&instanceID,false	'IF doing a POST:   use --> "POST",url,false
	xmlhttp.Open "GET","http://10.30.15.145/search?q=training&site=mlearning_portal&client=test&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&filter=1&instanceID="&instanceID,false 
	xmlhttp.send "" 
	'"":   set DataToSend = value   then call --->   xmlhttp.send DataToSend
	'"":   also set Content-Type of POST body --->   xmlhttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
 Response.Write xmlhttp.responseText
 
'settings for the response
'Response.ContentType = "text/xml"       'May want to check IF ContentType == "text/xml"
'Response.Charset = "UTF-8"        'UTF-8 should be fine for most uses unless not supported, then go with: 


 'Load XML
set xml = Server.CreateObject("Microsoft.XMLDOM")
xml.async = false
'xml.load(xmlhttp.responseText.xml)

'Load XSL
set xsl = Server.CreateObject("Microsoft.XMLDOM")
xsl.async = false
xsl.load(Server.MapPath("/home/xml/mlearning_portal.xsl"))
 
'Transform file
Response.Write(xml.transformNode(xsl))
 
'Response.Write xmlhttp.responseText 'IF ContentType == "text/xml":   Response.Write xmlhttp.responsexml.xml
Response.End()
Set xmlhttp = nothing
%> 
 
'*************** 
 <%
'Set objDoc = CreateObject("Microsoft.XMLDOM") 
'objDoc.async = False 
'objDoc.load("file.xml") or 
'objDoc.LoadXml(xmlhttp.responseText) 

'Set Node = objXMLDoc.documentElement.selectSingleNode("RES/R/S")

 ' response.write Node.text 
%>