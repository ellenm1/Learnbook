<%@LANGUAGE="VBSCRIPT"%>
<style>
li.pagination{float:left;margin-right:12px;list-style: none;font:12px normal "Helvetica", Arial, sans-serif;   }
div.paginator ul{margin:0 auto 0 auto;text-align: center;}
</style>
<%
Response.Buffer = True
Dim xml, xsl, xml2, q,start

q = Request.QueryString("q")
start = Request.QueryString("start")
'If q<>"" Then	  
'     q = q
'End If
' create a ServerXMLHTTP object:
Set xml = Server.CreateObject("MSXML2.ServerXMLHTTP")

' Opens the connection to the remote server.
'xml.Open "GET","http://10.30.15.145/search?q=training&site=mlearning_portal&client=test&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&filter=1&output=xml_no_dtd&instanceID="&instanceID,false 
xml.Open "GET","http://10.30.15.145/search?q="&q&"&site=mlearning_portal&client=test&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&filter=1&output=xml_no_dtd"&start,false 
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

