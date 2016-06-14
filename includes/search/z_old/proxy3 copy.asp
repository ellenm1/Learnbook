<%@LANGUAGE="VBSCRIPT"%>
<%
Response.Buffer = True
Dim xml, xsl, xml2, q

q = Request.QueryString("q")
'If format<>"" Then	  
'     format = "text/plain"
'End If
' create a ServerXMLHTTP object:
Set xml = Server.CreateObject("MSXML2.ServerXMLHTTP")

' Opens the connection to the remote server.
'xml.Open "GET","http://10.30.15.145/search?q=training&site=mlearning_portal&client=test&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&filter=1&output=xml_no_dtd&instanceID="&instanceID,false 
xml.Open "GET","http://10.30.15.145/search?q=training&site=mlearning_portal&client=test&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&filter=1&output=xml_no_dtd",false 
'xml.Open "GET","http://141.214.15.11/proxy/test2.xml&instanceID="&instanceID,false
'xml.Open "GET","http://thedesignspace.net/misc/test2.xml",false
' Actually Sends the request and returns the data:
xml.Send
 
'Response.Write xml.responseText


Set xml2 = Server.CreateObject("MSXML2.DOMDocument")
xml2.async = false

xml2.loadXML xml.responseText
'response.write("**********<br/>"&xml2.xml)
'check that the XML is being parsed correctly
If xml2.parseError.errorCode <> 0 Then
	Response.Write "Parsing error - " & xml2.parseError.reason
	Response.End
End If


' load stylesheet
set xsl = Server.CreateObject("MSXML2.DOMDocument")
xsl.async = false
xsl.load(Server.MapPath("/home/pages/searchresults.xsl"))
'xsl.load(Server.MapPath("/home/pages/mlearning_portal.xsl"))
'Display
Response.Write xml2.transformNode(xsl)
Set xml = Nothing
Set xml2 = Nothing
Set xsl = Nothing
'http://www.sitepoint.com/forums/showthread.php?434180-ASP-XML-HTTP-Request-amp-xml-transformNode(xsl)
%>

